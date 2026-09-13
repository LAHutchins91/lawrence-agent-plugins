/**
 * Best-effort TypeBox TS/JS text heuristics.
 * No @sinclair/typebox runtime, no network, no filesystem follow, no eval / no TS AST.
 */
/** Common TypeBox constructors / helpers on the Type namespace. */
const TB_KINDS = "Object|String|Number|Integer|Boolean|Array|Tuple|Record|Union|Intersect|Literal|Enum|KeyOf|Ref|Recursive|Partial|Required|Pick|Omit|Composite|Optional|Readonly|ReadonlyOptional|Any|Unknown|Never|Null|Undefined|Void|Date|Uint8Array|RegExp|Function|Promise|Constructor|TemplateLiteral|Unsafe|Not|Exclude|Extract|Mapped|Transform|Index|Rest|This|Strict|Module|Import|BigInt|Symbol|Awaited|Capitalize|Uncapitalize|Uppercase|Lowercase|InstanceType|Parameters|ReturnType|ConstructorParameters|Extends|Clone|Const|Box|AsyncIterator|Iterator|Buffer";
/** Compose / combinator kinds surfaced by tb_compose_hint. */
const COMPOSE_KINDS = [
    "Union",
    "Intersect",
    "Partial",
    "Required",
    "Pick",
    "Omit",
    "Composite",
    "Ref",
    "Recursive",
    "Optional",
    "Readonly",
    "ReadonlyOptional",
    "Exclude",
    "Extract",
    "Not",
    "Mapped",
    "Transform",
    "KeyOf",
    "Index",
    "Rest",
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
/** Detect Type / T namespace prefixes from imports. */
export function detectTypePrefixes(cleaned) {
    const prefixes = new Set();
    // import { Type } from '@sinclair/typebox'
    if (/import\s*\{[^}]*\bType\b[^}]*\}\s*from\s*['"]@sinclair\/typebox(?:\/[^'"]*)?['"]/.test(cleaned)) {
        prefixes.add("Type");
    }
    // import { Type as T } from '@sinclair/typebox'
    const asM = cleaned.match(/import\s*\{[^}]*\bType\s+as\s+([A-Za-z_][A-Za-z0-9_]*)\b[^}]*\}\s*from\s*['"]@sinclair\/typebox(?:\/[^'"]*)?['"]/);
    if (asM)
        prefixes.add(asM[1]);
    // import * as TypeBox from '@sinclair/typebox' — rare; skip nested TypeBox.Type
    const starM = cleaned.match(/import\s*\*\s*as\s+([A-Za-z_][A-Za-z0-9_]*)\s*from\s*['"]@sinclair\/typebox(?:\/[^'"]*)?['"]/);
    if (starM && starM[1] === "Type")
        prefixes.add("Type");
    // Heuristic fallback: if Type. or T. Object/String appears, include them
    if (/\bType\s*\.\s*(?:Object|String|Number|Array|Union)\b/.test(cleaned)) {
        prefixes.add("Type");
    }
    if (/\bT\s*\.\s*(?:Object|String|Number|Array|Union)\b/.test(cleaned)) {
        prefixes.add("T");
    }
    if (prefixes.size === 0) {
        // Default both so bare snippets without imports still match common styles
        prefixes.add("Type");
        prefixes.add("T");
    }
    return [...prefixes];
}
function prefixAlt(prefixes) {
    return prefixes.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
}
/**
 * List TypeBox assignments: const Foo = Type.Object / Type.String etc.
 */
export function listSchemas(text) {
    const cleaned = stripComments(text ?? "");
    const schemas = [];
    const seen = new Set();
    const prefixes = detectTypePrefixes(cleaned);
    const pAlt = prefixAlt(prefixes);
    const assignRe = new RegExp(`(?:export\\s+)?(?:const|let|var)\\s+([A-Za-z_][A-Za-z0-9_]*)\\s*=\\s*(?:${pAlt})\\s*\\.\\s*(${TB_KINDS})\\b`, "g");
    let m;
    while ((m = assignRe.exec(cleaned))) {
        const name = m[1];
        const kind = m[2];
        if (seen.has(name))
            continue;
        seen.add(name);
        schemas.push({ name, kind });
    }
    return { schemas, count: schemas.length };
}
/**
 * Find Type.Object({ ... }) / T.Object({ ... }) bodies.
 */
