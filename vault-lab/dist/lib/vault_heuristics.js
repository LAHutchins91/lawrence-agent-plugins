/**
 * Shared Vault HCL policy / auth / secrets-engine text helpers.
 * Pure regex/string heuristics — no vault CLI, server, network, filesystem follow, or eval.
 * Educational only: flags path/capability patterns and secret-engine mount names/types —
 * never invents or decodes secrets, never teaches ACL bypass.
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
function strList(v) {
    if (!Array.isArray(v))
        return [];
    const out = [];
    for (const item of v) {
        const s = strVal(item);
        if (s)
            out.push(s);
    }
    return out;
}
/** Parse policy path blocks: path "..." { capabilities = [...] }. */
export function extractPolicies(text) {
    const trimmed = clampText(text).trim();
    if (!trimmed)
        return [];
    const policies = [];
    const seen = new Set();
    const push = (info) => {
        if (!info.path && !info.capabilities)
            return;
        const key = `${info.path ?? ""}|${(info.capabilities ?? []).join(",")}`;
        if (seen.has(key))
            return;
        seen.add(key);
        policies.push(info);
    };
    const json = tryParseJson(trimmed);
    if (json) {
        const root = asMap(json);
        if (root) {
            // ACL policy JSON: { "path": { "secret/data/*": { "capabilities": [...] } } }
            const pathMap = asMap(root.path ?? root.Path);
            if (pathMap) {
                for (const [p, body] of Object.entries(pathMap)) {
                    const bm = asMap(body);
                    const caps = bm
                        ? strList(bm.capabilities ?? bm.Capabilities)
                        : [];
                    const info = { path: p };
                    if (caps.length)
                        info.capabilities = caps;
                    push(info);
                }
            }
            // Array form
            const arr = root.paths ?? root.Paths ?? root.policies ?? root.Policies;
            if (Array.isArray(arr)) {
                for (const item of arr) {
                    const im = asMap(item);
                    if (!im)
                        continue;
                    const path = strVal(im.path) ?? strVal(im.Path);
                    const caps = strList(im.capabilities ?? im.Capabilities);
                    const info = {};
                    if (path)
                        info.path = path;
                    if (caps.length)
                        info.capabilities = caps;
                    push(info);
                }
            }
        }
        if (policies.length)
            return policies;
    }
    const hcl = stripCommentsKeepStrings(trimmed);
    // path "secret/data/*" { capabilities = ["read", "list"] }
    const pathRe = /\bpath\s+"([^"]+)"\s*\{/g;
    let m;
    while ((m = pathRe.exec(hcl)) !== null) {
        const path = m[1];
        const open = m.index + m[0].length - 1;
        const close = findMatchingBrace(hcl, open);
        const body = close >= 0 ? hcl.slice(open + 1, close) : "";
        const caps = extractStringList(body, "capabilities");
        const info = { path };
        if (caps.length)
            info.capabilities = caps;
        push(info);
    }
    // path { path = "..." capabilities = [...] } (rare)
    const anonRe = /\bpath\s*\{/g;
    while ((m = anonRe.exec(hcl)) !== null) {
        // Skip if this is part of path "..." already matched (look back for quote)
        const before = hcl.slice(Math.max(0, m.index - 2), m.index);
        if (/"\s*$/.test(before))
            continue;
        const open = m.index + m[0].length - 1;
        const close = findMatchingBrace(hcl, open);
        const body = close >= 0 ? hcl.slice(open + 1, close) : "";
        const path = extractStringAttr(body, "path") ?? extractStringAttr(body, "Path");
        const caps = extractStringList(body, "capabilities");
        const info = {};
        if (path)
            info.path = path;
        if (caps.length)
            info.capabilities = caps;
        push(info);
    }
    return policies;
}
const AUTH_PATTERNS = [
    { id: "userpass", re: /\bauth\/userpass\b|userpass\s*\{|type\s*=\s*"userpass"|auth_method\s*=\s*"userpass"|method\s*=\s*"userpass"/i },
    { id: "approle", re: /\bauth\/approle\b|approle\s*\{|type\s*=\s*"approle"|auth_method\s*=\s*"approle"|method\s*=\s*"approle"/i },
    { id: "kubernetes", re: /\bauth\/kubernetes\b|kubernetes\s*\{|type\s*=\s*"kubernetes"|auth_method\s*=\s*"kubernetes"|method\s*=\s*"kubernetes"/i },
    { id: "github", re: /\bauth\/github\b|type\s*=\s*"github"|auth_method\s*=\s*"github"|method\s*=\s*"github"/i },
    { id: "jwt", re: /\bauth\/(?:jwt|oidc)\b|type\s*=\s*"(?:jwt|oidc)"|auth_method\s*=\s*"(?:jwt|oidc)"|method\s*=\s*"(?:jwt|oidc)"/i },
    { id: "ldap", re: /\bauth\/ldap\b|type\s*=\s*"ldap"|auth_method\s*=\s*"ldap"|method\s*=\s*"ldap"/i },
    { id: "aws", re: /\bauth\/aws\b|type\s*=\s*"aws"|auth_method\s*=\s*"aws"|method\s*=\s*"aws"/i },
];
/** Detect auth methods mentioned in config/HCL text. */
export function extractAuths(text) {
    const trimmed = clampText(text).trim();
    if (!trimmed)
        return [];
    const hcl = stripCommentsKeepStrings(trimmed);
    const found = [];
    const seen = new Set();
    for (const { id, re } of AUTH_PATTERNS) {
        if (re.test(hcl) || re.test(trimmed)) {
            // Normalize jwt/oidc as requested
            let label = id;
            if (id === "jwt") {
                if (/\boidc\b/i.test(hcl) || /\boidc\b/i.test(trimmed)) {
                    label = /jwt/i.test(hcl) || /jwt/i.test(trimmed) ? "jwt/oidc" : "jwt/oidc";
                }
                else {
                    label = "jwt/oidc";
                }
            }
            if (!seen.has(label)) {
                seen.add(label);
                found.push(label);
            }
        }
    }
    // Also catch vault auth enable / resource "vault_auth_backend"
    const enableRe = /\b(?:vault\s+)?auth\s+enable\s+(?:-path=\S+\s+)?(userpass|approle|kubernetes|github|jwt|oidc|ldap|aws)\b/gi;
    let em;
    while ((em = enableRe.exec(trimmed)) !== null) {
        let label = em[1].toLowerCase();
        if (label === "jwt" || label === "oidc")
            label = "jwt/oidc";
        if (!seen.has(label)) {
            seen.add(label);
            found.push(label);
        }
    }
    const tfRe = /resource\s+"vault_auth_backend"\s+"[^"]+"\s*\{[\s\S]*?type\s*=\s*"(userpass|approle|kubernetes|github|jwt|oidc|ldap|aws)"/gi;
    while ((em = tfRe.exec(hcl)) !== null) {
        let label = em[1].toLowerCase();
        if (label === "jwt" || label === "oidc")
            label = "jwt/oidc";
        if (!seen.has(label)) {
            seen.add(label);
            found.push(label);
        }
    }
    return found;
}
const ENGINE_TYPES = ["kv", "kv-v2", "database", "pki", "transit", "aws"];
/** Detect secrets engine mounts/types — paths and types only, never secret values. */
export function extractEngines(text) {
    const trimmed = clampText(text).trim();
    if (!trimmed)
        return [];
    const engines = [];
    const seen = new Set();
    const push = (info) => {
        if (!info.type && !info.path)
            return;
        const key = `${info.type ?? ""}|${info.path ?? ""}`;
        if (seen.has(key))
            return;
        seen.add(key);
        engines.push(info);
    };
    const hcl = stripCommentsKeepStrings(trimmed);
    // secrets "kv" { path = "secret" }  or  secrets "kv-v2" "secret" { }
    const namedSecretsRe = /\bsecrets\s+"([^"]+)"(?:\s+"([^"]+)")?\s*\{/gi;
    let m;
    while ((m = namedSecretsRe.exec(hcl)) !== null) {
        const typeRaw = m[1];
        const pathLabel = m[2];
        const open = m.index + m[0].length - 1;
        const close = findMatchingBrace(hcl, open);
        const body = close >= 0 ? hcl.slice(open + 1, close) : "";
        const pathAttr = extractStringAttr(body, "path") ??
            extractStringAttr(body, "Path") ??
            pathLabel;
        const type = normalizeEngineType(typeRaw);
        const info = {};
        if (type)
            info.type = type;
        if (pathAttr)
            info.path = pathAttr;
        push(info);
    }
    // mount "kv" { path = "secret" type = "kv" }
    const mountRe = /\bmount\s+(?:"([^"]+)"\s*)?\{/gi;
    while ((m = mountRe.exec(hcl)) !== null) {
        const open = m.index + m[0].length - 1;
        const close = findMatchingBrace(hcl, open);
        const body = close >= 0 ? hcl.slice(open + 1, close) : "";
        const typeRaw = extractStringAttr(body, "type") ??
            extractStringAttr(body, "Type") ??
            m[1];
        const pathAttr = extractStringAttr(body, "path") ?? extractStringAttr(body, "Path");
        const type = typeRaw ? normalizeEngineType(typeRaw) : undefined;
        if (!type && !pathAttr)
            continue;
        // Only keep known engine types (or path with type hint)
        if (type || (pathAttr && looksLikeEnginePath(pathAttr))) {
            const info = {};
            if (type)
                info.type = type;
            if (pathAttr)
                info.path = pathAttr;
            push(info);
        }
    }
    // Terraform: resource "vault_mount" "..." { path = "..." type = "..." }
    const tfMountRe = /resource\s+"vault_mount"\s+"[^"]+"\s*\{/gi;
    while ((m = tfMountRe.exec(hcl)) !== null) {
        const open = hcl.indexOf("{", m.index);
        if (open < 0)
            continue;
        const close = findMatchingBrace(hcl, open);
        const body = close >= 0 ? hcl.slice(open + 1, close) : "";
        const typeRaw = extractStringAttr(body, "type") ?? extractStringAttr(body, "Type");
        const pathAttr = extractStringAttr(body, "path") ?? extractStringAttr(body, "Path");
        const type = typeRaw ? normalizeEngineType(typeRaw) : undefined;
        if (!type && !pathAttr)
            continue;
        const info = {};
        if (type)
            info.type = type;
        if (pathAttr)
            info.path = pathAttr;
        push(info);
    }
    // vault secrets enable [-path=X] TYPE
    const enableRe = /\b(?:vault\s+)?secrets\s+enable\s+(?:-path=(\S+)\s+)?(kv-v2|kv|database|pki|transit|aws)\b/gi;
    while ((m = enableRe.exec(trimmed)) !== null) {
        const pathAttr = m[1];
        const type = normalizeEngineType(m[2]);
        const info = {};
        if (type)
            info.type = type;
        if (pathAttr)
            info.path = pathAttr.replace(/^["']|["']$/g, "");
        push(info);
    }
    // Loose: type = "kv" / type = "kv-v2" near path =
    for (const et of ENGINE_TYPES) {
        const typeEq = new RegExp(`type\\s*=\\s*"${et === "kv" ? "kv(?:-v1)?" : et}"`, "i");
        if (typeEq.test(hcl) || typeEq.test(trimmed)) {
            // Already captured via structured blocks? Still allow type-only if not seen
            const already = engines.some((e) => e.type === (et === "kv" ? normalizeEngineType("kv") : et));
            if (!already) {
                // Prefer structured; only add type-only when no path context found for this type
                const hasStructured = engines.some((e) => e.type === normalizeEngineType(et));
                if (!hasStructured) {
                    push({ type: normalizeEngineType(et) });
                }
            }
        }
    }
    // path hints for common mounts without full type (secret/, kv/, database/, pki/, transit/, aws/)
    // Only if we already have some vault-ish content OR explicit engine words
    const pathHints = [
        { type: "kv-v2", re: /\bpath\s*=\s*"(secret|kv)\/?"/i },
        { type: "database", re: /\bpath\s*=\s*"database\/?"/i },
        { type: "pki", re: /\bpath\s*=\s*"pki\/?"/i },
        { type: "transit", re: /\bpath\s*=\s*"transit\/?"/i },
        { type: "aws", re: /\bpath\s*=\s*"aws\/?"/i },
    ];
    for (const h of pathHints) {
        const mm = h.re.exec(hcl);
        if (mm) {
            const pathAttr = mm[1] ? mm[0].match(/"([^"]+)"/)?.[1] : undefined;
            const info = { type: h.type };
            if (pathAttr)
                info.path = pathAttr.replace(/\/$/, "");
            push(info);
        }
    }
    // JSON form
    const json = tryParseJson(trimmed);
    if (json) {
        const root = asMap(json);
        if (root) {
            const collect = (v) => {
                if (Array.isArray(v)) {
                    for (const item of v) {
                        const im = asMap(item);
                        if (!im)
                            continue;
                        const typeRaw = strVal(im.type) ?? strVal(im.Type);
                        const pathAttr = strVal(im.path) ?? strVal(im.Path);
                        const type = typeRaw ? normalizeEngineType(typeRaw) : undefined;
                        if (!type && !pathAttr)
                            continue;
                        const info = {};
                        if (type)
                            info.type = type;
                        if (pathAttr)
                            info.path = pathAttr;
                        push(info);
                    }
                }
                else {
                    const im = asMap(v);
                    if (!im)
                        return;
                    const typeRaw = strVal(im.type) ?? strVal(im.Type);
                    const pathAttr = strVal(im.path) ?? strVal(im.Path);
                    const type = typeRaw ? normalizeEngineType(typeRaw) : undefined;
                    if (!type && !pathAttr)
                        return;
                    const info = {};
                    if (type)
                        info.type = type;
                    if (pathAttr)
                        info.path = pathAttr;
                    push(info);
                }
            };
            if (root.mount != null)
                collect(root.mount);
            if (root.mounts != null)
                collect(root.mounts);
            if (root.secrets != null)
                collect(root.secrets);
            if (root.engines != null)
                collect(root.engines);
        }
    }
    return engines;
}
function normalizeEngineType(raw) {
    const t = raw.trim().toLowerCase();
    if (t === "kv" || t === "kv-v1" || t === "generic")
        return "kv";
    if (t === "kv-v2" || t === "kv2" || t === "versioned-kv")
        return "kv-v2";
    if (t === "database" || t === "db")
        return "database";
    if (t === "pki")
        return "pki";
    if (t === "transit")
        return "transit";
    if (t === "aws")
        return "aws";
    return undefined;
}
function looksLikeEnginePath(p) {
    return /^(secret|kv|database|pki|transit|aws)(\/|$)/i.test(p);
}
function looksLikeVault(text) {
    return (/\bpath\s+"[^"]+"\s*\{/.test(text) ||
        /\bcapabilities\s*=\s*\[/.test(text) ||
        /\bauth\/(?:userpass|approle|kubernetes|github|jwt|oidc|ldap|aws)\b/i.test(text) ||
        /\b(?:vault_auth_backend|vault_mount|vault_policy)\b/i.test(text) ||
        /\bsecrets\s+(?:enable|"|\w)/i.test(text) ||
        /\bmount\s+(?:"|\w)/i.test(text) ||
        /\bdisable_mlock\b/i.test(text) ||
        /\broot[_-]?token\b/i.test(text) ||
        extractPolicies(text).length > 0 ||
        extractAuths(text).length > 0 ||
        extractEngines(text).length > 0);
}
function hasMissingPathBlock(text) {
    const policies = extractPolicies(text);
    if (policies.some((p) => !p.path))
        return true;
    const hcl = stripCommentsKeepStrings(text);
    // Has capabilities but no path "..." block
    const hasCaps = /\bcapabilities\s*=\s*\[/.test(hcl);
    const hasPath = /\bpath\s+"[^"]+"\s*\{/.test(hcl) || /\bpath\s*\{/.test(hcl);
    if (hasCaps && !hasPath && policies.length === 0)
        return true;
    // policy-like file with no paths
    if (/\b(?:policy|acl)\b/i.test(hcl) &&
        policies.length === 0 &&
        !/\bpath\s+"/.test(hcl)) {
        return true;
    }
    return false;
}
function hasOverlyBroadPath(text) {
    const policies = extractPolicies(text);
    for (const p of policies) {
        const path = p.path ?? "";
        if (path === "*" || path === "+" || path === "/*" || path === "*/*") {
            return true;
        }
    }
    const hcl = stripCommentsKeepStrings(text);
    return /\bpath\s+"\*"\s*\{/.test(hcl) || /\bpath\s+"\/?\*"\s*\{/.test(hcl);
}
function hasSudoCapability(text) {
    const policies = extractPolicies(text);
    for (const p of policies) {
        if ((p.capabilities ?? []).some((c) => c.toLowerCase() === "sudo")) {
            return true;
        }
    }
    const hcl = stripCommentsKeepStrings(text);
    return /"sudo"/.test(hcl) && /\bcapabilities\s*=/.test(hcl);
}
function hasPlaintextRootToken(text) {
    const hcl = stripCommentsKeepStrings(text);
    // root_token / VAULT_TOKEN / token = "s.xxx" style literals (attribute names only — no decoding)
    if (/(?:^|\n)\s*(?:root[_-]?token|vault[_-]?token|VAULT_TOKEN|token)\s*=\s*"(?!\{\{|\$\{|env\()[^"]{8,}"/im.test(hcl)) {
        return true;
    }
    if (/"(?:root_token|rootToken|VAULT_TOKEN|vault_token)"\s*:\s*"(?!\{\{|\$\{)[^"]{8,}"/i.test(text)) {
        return true;
    }
    // s.xxxxxxxxx vault token pattern as assigned value (key name / shape only)
    if (/(?:root[_-]?token|VAULT_TOKEN|token)\s*=\s*"s\.[A-Za-z0-9]{8,}"/i.test(hcl)) {
        return true;
    }
    return false;
}
function hasDisableMlock(text) {
    const hcl = stripCommentsKeepStrings(text);
    return (/(?:^|\n)\s*disable_mlock\s*=\s*true\b/im.test(hcl) ||
        /"disable_mlock"\s*:\s*true\b/i.test(text));
}
export function lintVault(text) {
    const findings = [];
    const trimmed = clampText(text).trim();
    if (!trimmed) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Provide non-empty Vault HCL policy/config text. This tool only analyzes the string you pass — it never runs vault, talks to a server, or reads the filesystem.",
        });
        return findings;
    }
    if (!looksLikeVault(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "empty_source",
            advice: "No clear Vault patterns found (`path \"...\" { capabilities = [...] }`, auth methods, or secrets mounts). Paste Vault policy/config HCL text. Educational tip only.",
        });
        return findings;
    }
    if (hasMissingPathBlock(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "missing_path_block",
            advice: "Policy-like text appears without a clear `path \"...\" { ... }` block (or a path is empty). Vault ACL policies usually declare path blocks with capabilities. Educational tip only — this tool never runs vault.",
        });
    }
    if (hasOverlyBroadPath(trimmed)) {
        findings.push({
            severity: "info",
            rule: "overly_broad_path",
            advice: 'Overly broad path tip: `path "*"` (or similar wildcards) grants capabilities across many backends. Prefer least-privilege path prefixes. Educational tip only — not an exploit guide and never teaches ACL bypass.',
        });
    }
    if (hasSudoCapability(trimmed)) {
        findings.push({
            severity: "info",
            rule: "sudo_capability",
            advice: 'Sudo tip: `capabilities = [..., "sudo"]` elevates certain root-protected operations. Review whether sudo is required for each path. Educational tip only — not an exploit guide.',
        });
    }
    if (hasPlaintextRootToken(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "plaintext_root_token",
            advice: "Possible plaintext root/Vault token literal (`root_token` / `VAULT_TOKEN` / `token = \"...\"`). Prefer env vars or a secrets manager — never commit credentials. Attribute-name heuristic only (never invents or decodes secrets; not an exploit guide).",
        });
    }
    if (hasDisableMlock(trimmed)) {
        findings.push({
            severity: "info",
            rule: "disable_mlock",
            advice: "`disable_mlock = true` skips mlock; Vault docs note this may allow memory to swap to disk. Prefer mlock when the platform supports it. Educational tip only — not an exploit guide.",
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
