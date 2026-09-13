/**
 * Shared Packer HCL/JSON text helpers.
 * Pure regex/string heuristics — no packer CLI, build/deploy, network, filesystem follow, or eval.
 */
const MAX_CHARS = 1_048_576;
export function clampText(text) {
    const t = text ?? "";
    if (t.length > MAX_CHARS)
        return t.slice(0, MAX_CHARS);
    return t;
}
/** Strip hash, line, and block comments loosely; keep string contents. */
export function stripCommentsKeepStrings(raw) {
    let s = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
    const out = [];
    let i = 0;
    while (i < s.length) {
        if (s[i] === '"') {
            out.push('"');
            i++;
            while (i < s.length) {
                if (s[i] === "\\") {
                    out.push(s[i], s[i + 1] ?? "");
                    i += 2;
                    continue;
                }
                if (s[i] === '"') {
                    out.push('"');
                    i++;
                    break;
                }
                if (s[i] === "\n")
                    break;
                out.push(s[i]);
                i++;
            }
            continue;
        }
        if (s[i] === "/" && s[i + 1] === "/") {
            i += 2;
            while (i < s.length && s[i] !== "\n")
                i++;
            continue;
        }
        if (s[i] === "#") {
            i++;
            while (i < s.length && s[i] !== "\n")
                i++;
            continue;
        }
        if (s[i] === "/" && s[i + 1] === "*") {
            i += 2;
            while (i < s.length && !(s[i] === "*" && s[i + 1] === "/"))
                i++;
            if (i < s.length)
                i += 2;
            out.push(" ");
            continue;
        }
        out.push(s[i]);
        i++;
    }
    return out.join("");
}
function findMatchingBrace(s, openBraceIndex) {
    let depth = 0;
    for (let i = openBraceIndex; i < s.length; i++) {
        const c = s[i];
        if (c === "{")
            depth++;
        else if (c === "}") {
            depth--;
            if (depth === 0)
                return i;
        }
    }
    return -1;
}
function unescapeHclString(value) {
    return value.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
}
function extractStringAttr(body, key) {
    const re = new RegExp(`(?:^|\\n)\\s*${key}\\s*=\\s*"((?:[^"\\\\]|\\\\.)*)"`, "i");
    const m = re.exec(body);
    return m ? unescapeHclString(m[1]) : undefined;
}
function extractStringList(body, key) {
    const re = new RegExp(`(?:^|\\n)\\s*${key}\\s*=\\s*\\[([^\\]]*)]`, "i");
    const m = re.exec(body);
    if (!m)
        return [];
    const inner = m[1];
    const out = [];
    const strRe = /"((?:[^"\\]|\\.)*)"/g;
    let sm;
    while ((sm = strRe.exec(inner)) !== null) {
        out.push(unescapeHclString(sm[1]));
    }
    return out;
}
function tryParseJson(text) {
    const trimmed = text.trim();
    if (!trimmed.startsWith("{") && !trimmed.startsWith("["))
        return null;
    try {
        return JSON.parse(trimmed);
    }
    catch {
        return null;
    }
}
function asMap(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value;
    }
    return null;
}
function strVal(v) {
    if (v === undefined || v === null)
        return undefined;
    if (typeof v === "string") {
        const s = v.trim();
        return s === "" ? undefined : s;
    }
    if (typeof v === "number" || typeof v === "boolean")
        return String(v);
    return undefined;
}
/** Extract build + source inventory from Packer HCL or legacy JSON. */
export function extractBuilds(text) {
    const trimmed = clampText(text).trim();
    if (!trimmed)
        return [];
    const builds = [];
    const seen = new Set();
    const push = (info) => {
        const key = `${info.name ?? ""}|${info.type ?? ""}|${(info.sources ?? []).join(",")}`;
        if (seen.has(key))
            return;
        seen.add(key);
        builds.push(info);
    };
    // Legacy / modern JSON
    const json = tryParseJson(trimmed);
    if (json) {
        const root = asMap(json);
        if (root) {
            // Packer JSON: builders: [{ type, name?, ... }]
            const builders = root.builders;
            if (Array.isArray(builders)) {
                for (const b of builders) {
                    const bm = asMap(b);
                    if (!bm)
                        continue;
                    const info = {};
                    const t = strVal(bm.type);
                    const n = strVal(bm.name);
                    if (t)
                        info.type = t;
                    if (n)
                        info.name = n;
                    push(info);
                }
            }
            // HCL2 JSON export style: source / build maps rare; also "build" array
            const buildArr = root.build;
            if (Array.isArray(buildArr)) {
                for (const b of buildArr) {
                    const bm = asMap(b);
                    if (!bm)
                        continue;
                    const info = {};
                    const n = strVal(bm.name);
                    if (n)
                        info.name = n;
                    const sources = bm.sources;
                    if (Array.isArray(sources)) {
                        info.sources = sources.map((s) => String(s)).filter(Boolean);
                    }
                    push(info);
                }
            }
        }
        if (builds.length > 0)
            return builds;
    }
    const hcl = stripCommentsKeepStrings(trimmed);
    // source "type" "name" { ... }
    const sourceRe = /\bsource\s+"([^"]+)"\s+"([^"]+)"\s*\{/g;
    let m;
    while ((m = sourceRe.exec(hcl)) !== null) {
        push({ type: m[1], name: m[2] });
    }
    // build { name = "..." sources = [...] }  or build "name" {
    const buildRe = /\bbuild\s+(?:"([^"]+)"\s*)?\{/g;
    while ((m = buildRe.exec(hcl)) !== null) {
        const open = m.index + m[0].length - 1;
        const close = findMatchingBrace(hcl, open);
        const body = close >= 0 ? hcl.slice(open + 1, close) : "";
        const info = {};
        const labelName = m[1];
        const attrName = extractStringAttr(body, "name");
        if (labelName)
            info.name = labelName;
        else if (attrName)
            info.name = attrName;
        const sources = extractStringList(body, "sources");
        if (sources.length)
            info.sources = sources;
        // Also: sources { ... } nested is uncommon; skip
        push(info);
    }
    return builds;
}
const LABEL_KEYS = [
    "ami_name",
    "image",
    "iso_url",
    "iso_checksum",
    "source_ami",
    "source_ami_filter",
    "region",
    "instance_type",
    "ssh_username",
    "winrm_username",
    "communicator",
    "disk_size",
    "vm_name",
    "output_directory",
    "repository",
    "tag",
];
/** Extract source blocks with type/name and useful label hints. */
export function extractSources(text) {
    const trimmed = clampText(text).trim();
    if (!trimmed)
        return [];
    const sources = [];
    const seen = new Set();
    const push = (info) => {
        const key = `${info.type ?? ""}|${info.name ?? ""}`;
        if (seen.has(key) && key !== "|")
            return;
        if (key !== "|")
            seen.add(key);
        sources.push(info);
    };
    const json = tryParseJson(trimmed);
    if (json) {
        const root = asMap(json);
        if (root && Array.isArray(root.builders)) {
            for (const b of root.builders) {
                const bm = asMap(b);
                if (!bm)
                    continue;
                const info = {};
                const t = strVal(bm.type);
                const n = strVal(bm.name);
                if (t)
                    info.type = t;
                if (n)
                    info.name = n;
                const labels = {};
                for (const k of LABEL_KEYS) {
                    const v = strVal(bm[k]);
                    if (v)
                        labels[k] = v;
                }
                if (Object.keys(labels).length)
                    info.labels = labels;
                push(info);
            }
            if (sources.length)
                return sources;
        }
    }
    const hcl = stripCommentsKeepStrings(trimmed);
    const sourceRe = /\bsource\s+"([^"]+)"\s+"([^"]+)"\s*\{/g;
    let m;
    while ((m = sourceRe.exec(hcl)) !== null) {
        const type = m[1];
        const name = m[2];
        const open = m.index + m[0].length - 1;
        const close = findMatchingBrace(hcl, open);
        const body = close >= 0 ? hcl.slice(open + 1, close) : "";
        const labels = {};
        for (const k of LABEL_KEYS) {
            const v = extractStringAttr(body, k);
            if (v)
                labels[k] = v;
        }
        const info = { type, name };
        if (Object.keys(labels).length)
            info.labels = labels;
        push(info);
    }
    return sources;
}
/** Extract provisioners and post-processors. */
export function extractProvisioners(text) {
    const trimmed = clampText(text).trim();
    if (!trimmed)
        return { provisioners: [], postProcessors: [] };
    const provisioners = [];
    const postProcessors = [];
    const seenP = new Set();
    const seenPp = new Set();
    const pushP = (info) => {
        const key = `${info.type ?? ""}|${(info.only ?? []).join(",")}`;
        if (seenP.has(key))
            return;
        seenP.add(key);
        provisioners.push(info);
    };
    const pushPp = (t) => {
        if (!t || seenPp.has(t))
            return;
        seenPp.add(t);
        postProcessors.push(t);
    };
    const json = tryParseJson(trimmed);
    if (json) {
        const root = asMap(json);
        if (root) {
            if (Array.isArray(root.provisioners)) {
                for (const p of root.provisioners) {
                    const pm = asMap(p);
                    if (!pm)
                        continue;
                    const info = {};
                    const t = strVal(pm.type);
                    if (t)
                        info.type = t;
                    if (Array.isArray(pm.only)) {
                        info.only = pm.only.map((x) => String(x)).filter(Boolean);
                    }
                    pushP(info);
                }
            }
            const pps = root["post-processors"] ?? root.post_processors ?? root.postProcessors;
            if (Array.isArray(pps)) {
                for (const pp of pps) {
                    if (typeof pp === "string")
                        pushPp(pp);
                    else if (Array.isArray(pp)) {
                        for (const inner of pp) {
                            const im = asMap(inner);
                            const t = im ? strVal(im.type) : undefined;
                            if (t)
                                pushPp(t);
                            else if (typeof inner === "string")
                                pushPp(inner);
                        }
                    }
                    else {
                        const ppm = asMap(pp);
                        const t = ppm ? strVal(ppm.type) : undefined;
                        if (t)
                            pushPp(t);
                    }
                }
            }
            if (provisioners.length || postProcessors.length) {
                return { provisioners, postProcessors };
            }
        }
    }
    const hcl = stripCommentsKeepStrings(trimmed);
    // provisioner "shell" { only = ["..."] }
    const provRe = /\bprovisioner\s+"([^"]+)"\s*\{/g;
    let m;
    while ((m = provRe.exec(hcl)) !== null) {
        const type = m[1];
        const open = m.index + m[0].length - 1;
        const close = findMatchingBrace(hcl, open);
        const body = close >= 0 ? hcl.slice(open + 1, close) : "";
        const info = { type };
        const only = extractStringList(body, "only");
        if (only.length)
            info.only = only;
        pushP(info);
    }
    // post-processor "manifest" { }
    const ppRe = /\bpost-processor\s+"([^"]+)"\s*\{/g;
    while ((m = ppRe.exec(hcl)) !== null) {
        pushPp(m[1]);
    }
    // post-processors { ... } block with nested types (rare) — also catch type = "..."
    const ppsBlockRe = /\bpost-processors\s*\{/g;
    while ((m = ppsBlockRe.exec(hcl)) !== null) {
        const open = m.index + m[0].length - 1;
        const close = findMatchingBrace(hcl, open);
        const body = close >= 0 ? hcl.slice(open + 1, close) : "";
        const nested = /\b(?:post-processor\s+)?"([^"]+)"\s*\{/g;
        let nm;
        while ((nm = nested.exec(body)) !== null) {
            pushPp(nm[1]);
        }
    }
    return { provisioners, postProcessors };
}
function looksLikePacker(text) {
    return (/\bsource\s+"[^"]+"\s+"[^"]+"\s*\{/.test(text) ||
        /\bbuild\s+(?:"[^"]+"\s*)?\{/.test(text) ||
        /\bprovisioner\s+"[^"]+"\s*\{/.test(text) ||
        /\bpost-processor\s+"[^"]+"\s*\{/.test(text) ||
        /"builders"\s*:/.test(text) ||
        /"provisioners"\s*:/.test(text) ||
        /\bpacker\s*\{/.test(text) ||
        extractBuilds(text).length > 0 ||
        extractSources(text).length > 0);
}
function hasPlaintextSecret(text) {
    // password/secret/token attrs with literal non-var string values
    return /(?:password|passwd|secret|token|api[_-]?key|access[_-]?key|aws_secret|client[_-]?secret)\s*=\s*"(?!\{\{|\$\{|env\(|vault)[^"]{3,}"/i.test(text);
}
function hasInsecureCommunicator(text) {
    // ssh_password / winrm_password plaintext, or ssh_handshake_attempts with password auth tip
    return (/\bssh_password\s*=\s*"[^"]+"/i.test(text) ||
        /\bwinrm_password\s*=\s*"[^"]+"/i.test(text) ||
        /\bcommunicator\s*=\s*"none"/i.test(text) ||
        (/\bwinrm_use_ssl\s*=\s*false\b/i.test(text) &&
            /\bwinrm_insecure\s*=\s*true\b/i.test(text)));
}
function hasLatestTag(text) {
    // image = "ubuntu:latest" or tag = "latest" or ":latest" in strings
    return (/:\s*latest["'\s]/i.test(text) ||
        /["'][^"']*:latest["']/i.test(text) ||
        /\btag\s*=\s*"latest"/i.test(text) ||
        /\bimage\s*=\s*"[^"]*:latest"/i.test(text));
}
export function lintPacker(text) {
    const findings = [];
    const trimmed = clampText(text).trim();
    if (!trimmed) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Provide non-empty Packer HCL or JSON text. This tool only analyzes the string you pass — it never runs packer, builds images, or reads the filesystem.",
        });
        return findings;
    }
    if (!looksLikePacker(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "empty_source",
            advice: "No clear Packer patterns found (`source`/`build`/`provisioner` blocks or JSON `builders`). Paste Packer template text. Educational tip only.",
        });
        return findings;
    }
    const builds = extractBuilds(trimmed);
    const sources = extractSources(trimmed);
    const hasSourceBlock = sources.length > 0 ||
        /\bsource\s+"/.test(trimmed) ||
        /"builders"\s*:/.test(trimmed);
    const hasBuildBlock = builds.some((b) => b.sources !== undefined || (b.name && !b.type)) ||
        /\bbuild\s+(?:"[^"]+"\s*)?\{/.test(trimmed) ||
        /"builders"\s*:/.test(trimmed);
    // HCL2 typically needs both source + build; JSON builders alone is fine
    const isJsonBuilders = /"builders"\s*:/.test(trimmed);
    if (!hasSourceBlock && !isJsonBuilders) {
        findings.push({
            severity: "warn",
            rule: "missing_source",
            advice: "No `source \"type\" \"name\" { ... }` (or JSON `builders`) found. Packer HCL2 templates usually declare sources before `build`. Educational tip only — this tool never runs packer.",
        });
    }
    if (!hasBuildBlock && hasSourceBlock && !isJsonBuilders) {
        findings.push({
            severity: "warn",
            rule: "missing_build",
            advice: "Sources found but no `build { ... }` block. HCL2 Packer templates need a build that references sources. Educational tip only.",
        });
    }
    if (hasPlaintextSecret(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "plaintext_password",
            advice: "Possible plaintext password/secret/token literal in Packer text. Prefer env vars, Vault, or CI secrets — never commit credentials. Attribute-name heuristic only (not an exploit guide).",
        });
    }
    if (hasInsecureCommunicator(trimmed)) {
        findings.push({
            severity: "info",
            rule: "insecure_communicator",
            advice: "Communicator tip: plaintext `ssh_password`/`winrm_password`, `communicator = \"none\"`, or WinRM without SSL can weaken image builds. Prefer SSH keys and encrypted WinRM when practical. Educational tip only — not an exploit guide.",
        });
    }
    if (hasLatestTag(trimmed)) {
        findings.push({
            severity: "info",
            rule: "latest_tag",
            advice: "Image or tag uses `:latest` / `tag = \"latest\"`, which can make builds non-reproducible. Prefer pinned digests or version tags. Educational tip only.",
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