function extractObjectBodies(text) {
    const cleaned = stripComments(text ?? "");
    const prefixes = detectTypePrefixes(cleaned);
    const pAlt = prefixAlt(prefixes);
    const results = [];
    const re = new RegExp(`(?:${pAlt})\\s*\\.\\s*Object\\s*\\(`, "g");
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
function parseTypeHint(val, prefixes) {
    const v = val.trim();
    const pAlt = prefixAlt(prefixes);
    // Type.Optional(Type.String()) / Type.Array(Type.Number())
    const wrap = v.match(new RegExp(`^(?:${pAlt})\\s*\\.\\s*(Optional|Readonly|ReadonlyOptional|Array|Record|Union|Intersect|Partial|Required|Pick|Omit|Composite|Ref|Unsafe|Literal|Enum|Tuple|Not)\\s*\\(`));
    if (wrap) {
        const outer = wrap[1];
        const all = [
            ...v.matchAll(new RegExp(`(?:${pAlt})\\s*\\.\\s*([A-Za-z_][A-Za-z0-9_]*)\\b`, "g")),
        ];
        if (all.length >= 2) {
            return `${outer}(${all[1][1]})`;
        }
        return outer;
    }
    // Type.String / Type.Number (no call or with options)
    const plain = v.match(new RegExp(`^(?:${pAlt})\\s*\\.\\s*([A-Za-z_][A-Za-z0-9_]*)\\b`));
    if (plain)
        return plain[1];
    // Identifier referencing another schema
    const id = v.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*(?:\.|$|\()/);
    if (id && !/^(true|false|null|undefined)$/.test(id[1])) {
        return id[1];
    }
    return undefined;
}
/**
 * Keys inside Type.Object({ ... }) best-effort.
 */
export function listProps(text) {
    const cleaned = stripComments(text ?? "");
    const prefixes = detectTypePrefixes(cleaned);
    const bodies = extractObjectBodies(cleaned);
    const props = [];
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
            const prop = { name };
            if (schema)
                prop.schema = schema;
            const th = parseTypeHint(val, prefixes);
            if (th)
                prop.typeHint = th;
            props.push(prop);
        }
    }
    return { props, count: props.length };
}
/**
 * Type.Union / Intersect / Partial / Pick / Omit / Ref / Recursive etc.
 */
