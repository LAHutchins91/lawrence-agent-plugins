/**
 * Best-effort Zod schema TS/JS text heuristics.
 * No zod runtime, no network, no filesystem follow, no eval / no TS AST.
 */
const ZOD_KINDS = "object|array|string|number|boolean|bigint|date|symbol|undefined|null|void|any|unknown|never|enum|nativeEnum|literal|union|discriminatedUnion|intersection|tuple|record|map|set|function|lazy|promise|optional|nullable|default|catch|pipeline|readonly|custom|effects|nan|coerce";
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
 * List Zod schemas from `const Foo = z.object` / `export const` assignments.
 */
export function listSchemas(text) {
    const cleaned = stripComments(text ?? "");
    const schemas = [];
    const seen = new Set();
    const assignRe = new RegExp(`(?:export\\s+)?(?:const|let|var)\\s+([A-Za-z_][A-Za-z0-9_]*)\\s*=\\s*z\\s*\\.\\s*(${ZOD_KINDS})\\s*(?:\\(|\\.|$)`, "g");
    let m;
    while ((m = assignRe.exec(cleaned))) {
        const name = m[1];
        const kind = m[2];
        if (seen.has(name))
            continue;
        seen.add(name);
        schemas.push({ name, kind });
    }
    // Also: export { Foo } where Foo = z.... already caught by assign
    // Bare: FooSchema = z.object without const (rare) — skip
    // z.coerce.string etc. already covered via coerce kind then .string — assignRe
    // may miss `const X = z.coerce.string()` because after coerce comes . not (
    // Handle coerce chain: const X = z.coerce.string(
    const coerceRe = /(?:export\s+)?(?:const|let|var)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*z\s*\.\s*coerce\s*\.\s*([A-Za-z_][A-Za-z0-9_]*)\s*\(/g;
    while ((m = coerceRe.exec(cleaned))) {
        const name = m[1];
        const kind = `coerce.${m[2]}`;
        if (seen.has(name))
            continue;
        seen.add(name);
        schemas.push({ name, kind });
    }
    return { schemas, count: schemas.length };
}
/**
 * Find z.object({ ... }) bodies, optionally tied to a preceding assignment name.
 */
function extractObjectBodies(text) {
    const cleaned = stripComments(text ?? "");
    const results = [];
    const re = /z\s*\.\s*object\s*\(/g;
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
        // Look backward for assignment name
        const before = cleaned.slice(Math.max(0, m.index - 120), m.index);
        const nameM = before.match(/(?:export\s+)?(?:const|let|var)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*$/);
        const entry = { body };
        if (nameM)
            entry.schema = nameM[1];
        results.push(entry);
    }
    return results;
}
function parseZodTypeFromValue(val) {
    const v = val.trim();
    // z.string() / z.number().optional() / z.array(z.string())
    const zm = v.match(/^z\s*\.\s*([A-Za-z_][A-Za-z0-9_]*)/);
    if (zm) {
        const kind = zm[1];
        if (kind === "coerce") {
            const cm = v.match(/^z\s*\.\s*coerce\s*\.\s*([A-Za-z_][A-Za-z0-9_]*)/);
            return cm ? `coerce.${cm[1]}` : "coerce";
        }
        return kind;
    }
    // Identifier referencing another schema: UserSchema, fooSchema
    const id = v.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*(?:\.|$)/);
    if (id && !/^(true|false|null|undefined)$/.test(id[1])) {
        return id[1];
    }
    return undefined;
}
/**
 * Keys inside z.object({ ... }) best-effort.
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
            // name: value  OR  "name": value
            const kv = entry.match(/^(?:([A-Za-z_][A-Za-z0-9_]*)|['"`]([^'"`]+)['"`])\s*:\s*([\s\S]+)$/);
            if (!kv)
                continue;
            const name = (kv[1] || kv[2]);
            const val = kv[3].trim();
            if (/^(async\s+)?function\b/.test(val) || /^(\([^)]*\)|[A-Za-z_]+)\s*=>/.test(val)) {
                continue;
            }
            const key = `${schema ?? ""}::${name}`;
            if (seen.has(key))
                continue;
            seen.add(key);
            const field = { name };
            if (schema)
                field.schema = schema;
            const zt = parseZodTypeFromValue(val);
            if (zt)
                field.zodType = zt;
            if (/\.\s*optional\s*\(/.test(val))
                field.optional = true;
            if (/\.\s*nullable\s*\(/.test(val))
                field.nullable = true;
            // z.optional(z.string()) / z.nullable(z.string())
            if (/^z\s*\.\s*optional\s*\(/.test(val))
                field.optional = true;
            if (/^z\s*\.\s*nullable\s*\(/.test(val))
                field.nullable = true;
            fields.push(field);
        }
    }
    return { fields, count: fields.length };
}
/**
 * Chained refine / superRefine / transform / pipe / brand methods.
 */
