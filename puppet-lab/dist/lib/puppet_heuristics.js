/**
 * Shared Puppet manifest/module text helpers.
 * Pure regex/string heuristics — no Puppet CLI, agent/apply, network, filesystem follow, or eval.
 */
const SECRET_KEY_RE = /(?:^|[_.\-\/])(password|passwd|secret|token|api[_-]?key|access[_-]?key|private[_-]?key|auth[_-]?token|client[_-]?secret)(?:$|[_.\-\/])/i;
function isSecretKeyName(name) {
    const bare = name.replace(/^\$/, "").replace(/^['"]|['"]$/g, "");
    return (SECRET_KEY_RE.test(bare) ||
        /^(password|passwd|secret|token)$/i.test(bare));
}
function unquote(s) {
    const t = s.trim();
    if ((t.startsWith("'") && t.endsWith("'")) ||
        (t.startsWith('"') && t.endsWith('"'))) {
        return t.slice(1, -1);
    }
    return t;
}
/** Parse manifest text for class / define names. */
export function extractClasses(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed)
        return [];
    const out = [];
    const seen = new Set();
    const push = (name, kind) => {
        const n = name.trim();
        if (!n)
            return;
        const key = `${kind}|${n}`;
        if (seen.has(key))
            return;
        seen.add(key);
        out.push({ name: n, kind });
    };
    // class foo::bar ( ... ) {   OR  class foo {
    const classRe = /(?:^|\n)\s*class\s+([A-Za-z_][\w:-]*)\s*(?:\(|\{)/gi;
    let m;
    while ((m = classRe.exec(trimmed)) !== null) {
        push(m[1], "class");
    }
    // define mytype::thing ( ... ) {
    const defineRe = /(?:^|\n)\s*define\s+([A-Za-z_][\w:-]*)\s*(?:\(|\{)/gi;
    while ((m = defineRe.exec(trimmed)) !== null) {
        push(m[1], "define");
    }
    return out;
}
/** Detect module refs: include/require/contain, class { 'foo': }, metadata.json, Puppetfile mod. */
export function extractModules(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed)
        return [];
    const modules = new Set();
    const add = (raw) => {
        let n = unquote(raw.trim());
        if (!n)
            return;
        // Strip ::classname to module root when namespaced (stdlib::ensure_packages → stdlib)
        // Keep single-segment as-is; for multi-segment take first segment as module hint
        if (n.includes("::")) {
            const root = n.split("::")[0];
            if (root)
                modules.add(root);
            modules.add(n); // also keep full ref for clarity
        }
        else {
            modules.add(n);
        }
    };
    // include foo / include foo::bar / include ::foo
    const incRe = /\b(?:include|require|contain)\s+(?:::)??([A-Za-z_][\w:-]*)/gi;
    let m;
    while ((m = incRe.exec(trimmed)) !== null) {
        add(m[1]);
    }
    // class { 'apache': } / class { "nginx::config": }
    const classResRe = /\bclass\s*\{\s*(['"][^'"]+['"])\s*:/gi;
    while ((m = classResRe.exec(trimmed)) !== null) {
        add(m[1]);
    }
    // Puppetfile: mod 'puppetlabs-apache' / mod "stdlib", '9.0.0'
    const modRe = /(?:^|\n)\s*mod\s+(['"][^'"]+['"])/gi;
    while ((m = modRe.exec(trimmed)) !== null) {
        add(m[1]);
    }
    // metadata.json — try JSON parse first (yaml dep available for YAML variants)
    if (trimmed.startsWith("{")) {
        try {
            const meta = JSON.parse(trimmed);
            if (typeof meta.name === "string" && meta.name.trim())
                add(meta.name);
            if (Array.isArray(meta.dependencies)) {
                for (const d of meta.dependencies) {
                    if (d && typeof d.name === "string")
                        add(d.name);
                }
            }
        }
        catch {
            /* fall through to regex */
        }
    }
    // metadata.json-ish regex fallback: "name": "author-modulename"
    const nameJsonRe = /"name"\s*:\s*"([^"]+)"/gi;
    while ((m = nameJsonRe.exec(trimmed)) !== null) {
        const n = m[1].trim();
        if ((n && /[\/-]/.test(n)) ||
            /^[a-z0-9_]+-[a-z0-9_]+$/i.test(n)) {
            add(n);
        }
        else if (n && /^[a-z0-9_.-]+$/i.test(n) && n.includes("-") && !/^(Apache|MIT|GPL|BSD)/i.test(n)) {
            add(n);
        }
    }
    // metadata.json dependencies block regex fallback
    const depBlock = trimmed.match(/"dependencies"\s*:\s*\[([\s\S]*?)\]/);
    if (depBlock) {
        const depNameRe = /"name"\s*:\s*"([^"]+)"/gi;
        while ((m = depNameRe.exec(depBlock[1])) !== null) {
            add(m[1]);
        }
    }
    // Also catch forge-style deps outside a clean block via regex
    const forgeDepRe = /"name"\s*:\s*"([a-zA-Z0-9_]+[\/-][a-zA-Z0-9_-]+)"/g;
    while ((m = forgeDepRe.exec(trimmed)) !== null) {
        add(m[1]);
    }
    return [...modules];
}
/** Extract class/define parameters and $facts/$trusted usage; flag secret param names. */
export function extractParams(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed)
        return { params: [], secretKeyNames: [] };
    const params = new Set();
    const secrets = new Set();
    const consider = (name) => {
        const n = name.replace(/^\$/, "").trim();
        if (!n)
            return;
        params.add(n);
        if (isSecretKeyName(n))
            secrets.add(n);
    };
    // class foo (
    //   String $ensure = 'present',
    //   $password,
    // ) {
    // Capture parameter lists after class/define name
    const sigRe = /(?:^|\n)\s*(?:class|define)\s+[A-Za-z_][\w:-]*\s*\(([\s\S]*?)\)\s*\{/gi;
    let m;
    while ((m = sigRe.exec(trimmed)) !== null) {
        const body = m[1];
        // $param or Type $param or Optional[String] $param
        const paramRe = /(?:^|,)\s*(?:[A-Za-z_][\w:\[\],\s]*?\s+)?\$([A-Za-z_][\w]*)/gm;
        let pm;
        while ((pm = paramRe.exec(body)) !== null) {
            consider(pm[1]);
        }
    }
    // $facts['os']['family'] / $facts["networking"] / $trusted['certname']
    const factsRe = /\$facts\s*(?:\[[^\]]+\])+|\$facts\b/gi;
    while ((m = factsRe.exec(trimmed)) !== null) {
        const raw = m[0].replace(/\s+/g, "");
        params.add(raw.startsWith("$") ? raw.slice(1) : raw);
    }
    const trustedRe = /\$trusted\s*(?:\[[^\]]+\])+|\$trusted\b/gi;
    while ((m = trustedRe.exec(trimmed)) !== null) {
        const raw = m[0].replace(/\s+/g, "");
        params.add(raw.startsWith("$") ? raw.slice(1) : raw);
    }
    // Also catch bare $password = '...' assignments that look like params
    const assignRe = /(?:^|\n)\s*\$([A-Za-z_][\w]*)\s*=/gm;
    while ((m = assignRe.exec(trimmed)) !== null) {
        const n = m[1];
        if (isSecretKeyName(n)) {
            consider(n);
        }
    }
    return {
        params: [...params],
        secretKeyNames: [...secrets],
    };
}
function looksLikePuppet(text) {
    return (/\b(?:class|define)\s+[A-Za-z_]/i.test(text) ||
        /\b(?:include|require|contain)\s+[A-Za-z_:]/i.test(text) ||
        /\bclass\s*\{\s*['"]/i.test(text) ||
        /\b(?:package|service|file|exec|user|group|cron)\s*\{/i.test(text) ||
        /\bmod\s+['"]/i.test(text) ||
        /"dependencies"\s*:/i.test(text) ||
        /\$facts\b/i.test(text) ||
        /\$trusted\b/i.test(text));
}
function hasPlaintextPassword(text) {
    // $password = 'literal' or password => 'literal' in resource
    return (/\$?(?:password|passwd|secret|token|api[_-]?key)\s*=\s*['"](?!\$)[^'"]{3,}['"]/i.test(text) ||
        /(?:password|passwd|secret|token)\s*=>\s*['"](?!\$)[^'"]{3,}['"]/i.test(text));
}
function execWithoutGuard(text) {
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
        if (/\bexec\s*\{/.test(lines[i])) {
            let window = lines[i];
            for (let j = i + 1; j < Math.min(i + 40, lines.length); j++) {
                window += "\n" + lines[j];
                // stop at closing brace at similar indent roughly — heuristic
                if (/^\s*\}\s*$/.test(lines[j]))
                    break;
            }
            if (!/\bunless\s*=>/.test(window) && !/\bcreates\s*=>/.test(window) && !/\bonlyif\s*=>/.test(window)) {
                return true;
            }
        }
    }
    return false;
}
function packageLatestTip(text) {
    // package { 'x': ensure => latest }
    return (/\bensure\s*=>\s*['"]?latest['"]?/i.test(text) &&
        /\bpackage\s*\{/i.test(text));
}
function missingClass(text) {
    // Looks like Puppet resources but no class/define declaration
    const hasResources = /\b(?:package|service|file|exec|user|group)\s*\{/i.test(text) ||
        /\b(?:include|require|contain)\s+/i.test(text);
    const hasClassOrDefine = /\b(?:class|define)\s+[A-Za-z_]/i.test(text);
    return hasResources && !hasClassOrDefine;
}
export function lintPuppet(text) {
    const findings = [];
    const trimmed = (text ?? "").trim();
    if (!trimmed) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Provide non-empty Puppet manifest/module text. This tool only analyzes the string you pass — it never reads the filesystem or runs Puppet agent/apply.",
        });
        return findings;
    }
    if (!looksLikePuppet(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "empty_source",
            advice: "No clear Puppet patterns found (class/define, include/require/contain, resources, Puppetfile mod, metadata.json). Paste manifest or module text. Educational tip only.",
        });
        return findings;
    }
    if (missingClass(trimmed)) {
        findings.push({
            severity: "info",
            rule: "missing_class",
            advice: "Resource/include usage found without a surrounding `class` / `define` declaration. Typical modules wrap resources in a class (e.g. `class mymodule { ... }`). Educational tip only — this tool never runs Puppet.",
        });
    }
    if (hasPlaintextPassword(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "plaintext_password",
            advice: "Possible plaintext password/secret/token literal in Puppet text. Prefer Hiera-eyaml, secret backends, or CI secrets — never commit credentials. Key/value heuristic only (not an exploit guide).",
        });
    }
    if (execWithoutGuard(trimmed)) {
        findings.push({
            severity: "info",
            rule: "exec_without_guard",
            advice: "`exec` resource without `unless` / `creates` / `onlyif` may re-run every catalog apply. Prefer idempotent guards or built-in resources. Educational tip only.",
        });
    }
    if (packageLatestTip(trimmed)) {
        findings.push({
            severity: "info",
            rule: "package_latest_tip",
            advice: "Package `ensure => latest` can make applies non-reproducible across time. Prefer pinned package versions when stability matters. Educational tip only.",
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