export function listCompose(text) {
    const cleaned = stripComments(text ?? "");
    const prefixes = detectTypePrefixes(cleaned);
    const pAlt = prefixAlt(prefixes);
    const compose = [];
    for (const kind of COMPOSE_KINDS) {
        const prefRe = new RegExp(`(?:${pAlt})\\s*\\.\\s*${kind}\\s*(?:\\(|$)`, "g");
        let m;
        while ((m = prefRe.exec(cleaned))) {
            const before = cleaned.slice(Math.max(0, m.index - 200), m.index);
            let on;
            const assignMatches = [
                ...before.matchAll(/(?:export\s+)?(?:const|let|var)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=/g),
            ];
            if (assignMatches.length) {
                on = assignMatches[assignMatches.length - 1][1];
            }
            const info = { kind };
            if (on)
                info.on = on;
            compose.push(info);
        }
    }
    return { compose, count: compose.length };
}
function countOccurrences(text, re) {
    let n = 0;
    const r = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    while (r.exec(text))
        n++;
    return n;
}
function fieldHasFormat(cleaned, name) {
    const re = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}\\s*:\\s*[\\s\\S]{0,180}?format\\s*:`, "i");
    return re.test(cleaned);
}
export function lintTypeBox(text) {
    const findings = [];
    const raw = text ?? "";
    if (!raw.trim()) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Source text is empty. Paste TypeBox TS/JS (e.g. const Foo = Type.Object({ ... }) or import { Type } from '@sinclair/typebox').",
        });
        return findings;
    }
    const cleaned = stripComments(raw);
    const prefixes = detectTypePrefixes(cleaned);
    const pAlt = prefixAlt(prefixes);
    const { schemas } = listSchemas(cleaned);
    const { props } = listProps(cleaned);
    const { compose } = listCompose(cleaned);
    const hasTypeBox = new RegExp(`(?:${pAlt})\\s*\\.\\s*(?:Object|String|Number|Boolean|Array|Union|Optional|Integer)\\b`).test(cleaned) || /from\s+['"]@sinclair\/typebox(?:\/[^'"]*)?['"]/.test(cleaned);
    if (!hasTypeBox && schemas.length === 0) {
        findings.push({
            severity: "warn",
            rule: "no_typebox_detected",
            advice: "No `Type.Object` / `Type.String` / `from '@sinclair/typebox'` patterns detected. Confirm this is TypeBox source (Type or T prefix).",
        });
    }
    const hasObject = new RegExp(`(?:${pAlt})\\s*\\.\\s*Object\\s*\\(`).test(cleaned);
    if (hasTypeBox && !hasObject && schemas.every((s) => s.kind !== "Object")) {
        findings.push({
            severity: "info",
            rule: "missing_object",
            advice: "TypeBox usage detected but no `Type.Object({ ... })` found. Object shapes usually use `Type.Object`; primitives alone may be intentional.",
        });
    }
    const anyCount = countOccurrences(cleaned, new RegExp(`(?:${pAlt})\\s*\\.\\s*Any\\b`, "g"));
    const unknownCount = countOccurrences(cleaned, new RegExp(`(?:${pAlt})\\s*\\.\\s*Unknown\\b`, "g"));
    const unsafeCount = countOccurrences(cleaned, new RegExp(`(?:${pAlt})\\s*\\.\\s*Unsafe\\s*\\(`, "g"));
    if (anyCount + unsafeCount + unknownCount >= 3) {
        findings.push({
            severity: "warn",
            rule: "any_unsafe_overuse",
            advice: `Found ${anyCount}× Type.Any, ${unsafeCount}× Type.Unsafe, and ${unknownCount}× Type.Unknown. Prefer narrower schemas (Type.String, Type.Object({...}), Type.Union([...])) for safer JSON Schema output.`,
        });
    }
    else {
        if (anyCount >= 1) {
            findings.push({
                severity: "info",
                rule: "type_any_usage",
                advice: "`Type.Any` detected — it accepts everything. Prefer `Type.Unknown` plus narrowing, or a concrete schema.",
            });
        }
        if (unsafeCount >= 1) {
            findings.push({
                severity: "info",
                rule: "type_unsafe_usage",
                advice: "`Type.Unsafe(...)` detected — it embeds raw JSON Schema without TypeBox checks. Prefer first-class Type.* constructors unless you truly need an escape hatch.",
            });
        }
    }
    // additionalProperties tip
    const objectCount = countOccurrences(cleaned, new RegExp(`(?:${pAlt})\\s*\\.\\s*Object\\s*\\(`, "g"));
    const hasAddl = /additionalProperties\s*:/.test(cleaned);
    const addlTrue = /additionalProperties\s*:\s*true\b/.test(cleaned);
    const hasStrict = new RegExp(`(?:${pAlt})\\s*\\.\\s*Strict\\s*\\(`).test(cleaned);
    if (objectCount >= 1 && addlTrue) {
        findings.push({
            severity: "info",
            rule: "additional_properties_open",
            advice: "`additionalProperties: true` on a Type.Object allows unknown keys. Prefer `additionalProperties: false` (or Type.Strict) when the shape should be closed.",
        });
    }
    else if (objectCount >= 1 && !hasAddl && !hasStrict) {
        findings.push({
            severity: "info",
            rule: "additional_properties_tip",
            advice: "Type.Object(...) found without an explicit `additionalProperties` option. Set `{ additionalProperties: false }` (or wrap with Type.Strict) to reject unknown keys — TypeBox/JSON Schema defaults can vary by version.",
        });
    }
    // Format tips: email / url / uuid-like props using plain Type.String
    for (const p of props) {
        const n = p.name.toLowerCase();
        const plainString = p.typeHint === "String" || p.typeHint === "Optional(String)";
        if (!plainString)
            continue;
        if ((n === "email" || n.endsWith("email") || n === "emailaddress") &&
            !fieldHasFormat(cleaned, p.name)) {
            findings.push({
                severity: "info",
                rule: "format_email_tip",
                advice: `Field "${p.name}" looks like an email but uses plain Type.String. Consider \`Type.String({ format: 'email' })\` (and register the format if you compile with AJV).`,
            });
            break;
        }
    }
    for (const p of props) {
        const n = p.name.toLowerCase();
        const plainString = p.typeHint === "String" || p.typeHint === "Optional(String)";
        if (!plainString)
            continue;
        if ((n === "url" || n === "website" || n === "href" || n.endsWith("url")) &&
            !fieldHasFormat(cleaned, p.name)) {
            findings.push({
                severity: "info",
                rule: "format_url_tip",
                advice: `Field "${p.name}" looks like a URL but uses plain Type.String. Consider \`Type.String({ format: 'uri' })\` (or 'url') and register the format at compile time.`,
            });
            break;
        }
    }
    for (const p of props) {
        const n = p.name.toLowerCase();
        const plainString = p.typeHint === "String" || p.typeHint === "Optional(String)";
        if (!plainString)
            continue;
        if ((n === "uuid" || n === "id" || n.endsWith("id") || n === "ulid") &&
            !fieldHasFormat(cleaned, p.name)) {
            findings.push({
                severity: "info",
                rule: "format_uuid_tip",
                advice: `Field "${p.name}" looks like an identifier but uses plain Type.String. Consider \`Type.String({ format: 'uuid' })\` (or 'ulid') when the value is a standard id.`,
            });
            break;
        }
    }
    // Optional vs required-ish confusion
    const hasOptional = compose.some((c) => c.kind === "Optional");
    const hasPartial = compose.some((c) => c.kind === "Partial");
    if (hasOptional && hasPartial) {
        findings.push({
            severity: "info",
            rule: "optional_vs_partial_tip",
            advice: "Both `Type.Optional` and `Type.Partial` appear. Optional marks a single property; Partial maps every key. Prefer one style per object to keep required/optional intent obvious.",
        });
    }
    if (schemas.length === 0 && hasTypeBox) {
        findings.push({
            severity: "info",
            rule: "inline_schemas_only",
            advice: "TypeBox usage detected but no `const/let/var` (or `export const`) schema assignments matched. Inline `Type.Object({...})` may still appear in props/compose hints.",
        });
    }
    if (props.length === 0 && schemas.some((s) => s.kind === "Object")) {
        findings.push({
            severity: "info",
            rule: "empty_object_props",
            advice: "`Type.Object(...)` assignments found but no object-literal keys parsed. Spreads, variables, or mapped forms may not be visible to these heuristics.",
        });
    }
    return findings;
}
