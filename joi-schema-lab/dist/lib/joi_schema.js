/**
 * Best-effort Joi schema JS/TS text heuristics.
 * No joi runtime, no network, no filesystem follow, no eval / no TS AST.
 */
const JOI_KINDS = "object|array|string|number|boolean|date|binary|symbol|alternatives|alt|any|link|function|func|prefs|preferences|extend|assert|attempt|compile|defaults|expression|isError|isSchema|isRef|isExpression|ref|in|override|valid|invalid|equal|exist|required|optional|forbidden";
const RULE_KINDS = [
    "min",
    "max",
    "length",
    "email",
    "uri",
    "pattern",
    "regex",
    "valid",
    "invalid",
    "when",
    "custom",
    "messages",
    "message",
    "label",
    "description",
    "example",
    "default",
    "allow",
    "required",
    "optional",
    "forbidden",
    "unknown",
    "keys",
    "append",
    "rename",
    "assert",
    "with",
    "without",
    "xor",
    "oxor",
    "or",
    "and",
    "nand",
    "items",
    "ordered",
    "single",
    "sparse",
    "unique",
    "has",
    "sort",
    "match",
    "integer",
    "precision",
    "positive",
    "negative",
    "port",
    "greater",
    "less",
    "equal",
    "not",
    "exist",
    "empty",
    "raw",
    "strict",
    "failover",
    "concat",
    "insensitive",
    "trim",
    "lowercase",
    "uppercase",
    "replace",
    "truncate",
    "isoDate",
    "iso",
    "uuid",
    "guid",
    "hostname",
    "ip",
    "creditCard",
    "alphanum",
    "token",
    "hex",
    "base64",
    "dataUri",
    "domain",
    "external",
    "error",
    "prefs",
    "preferences",
    "meta",
    "note",
    "tag",
    "unit",
    "rule",
    "shared",
    "id",
    "cache",
];
/** Strip line and block comments; leave strings roughly intact. */
export function stripComments(raw) {
    const src = (raw ?? "").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
    let out = "";
    let i = 0;
    const n = src.length;
    let inString = false;
    let quote = "";
    let inTemplate = false;
    let templateDepth = 0;
    while (i < n) {
        const ch = src[i];
        const next = i + 1 < n ? src[i + 1] : "";
        if (inTemplate) {
            out += ch;
            if (ch === "`" && templateDepth === 0) {
                inTemplate = false;
                i++;
                continue;
            }
            if (ch === "$" && next === "{") {
                templateDepth++;
                out += next;
                i += 2;
                continue;
            }
            if (ch === "}" && templateDepth > 0) {
                templateDepth--;
                i++;
                continue;
            }
            if (ch === "\\" && i + 1 < n) {
                out += src[i + 1];
                i += 2;
                continue;
            }
            i++;
            continue;
        }
        if (inString) {
            out += ch;
            if (ch === "\\" && i + 1 < n) {
                out += src[i + 1];
                i += 2;
                continue;
            }
            if (ch === quote)
                inString = false;
            i++;
            continue;
        }
        if (ch === "`") {
            inTemplate = true;
            templateDepth = 0;
            out += ch;
            i++;
            continue;
        }
        if (ch === '"' || ch === "'") {
            inString = true;
            quote = ch;
            out += ch;
            i++;
            continue;
        }
        if (ch === "/" && next === "/") {
            i += 2;
            while (i < n && src[i] !== "\n")
                i++;
            continue;
        }
        if (ch === "/" && next === "*") {
            i += 2;
            while (i + 1 < n && !(src[i] === "*" && src[i + 1] === "/"))
                i++;
            i = Math.min(n, i + 2);
            continue;
        }
        out += ch;
        i++;
    }
    return out;
}
function findMatchingBrace(s, openBraceIndex) {
    let depth = 0;
    let inString = false;
    let quote = "";
    for (let i = openBraceIndex; i < s.length; i++) {
        const c = s[i];
        if (inString) {
            if (c === "\\" && i + 1 < s.length) {
                i++;
                continue;
            }
            if (c === quote)
                inString = false;
            continue;
        }
        if (c === '"' || c === "'" || c === "`") {
            inString = true;
            quote = c;
            continue;
        }
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
function findMatchingParen(s, openParenIndex) {
    let depth = 0;
    let inString = false;
    let quote = "";
    for (let i = openParenIndex; i < s.length; i++) {
        const c = s[i];
        if (inString) {
            if (c === "\\" && i + 1 < s.length) {
                i++;
                continue;
            }
            if (c === quote)
                inString = false;
            continue;
        }
        if (c === '"' || c === "'" || c === "`") {
            inString = true;
            quote = c;
            continue;
        }
        if (c === "(")
            depth++;
        else if (c === ")") {
            depth--;
            if (depth === 0)
                return i;
        }
    }
    return -1;
}
function splitTopLevelCommas(s) {
    const parts = [];
    let depthParen = 0;
    let depthBrace = 0;
    let depthBracket = 0;
    let inString = false;
    let quote = "";
    let cur = "";
    for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (inString) {
            cur += c;
            if (c === "\\" && i + 1 < s.length) {
                cur += s[i + 1];
                i++;
                continue;
            }
            if (c === quote)
                inString = false;
            continue;
        }
        if (c === '"' || c === "'" || c === "`") {
            inString = true;
            quote = c;
            cur += c;
            continue;
        }
        if (c === "(")
            depthParen++;
        if (c === ")")
            depthParen--;
        if (c === "{")
            depthBrace++;
        if (c === "}")
            depthBrace--;
        if (c === "[")
            depthBracket++;
        if (c === "]")
            depthBracket--;
        if (c === "," &&
            depthParen === 0 &&
            depthBrace === 0 &&
            depthBracket === 0) {
            parts.push(cur.trim());
            cur = "";
            continue;
        }
        cur += c;
    }
    if (cur.trim())
        parts.push(cur.trim());
    return parts;
}
/**
 * List Joi schemas from `const Foo = Joi.object` / `joi.string` / `export const` assignments.
 */
export function listSchemas(text) {
    const cleaned = stripComments(text ?? "");
    const schemas = [];
    const seen = new Set();
    const assignRe = new RegExp(`(?:export\\s+)?(?:const|let|var)\\s+([A-Za-z_][A-Za-z0-9_]*)\\s*=\\s*(?:Joi|joi)\\s*\\.\\s*(${JOI_KINDS})\\s*(?:\\(|\\.|$)`, "g");
    let m;
    while ((m = assignRe.exec(cleaned))) {
        const name = m[1];
        let kind = m[2];
        if (kind === "alt")
            kind = "alternatives";
        if (kind === "func")
            kind = "function";
        if (seen.has(name))
            continue;
        seen.add(name);
        schemas.push({ name, kind });
    }
    return { schemas, count: schemas.length };
}
/**
 * Find Joi.object({ ... }) / joi.object({ ... }) bodies.
 */
function extractObjectBodies(text) {
    const cleaned = stripComments(text ?? "");
    const results = [];
    const re = /(?:Joi|joi)\s*\.\s*object\s*\(/g;
    let m;
    while ((m = re.exec(cleaned))) {
        const openParen = m.index + m[0].length - 1;
        const closeParen = findMatchingParen(cleaned, openParen);
        if (closeParen < 0)
            continue;
        const args = cleaned.slice(openParen + 1, closeParen);
        let i = 0;
        while (i < args.length && /\s/.test(args[i]))
            i++;
        if (args[i] !== "{")
            continue;
        const closeBrace = findMatchingBrace(args, i);
        if (closeBrace < 0)
            continue;
        const body = args.slice(i + 1, closeBrace);
        const before = cleaned.slice(Math.max(0, m.index - 120), m.index);
        const nameM = before.match(/(?:export\s+)?(?:const|let|var)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*$/);
        const entry = { body };
        if (nameM)
            entry.schema = nameM[1];
        results.push(entry);
    }
    return results;
}
function parseJoiTypeFromValue(val) {
    const v = val.trim();
    const jm = v.match(/^(?:Joi|joi)\s*\.\s*([A-Za-z_][A-Za-z0-9_]*)/);
    if (jm) {
        let kind = jm[1];
        if (kind === "alt")
            kind = "alternatives";
        if (kind === "func")
            kind = "function";
        return kind;
    }
    const id = v.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*(?:\.|$)/);
    if (id && !/^(true|false|null|undefined)$/.test(id[1])) {
        return id[1];
    }
    return undefined;
}
/**
 * Keys inside Joi.object({ ... }) best-effort.
 */
export function listFields(text) {
    const bodies = extractObjectBodies(text);
    const fields = [];
    const seen = new Set();
    for (const { schema, body } of bodies) {
        const entries = splitTopLevelCommas(body);
        for (const entry of entries) {
            if (!entry.trim())
                continue;
            const kv = entry.match(/^(?:([A-Za-z_][A-Za-z0-9_]*)|['"`]([^'"`]+)['"`])\s*:\s*([\s\S]+)$/);
            if (!kv)
                continue;
            const name = (kv[1] || kv[2]);
            const val = kv[3].trim();
            if (/^(async\s+)?function\b/.test(val) ||
                /^(\([^)]*\)|[A-Za-z_]+)\s*=>/.test(val)) {
                continue;
            }
            const key = `${schema ?? ""}::${name}`;
            if (seen.has(key))
                continue;
            seen.add(key);
            const field = { name };
            if (schema)
                field.schema = schema;
            const jt = parseJoiTypeFromValue(val);
            if (jt)
                field.joiType = jt;
            if (/\.\s*required\s*\(/.test(val) || /\.\s*exist\s*\(/.test(val)) {
                field.required = true;
            }
            if (/\.\s*optional\s*\(/.test(val)) {
                field.optional = true;
            }
            fields.push(field);
        }
    }
    return { fields, count: fields.length };
}
/**
 * Chained Joi rule methods (.min/.max/.email/.uri/.pattern/.valid/.when/.custom/.messages …).
 */
export function listRules(text) {
    const cleaned = stripComments(text ?? "");
    const rules = [];
    for (const kind of RULE_KINDS) {
        const re = new RegExp(`\\.\\s*${kind}\\s*\\(`, "g");
        let m;
        while ((m = re.exec(cleaned))) {
            const before = cleaned.slice(Math.max(0, m.index - 200), m.index);
            let on;
            const assignMatches = [
                ...before.matchAll(/(?:export\s+)?(?:const|let|var)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=/g),
            ];
            if (assignMatches.length) {
                on = assignMatches[assignMatches.length - 1][1];
            }
            else {
                const trail = before.match(/([A-Za-z_][A-Za-z0-9_]*)(?:\s*\.\s*[A-Za-z_][A-Za-z0-9_]*\s*\([^)]*\))*\s*$/);
                if (trail)
                    on = trail[1];
            }
            const info = { kind };
            if (on)
                info.on = on;
            rules.push(info);
        }
    }
    return { rules, count: rules.length };
}
function countOccurrences(text, re) {
    let n = 0;
    const r = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    while (r.exec(text))
        n++;
    return n;
}
export function lintJoi(text) {
    const findings = [];
    const raw = text ?? "";
    if (!raw.trim()) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Source text is empty. Paste Joi schema JS/TS (e.g. const Foo = Joi.object({ ... })).",
        });
        return findings;
    }
    const cleaned = stripComments(raw);
    const { schemas } = listSchemas(cleaned);
    const { fields } = listFields(cleaned);
    const hasJoi = /(?:Joi|joi)\s*\.\s*(?:object|array|string|number|boolean|any|alternatives|alt)\b/.test(cleaned) || /from\s+['"]joi['"]/.test(cleaned) || /require\s*\(\s*['"]joi['"]\s*\)/.test(cleaned);
    if (!hasJoi && schemas.length === 0) {
        findings.push({
            severity: "warn",
            rule: "no_joi_detected",
            advice: "No `Joi.object` / `joi.string` / `from 'joi'` patterns detected. Confirm this is Joi schema source.",
        });
    }
    // Deprecated Joi.reach
    if (/(?:Joi|joi)\s*\.\s*reach\s*\(/.test(cleaned)) {
        findings.push({
            severity: "warn",
            rule: "deprecated_joi_reach",
            advice: "`Joi.reach()` is deprecated/removed in modern Joi. Prefer schema extraction via `.extract()` / named keys, or keep references to nested schemas explicitly.",
        });
    }
    // Joi.assert tip — runtime assertion helper, not a schema builder
    if (/(?:Joi|joi)\s*\.\s*assert\s*\(/.test(cleaned)) {
        findings.push({
            severity: "info",
            rule: "joi_assert_tip",
            advice: "`Joi.assert(value, schema)` throws on failure — useful in scripts/tests. For HTTP handlers prefer `schema.validate()` / `validateAsync()` so you can map `error.details` to responses.",
        });
    }
    // allow(null) vs optional
    const allowNullCount = countOccurrences(cleaned, /\.\s*allow\s*\(\s*null\s*\)/g);
    if (allowNullCount >= 1) {
        findings.push({
            severity: "info",
            rule: "allow_null_vs_optional",
            advice: "`.allow(null)` permits a null value but the key may still be required. Use `.optional()` (or `.allow(null).optional()`) when the key itself may be omitted; use `.valid(null)` only when null is an explicit enum member.",
        });
    }
    // .unknown(true) tip
    const hasUnknownTrue = /\.\s*unknown\s*\(\s*true\s*\)/.test(cleaned);
    const hasUnknownFalse = /\.\s*unknown\s*\(\s*false\s*\)/.test(cleaned);
    if (hasUnknownTrue) {
        findings.push({
            severity: "info",
            rule: "unknown_keys_tip",
            advice: "`.unknown(true)` allows undeclared keys. Prefer `.unknown(false)` (Joi default for objects) when you want to reject extras; document intentional passthrough carefully.",
        });
    }
    else if (!hasUnknownFalse &&
        schemas.some((s) => s.kind === "object")) {
        findings.push({
            severity: "info",
            rule: "object_unknown_keys_default_tip",
            advice: "Joi objects disallow unknown keys by default. Use `.unknown(true)` only when extras must pass through.",
        });
    }
    const anyCount = countOccurrences(cleaned, /(?:Joi|joi)\s*\.\s*any\s*\(/g);
    if (anyCount >= 3) {
        findings.push({
            severity: "warn",
            rule: "joi_any_overuse",
            advice: `Found ${anyCount}× Joi.any(). Prefer narrower types (Joi.string(), Joi.object({...}), Joi.alternatives().try(...)) for clearer validation errors.`,
        });
    }
    else if (anyCount >= 1) {
        findings.push({
            severity: "info",
            rule: "joi_any_usage",
            advice: "`Joi.any()` detected — it accepts almost everything. Prefer a concrete type when possible.",
        });
    }
    // email/uri helper tips
    for (const f of fields) {
        const n = f.name.toLowerCase();
        if ((n === "email" || n.endsWith("email") || n === "emailaddress") &&
            f.joiType === "string") {
            const loose = new RegExp(`\\b${f.name}\\s*:\\s*(?:Joi|joi)\\s*\\.\\s*string\\s*\\([^)]*\\)((?:\\s*\\.\\s*[A-Za-z_]+\\s*\\([^)]*\\))*)`, "i");
            const lm = cleaned.match(loose);
            if (lm && !/\.\s*email\s*\(/.test(lm[0])) {
                findings.push({
                    severity: "info",
                    rule: "missing_email_helper",
                    advice: `Field "${f.name}" looks like an email but uses plain Joi.string(). Consider .email().`,
                });
                break;
            }
        }
    }
    for (const f of fields) {
        const n = f.name.toLowerCase();
        if ((n === "url" || n === "uri" || n === "website" || n === "href" || n.endsWith("url") || n.endsWith("uri")) &&
            f.joiType === "string") {
            const loose = new RegExp(`\\b${f.name}\\s*:\\s*(?:Joi|joi)\\s*\\.\\s*string\\s*\\([^)]*\\)((?:\\s*\\.\\s*[A-Za-z_]+\\s*\\([^)]*\\))*)`, "i");
            const lm = cleaned.match(loose);
            if (lm && !/\.\s*uri\s*\(/.test(lm[0])) {
                findings.push({
                    severity: "info",
                    rule: "missing_uri_helper",
                    advice: `Field "${f.name}" looks like a URL/URI but uses plain Joi.string(). Consider .uri().`,
                });
                break;
            }
        }
    }
    if (schemas.length === 0 && hasJoi) {
        findings.push({
            severity: "info",
            rule: "inline_schemas_only",
            advice: "Joi usage detected but no `const/let/var` (or `export const`) schema assignments matched. Inline `Joi.object({...})` may still appear in fields/rules hints.",
        });
    }
    if (fields.length === 0 && schemas.some((s) => s.kind === "object")) {
        findings.push({
            severity: "info",
            rule: "empty_object_fields",
            advice: "`Joi.object(...)` assignments found but no object-literal keys parsed. Schemas built via `.keys()`, spreads, or non-literal args may not be visible to these heuristics.",
        });
    }
    return findings;
}
