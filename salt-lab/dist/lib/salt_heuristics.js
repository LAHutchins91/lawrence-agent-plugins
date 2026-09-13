/**
 * Shared Salt state/pillar YAML text helpers.
 * Pure YAML/string/regex heuristics — no salt CLI, minion/master, network, filesystem follow, or eval.
 */
import { parse, parseAllDocuments } from "yaml";
export function asMap(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value;
    }
    return null;
}
export function strField(map, key) {
    if (!map)
        return undefined;
    const v = map[key];
    if (v === undefined || v === null)
        return undefined;
    if (typeof v === "object") {
        try {
            return JSON.stringify(v);
        }
        catch {
            return undefined;
        }
    }
    const s = String(v).trim();
    return s === "" ? undefined : s;
}
/** Best-effort YAML parse; returns null on empty/invalid. */
export function parseYamlObject(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed)
        return null;
    try {
        return parse(trimmed);
    }
    catch {
        return null;
    }
}
export function parseYamlDocs(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed)
        return [];
    try {
        const docs = parseAllDocuments(trimmed);
        const out = [];
        for (const doc of docs) {
            if (doc.errors && doc.errors.length > 0)
                continue;
            const raw = doc.toJSON();
            if (raw === null || raw === undefined)
                continue;
            out.push(raw);
        }
        return out;
    }
    catch {
        return [];
    }
}
const SECRET_KEY_RE = /(?:^|[_.-])(password|passwd|secret|token|api[_-]?key|access[_-]?key|private[_-]?key|auth[_-]?token|client[_-]?secret)(?:$|[_.-])/i;
function isSecretKeyName(name) {
    return (SECRET_KEY_RE.test(name) ||
        /^(password|passwd|secret|token)$/i.test(name));
}
/** Known Salt execution/state module.function pattern (e.g. pkg.installed). */
const MODULE_FUN_RE = /^([A-Za-z_][\w]*)\.([A-Za-z_][\w]*)$/;
function parseModuleFun(key) {
    const m = MODULE_FUN_RE.exec(key.trim());
    if (!m)
        return null;
    return { module: m[1], fun: m[2] };
}
/**
 * Extract state IDs and modules from SLS YAML.
 * Salt SLS shape:
 *   state_id:
 *     pkg.installed:
 *       - name: nginx
 *     service.running:
 *       - enable: True
 */