export function listRefinements(text) {
    const cleaned = stripComments(text ?? "");
    const refinements = [];
    const kinds = [
        "refine",
        "superRefine",
        "transform",
        "pipe",
        "brand",
    ];
    for (const kind of kinds) {
        const re = new RegExp(`\\.\\s*${kind}\\s*\\(`, "g");
        let m;
        while ((m = re.exec(cleaned))) {
            // Look backward for schema binding name
            const before = cleaned.slice(Math.max(0, m.index - 200), m.index);
            // Prefer nearest assignment: const Foo = ... or FooSchema.
            let on;
            const assignMatches = [
                ...before.matchAll(/(?:export\s+)?(?:const|let|var)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=/g),
            ];
            if (assignMatches.length) {
                on = assignMatches[assignMatches.length - 1][1];
            }
            else {
                // chained on identifier: SomeSchema.refine
                const idM = before.match(/([A-Za-z_][A-Za-z0-9_]*)\s*$/);
                // The match ends right before `.refine` — may be whitespace after expr
                const trail = before.match(/([A-Za-z_][A-Za-z0-9_]*)(?:\s*\.\s*[A-Za-z_][A-Za-z0-9_]*\s*\([^)]*\))*\s*$/);
                if (trail)
                    on = trail[1];
                else if (idM)
                    on = idM[1];
            }
            const info = { kind };
            if (on)
                info.on = on;
            refinements.push(info);
        }
    }
    return { refinements, count: refinements.length };
}
function countOccurrences(text, re) {
    let n = 0;
    const r = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    while (r.exec(text))
        n++;
    return n;
}
export function lintZod(text) {
    const findings = [];
    const raw = text ?? "";
    if (!raw.trim()) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Source text is empty. Paste Zod schema TS/JS (e.g. const Foo = z.object({ ... })).",
        });
        return findings;
    }
    const cleaned = stripComments(raw);
    const { schemas } = listSchemas(cleaned);
    const { fields } = listFields(cleaned);
    const hasZod = /\bz\s*\.\s*(?:object|array|string|number|boolean|enum|record|union)\b/.test(cleaned) || /from\s+['"]zod['"]/.test(cleaned);
    if (!hasZod && schemas.length === 0) {
        findings.push({
            severity: "warn",
            rule: "no_zod_detected",
            advice: "No `z.object` / `z.string` / `from 'zod'` patterns detected. Confirm this is Zod schema source.",
        });
    }
    const anyCount = countOccurrences(cleaned, /\bz\s*\.\s*any\s*\(/g);
    const unknownCount = countOccurrences(cleaned, /\bz\s*\.\s*unknown\s*\(/g);
    if (anyCount + unknownCount >= 3) {
        findings.push({
            severity: "warn",
            rule: "any_unknown_overuse",
            advice: `Found ${anyCount}× z.any() and ${unknownCount}× z.unknown(). Prefer narrower schemas (z.string(), z.object({...}), z.union([...])) for safer parsing.`,
        });
    }
    else if (anyCount >= 1) {
        findings.push({
            severity: "info",
            rule: "z_any_usage",
            advice: "`z.any()` detected — it accepts everything and skips parsing. Prefer `z.unknown()` plus narrowing, or a concrete schema.",
        });
    }
    // email/url helper tips: field name suggests email/url but type is plain z.string() without .email()/.url()
    for (const f of fields) {
        const n = f.name.toLowerCase();
        if ((n === "email" || n.endsWith("email") || n === "emailaddress") &&
            f.zodType === "string") {
            // If no .email( near this field name assignment inside objects
            const loose = new RegExp(`\\b${f.name}\\s*:\\s*z\\s*\\.\\s*string\\s*\\([^)]*\\)((?:\\s*\\.\\s*[A-Za-z_]+\\s*\\([^)]*\\))*)`, "i");
            const lm = cleaned.match(loose);
            if (lm && !/\.\s*email\s*\(/.test(lm[1] ?? "") && !/\.\s*email\s*\(/.test(lm[0])) {
                findings.push({
                    severity: "info",
                    rule: "missing_email_helper",
                    advice: `Field "${f.name}" looks like an email but uses plain z.string(). Consider z.string().email() (or z.email() in Zod 4).`,
                });
                break; // one tip is enough
            }
        }
    }
    for (const f of fields) {
        const n = f.name.toLowerCase();
        if ((n === "url" || n === "website" || n === "href" || n.endsWith("url")) &&
            f.zodType === "string") {
            const loose = new RegExp(`\\b${f.name}\\s*:\\s*z\\s*\\.\\s*string\\s*\\([^)]*\\)((?:\\s*\\.\\s*[A-Za-z_]+\\s*\\([^)]*\\))*)`, "i");
            const lm = cleaned.match(loose);
            if (lm && !/\.\s*url\s*\(/.test(lm[0])) {
                findings.push({
                    severity: "info",
                    rule: "missing_url_helper",
                    advice: `Field "${f.name}" looks like a URL but uses plain z.string(). Consider z.string().url() (or z.url() in Zod 4).`,
                });
                break;
            }
        }
    }
    const hasPassthrough = /\.\s*passthrough\s*\(/.test(cleaned);
    const hasStrict = /\.\s*strict\s*\(/.test(cleaned);
    const hasStrip = /\.\s*strip\s*\(/.test(cleaned);
    if (hasPassthrough && !hasStrict) {
        findings.push({
            severity: "info",
            rule: "passthrough_vs_strict",
            advice: "`.passthrough()` keeps unknown keys. If you want to reject extras, use `.strict()`; default Zod objects strip unknown keys (`.strip()`).",
        });
    }
    else if (!hasPassthrough && !hasStrict && !hasStrip && schemas.some((s) => s.kind === "object")) {
        findings.push({
            severity: "info",
            rule: "object_unknown_keys_tip",
            advice: "Zod objects strip unknown keys by default. Use `.strict()` to reject extras or `.passthrough()` to keep them.",
        });
    }
    // z.record tips — single-arg z.record(valueSchema) vs two-arg; Zod 3 deprecated patterns
    if (/\bz\s*\.\s*record\s*\(/.test(cleaned)) {
        // Detect z.record(z.string()) one-arg form (value-only) — still valid but tip about key schema
        const recordRe = /\bz\s*\.\s*record\s*\(/g;
        let rm;
        let oneArgHint = false;
        while ((rm = recordRe.exec(cleaned))) {
            const open = rm.index + rm[0].length - 1;
            const close = findMatchingParen(cleaned, open);
            if (close < 0)
                continue;
            const args = cleaned.slice(open + 1, close);
            const parts = splitTopLevelCommas(args);
            if (parts.length === 1) {
                oneArgHint = true;
                break;
            }
        }
        if (oneArgHint) {
            findings.push({
                severity: "info",
                rule: "z_record_key_schema_tip",
                advice: "`z.record(valueSchema)` uses string keys. Prefer `z.record(z.string(), valueSchema)` (or a key schema) for clarity across Zod 3/4; avoid deprecated key-enum-only patterns.",
            });
        }
    }
    // Deprecated: z.record with enum as sole confusing form — also tip on z.object({}).nonstrict if present
    if (/\.\s*nonstrict\s*\(/.test(cleaned)) {
        findings.push({
            severity: "warn",
            rule: "deprecated_nonstrict",
            advice: "`.nonstrict()` is a legacy alias — prefer `.passthrough()` for keeping unknown keys.",
        });
    }
    if (schemas.length === 0 && hasZod) {
        findings.push({
            severity: "info",
            rule: "inline_schemas_only",
            advice: "Zod usage detected but no `const/let/var` (or `export const`) schema assignments matched. Inline `z.object({...})` may still appear in fields/refine hints.",
        });
    }
    if (fields.length === 0 && schemas.some((s) => s.kind === "object")) {
        findings.push({
            severity: "info",
            rule: "empty_object_fields",
            advice: "`z.object(...)` assignments found but no object-literal keys parsed. Schemas built via variables, spreads, or non-literal args may not be visible to these heuristics.",
        });
    }
    return findings;
}