export function extractStates(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed)
        return [];
    const states = [];
    const seen = new Set();
    const push = (info) => {
        const key = `${info.id ?? ""}|${info.module ?? ""}|${info.fun ?? ""}`;
        if (seen.has(key))
            return;
        seen.add(key);
        states.push(info);
    };
    const docs = parseYamlDocs(trimmed);
    for (const doc of docs) {
        const map = asMap(doc);
        if (!map)
            continue;
        for (const [stateId, body] of Object.entries(map)) {
            // Skip Salt special keys
            if (stateId === "include" ||
                stateId === "extend" ||
                stateId === "exclude" ||
                stateId.startsWith(".")) {
                continue;
            }
            const bodyMap = asMap(body);
            if (!bodyMap) {
                // Could be a requisites-only or bare scalar — still record the ID
                if (typeof body === "string" || Array.isArray(body) || body === null) {
                    // Skip pure include-style lists at top under known keys already handled
                    continue;
                }
                continue;
            }
            let foundModule = false;
            for (const key of Object.keys(bodyMap)) {
                const mf = parseModuleFun(key);
                if (mf) {
                    foundModule = true;
                    push({ id: stateId, module: `${mf.module}.${mf.fun}`, fun: mf.fun });
                }
            }
            if (!foundModule) {
                // State ID present but no module.function — still useful inventory
                // Only if it looks like a state dict (has requisites or name keys)
                const looksState = "name" in bodyMap ||
                    "names" in bodyMap ||
                    "require" in bodyMap ||
                    "watch" in bodyMap ||
                    "onchanges" in bodyMap ||
                    "unless" in bodyMap ||
                    "onlyif" in bodyMap ||
                    "creates" in bodyMap;
                if (looksState) {
                    push({ id: stateId });
                }
            }
        }
    }
    // Regex fallback for partial / Jinja-heavy SLS
    if (states.length === 0) {
        const blockRe = /(?:^|\n)([A-Za-z0-9_./:-][^\n:]*?):\s*\n((?:[ \t]+.+\n?)*)/g;
        let m;
        while ((m = blockRe.exec(trimmed)) !== null) {
            const id = m[1].trim();
            if (!id ||
                id === "include" ||
                id === "extend" ||
                id === "exclude" ||
                id.startsWith("{") ||
                id.startsWith("%")) {
                continue;
            }
            const body = m[2] || "";
            const modRe = /^[ \t]+([A-Za-z_][\w]*\.[A-Za-z_][\w]*)\s*:/gm;
            let mm;
            let any = false;
            while ((mm = modRe.exec(body)) !== null) {
                const mf = parseModuleFun(mm[1]);
                if (mf) {
                    any = true;
                    push({ id, module: `${mf.module}.${mf.fun}`, fun: mf.fun });
                }
            }
            if (!any && /[ \t]+(?:name|require|watch|unless|creates)\s*:/.test(body)) {
                push({ id });
            }
        }
    }
    return states;
}
function collectKeys(obj, into, secrets, depth = 0) {
    if (depth > 8)
        return;
    const map = asMap(obj);
    if (!map)
        return;
    for (const key of Object.keys(map)) {
        into.add(key);
        if (isSecretKeyName(key))
            secrets.add(key);
        const child = map[key];
        if (asMap(child))
            collectKeys(child, into, secrets, depth + 1);
    }
}
/** Extract pillar keys from pillar YAML / {% pillar %} / pillar.get refs. */
export function extractPillars(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed)
        return { pillars: [], secretKeyNames: [] };
    const pillars = new Set();
    const secrets = new Set();
    // YAML key tree (typical pillar file)
    const docs = parseYamlDocs(trimmed);
    for (const doc of docs) {
        collectKeys(doc, pillars, secrets);
    }
    // Jinja / Salt pillar refs
    // pillar['db']['password'] / pillar["foo"]
    const bracketRe = /\bpillar\s*((?:\[[^\]]+\])+)/gi;
    let m;
    while ((m = bracketRe.exec(trimmed)) !== null) {
        const parts = [...m[1].matchAll(/\[\s*['"]?([^\]'"]+)['"]?\s*\]/g)];
        for (const p of parts) {
            const key = p[1].trim();
            if (key) {
                pillars.add(key);
                if (isSecretKeyName(key))
                    secrets.add(key);
            }
        }
        // Also store dotted path for convenience
        if (parts.length) {
            const path = parts.map((p) => p[1].trim()).join(".");
            if (path)
                pillars.add(path);
        }
    }
    // pillar.get('key') / pillar.get("key", default)
    const getRe = /\bpillar\.get\s*\(\s*['"]([^'"]+)['"]/gi;
    while ((m = getRe.exec(trimmed)) !== null) {
        const key = m[1].trim();
        if (key) {
            pillars.add(key);
            if (isSecretKeyName(key))
                secrets.add(key);
            // dotted path segments
            for (const seg of key.split(/[:.]/)) {
                if (seg) {
                    pillars.add(seg);
                    if (isSecretKeyName(seg))
                        secrets.add(seg);
                }
            }
        }
    }
    // salt['pillar.get']('key') / salt["pillar.get"]("key")
    const saltGetRe = /\bsalt\s*\[\s*['"]pillar\.get['"]\s*\]\s*\(\s*['"]([^'"]+)['"]/gi;
    while ((m = saltGetRe.exec(trimmed)) !== null) {
        const key = m[1].trim();
        if (key) {
            pillars.add(key);
            if (isSecretKeyName(key))
                secrets.add(key);
            for (const seg of key.split(/[:.]/)) {
                if (seg) {
                    pillars.add(seg);
                    if (isSecretKeyName(seg))
                        secrets.add(seg);
                }
            }
        }
    }
    // {% set x = pillar.get(...) %} already covered; also {% pillar %}
    // salt['pillar.get'] already covered
    // Regex fallback for top-level YAML keys if parse failed
    if (pillars.size === 0) {
        const keyRe = /(?:^|\n)([A-Za-z_][\w.-]*)\s*:/g;
        while ((m = keyRe.exec(trimmed)) !== null) {
            const key = m[1];
            if (key === "include" ||
                key === "extend" ||
                MODULE_FUN_RE.test(key)) {
                continue;
            }
            pillars.add(key);
            if (isSecretKeyName(key))
                secrets.add(key);
        }
    }
    return {
        pillars: [...pillars],
        secretKeyNames: [...secrets],
    };
}
/** Detect grain refs: grains[...], grains.get, salt['grains.get'], jinja grains. */
export function extractGrains(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed)
        return [];
    const grains = new Set();
    const add = (raw) => {
        const n = raw.trim();
        if (!n)
            return;
        grains.add(n);
    };
    // grains['os'] / grains["os_family"] / grains['os']['family']
    const bracketRe = /\bgrains\s*((?:\[[^\]]+\])+)/gi;
    let m;
    while ((m = bracketRe.exec(trimmed)) !== null) {
        const parts = [...m[1].matchAll(/\[\s*['"]?([^\]'"]+)['"]?\s*\]/g)];
        for (const p of parts)
            add(p[1].trim());
        if (parts.length) {
            add(parts.map((p) => p[1].trim()).join("."));
        }
    }
    // grains.get('os') / grains.get("os_family", 'Linux')
    const getRe = /\bgrains\.get\s*\(\s*['"]([^'"]+)['"]/gi;
    while ((m = getRe.exec(trimmed)) !== null) {
        add(m[1]);
    }
    // salt['grains.get']('os') / salt["grains.get"]("os")
    const saltGetRe = /\bsalt\s*\[\s*['"]grains\.get['"]\s*\]\s*\(\s*['"]([^'"]+)['"]/gi;
    while ((m = saltGetRe.exec(trimmed)) !== null) {
        add(m[1]);
    }
    // salt['grains.item']('os')
    const saltItemRe = /\bsalt\s*\[\s*['"]grains\.(?:item|items)['"]\s*\]\s*\(\s*['"]([^'"]+)['"]/gi;
    while ((m = saltItemRe.exec(trimmed)) !== null) {
        add(m[1]);
    }
    // Jinja: {% if grains['os'] == 'Ubuntu' %} already covered by bracketRe
    // Also: {{ grains.os }} attribute style (less common)
    const attrRe = /\bgrains\.([A-Za-z_][\w]*)\b/gi;
    while ((m = attrRe.exec(trimmed)) !== null) {
        if (m[1] !== "get" && m[1] !== "item" && m[1] !== "items") {
            add(m[1]);
        }
    }
    return [...grains];
}
function looksLikeSalt(text) {
    return (/\b[A-Za-z_][\w]*\.(?:installed|running|managed|absent|latest|exists|directory|symlink|recurse|watch|mod_watch)\b/.test(text) ||
        /\b(?:pkg|service|file|cmd|user|group|cron|mount|git|docker_container)\.[A-Za-z_]/.test(text) ||
        /\bpillar\b/i.test(text) ||
        /\bgrains\b/i.test(text) ||
        /\bsalt\s*\[\s*['"](?:pillar|grains)\./i.test(text) ||
        /\binclude\s*:/i.test(text) ||
        extractStates(text).length > 0);
}
function hasPlaintextPassword(text) {
    // password/secret/token keys with literal non-Jinja/non-pillar string values
    return /(?:password|passwd|secret|token|api[_-]?key)\s*:\s*["']?(?!\{[{%]|salt\[|pillar)[^\s"'#]{3,}/i.test(text);
}
function cmdRunWithoutGuard(text) {
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
        if (/\bcmd\.run\s*:/.test(lines[i])) {
            let window = lines[i];
            const baseIndent = (lines[i].match(/^([ \t]*)/) || ["", ""])[1].length;
            for (let j = i + 1; j < Math.min(i + 40, lines.length); j++) {
                const indent = (lines[j].match(/^([ \t]*)/) || ["", ""])[1].length;
                // Next sibling state ID or next module.fun at same/less indent under parent
                if (j > i &&
                    indent <= baseIndent &&
                    lines[j].trim() !== "" &&
                    !lines[j].trim().startsWith("-") &&
                    !lines[j].trim().startsWith("#")) {
                    // Could be next module under same state (same indent as cmd.run) or next state ID
                    if (/^[A-Za-z0-9_./:-].*:\s*$/.test(lines[j].trim()) || /\b[A-Za-z_][\w]*\.[A-Za-z_]/.test(lines[j])) {
                        break;
                    }
                }
                window += "\n" + lines[j];
            }
            if (!/\bunless\s*:/.test(window) &&
                !/\bonlyif\s*:/.test(window) &&
                !/\bcreates\s*:/.test(window)) {
                return true;
            }
        }
    }
    return false;
}
function pkgLatestTip(text) {
    return /\bpkg\.latest\s*:/i.test(text);
}
function missingStateModule(text) {
    // Has something that looks like a state ID block but no module.function
    const states = extractStates(text);
    if (states.length === 0) {
        // top-level keys with indented body but no module.fun
        if (/(?:^|\n)[A-Za-z0-9_./:-][^\n:]*:\s*\n[ \t]+/.test(text) &&
            !/\b[A-Za-z_][\w]*\.[A-Za-z_][\w]*\s*:/.test(text) &&
            !/\bpillar\b/i.test(text) &&
            !/\bgrains\b/i.test(text)) {
            return true;
        }
        return false;
    }
    return states.some((s) => !s.module);
}
export function lintSalt(text) {
    const findings = [];
    const trimmed = (text ?? "").trim();
    if (!trimmed) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Provide non-empty Salt SLS/pillar YAML text. This tool only analyzes the string you pass — it never reads the filesystem or runs salt/minion/master.",
        });
        return findings;
    }
    if (!looksLikeSalt(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "empty_source",
            advice: "No clear Salt patterns found (state module.function, pillar/grains refs, include). Paste SLS or pillar YAML text. Educational tip only.",
        });
        return findings;
    }
    if (missingStateModule(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "missing_state_module",
            advice: "One or more state IDs appear without a `module.function` declaration (e.g. `pkg.installed`, `file.managed`). Educational tip only — this tool never runs Salt.",
        });
    }
    if (hasPlaintextPassword(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "plaintext_password",
            advice: "Possible plaintext password/secret/token literal in Salt YAML. Prefer pillar + encrypted backends, GPG renderers, or CI secrets — never commit credentials. Key/value heuristic only (not an exploit guide).",
        });
    }
    if (cmdRunWithoutGuard(trimmed)) {
        findings.push({
            severity: "info",
            rule: "cmd_run_without_guard",
            advice: "`cmd.run` without `unless` / `onlyif` / `creates` may re-run on every highstate. Prefer idempotent state modules when possible. Educational tip only.",
        });
    }
    if (pkgLatestTip(trimmed)) {
        findings.push({
            severity: "info",
            rule: "pkg_latest_tip",
            advice: "`pkg.latest` can make highstates non-reproducible across time. Prefer `pkg.installed` with pinned versions when stability matters. Educational tip only.",
        });
    }
    const seen = new Set();
    const deduped = [];
    for (const f of findings) {
        const key = `${f.rule}|${f.advice}`;
        if (seen.has(key))
            continue;
        seen.add(key);
        deduped.push(f);
    }
    return deduped;
}
