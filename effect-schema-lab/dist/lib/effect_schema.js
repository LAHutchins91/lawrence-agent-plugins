/**
 * Best-effort Effect Schema TS/JS text heuristics.
 * No Effect runtime, no network, no filesystem follow, no eval / no TS AST.
 */
/** Common Effect Schema constructors / helpers. */
const EFF_KINDS = "Struct|String|Number|Boolean|BigInt|Symbol|Undefined|Void|Null|Any|Unknown|Never|Literal|Enums|Union|Tuple|Array|NonEmptyArray|Record|Map|Set|Date|DateFromSelf|DateFromString|optional|optionalWith|NullOr|UndefinedOr|NullishOr|OptionFromSelf|OptionFromNullOr|OptionFromUndefinedOr|OptionFromNullable|EitherFromSelf|EitherFromUnion|Readonly|mutable|suspend|LazyArg|InstanceOf|TemplateLiteral|NonEmptyString|compose|transform|transformOrFail|filter|brand|encode|decode|encodeUnknown|decodeUnknown|declarations|TaggedStruct|TaggedClass|TaggedError|TaggedRequest|Class|ULID|UUID|ChunkFromSelf|Chunk|HashSet|HashMap|SortedSet|Config|BooleanFromString|NumberFromString|BigIntFromNumber|Int|Finite|GreaterThan|LessThan|Between|positive|negative|nonNegative|nonPositive|Secret|Redacted|Duration|DurationFromSelf|BigDecimal|BigDecimalFromSelf|Cause|Exit|FiberId";
/** Transform / combinator kinds surfaced by eff_transform_hint. */
const TRANSFORM_KINDS = [
    "transform",
    "transformOrFail",
    "filter",
    "pipe",
    "optional",
    "optionalWith",
    "NullOr",
    "UndefinedOr",
    "NullishOr",
    "Union",
    "brand",
    "compose",
    "annotations",
    "mutable",
    "Readonly",
    "encode",
    "decode",
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
/** Detect Schema / S namespace prefixes from imports. */
export function detectSchemaPrefixes(cleaned) {
    const prefixes = new Set();
    // import { Schema } from 'effect' / '@effect/schema'
    if (/import\s*\{[^}]*\bSchema\b[^}]*\}\s*from\s*['"](?:effect|@effect\/schema)['"]/.test(cleaned)) {
        prefixes.add("Schema");
    }
    // import { Schema as S } from 'effect'
    const asM = cleaned.match(/import\s*\{[^}]*\bSchema\s+as\s+([A-Za-z_][A-Za-z0-9_]*)\b[^}]*\}\s*from\s*['"](?:effect|@effect\/schema)['"]/);
    if (asM)
        prefixes.add(asM[1]);
    // import * as Schema from '@effect/schema/Schema' (rare)
    const starM = cleaned.match(/import\s*\*\s*as\s+([A-Za-z_][A-Za-z0-9_]*)\s*from\s*['"](?:@effect\/schema(?:\/Schema)?|effect\/Schema)['"]/);
    if (starM)
        prefixes.add(starM[1]);
    // Heuristic fallback: if Schema. or S. Struct/String appears, include them
    if (/\bSchema\s*\.\s*(?:Struct|String|Number|Array|Union)\b/.test(cleaned)) {
        prefixes.add("Schema");
    }
    if (/\bS\s*\.\s*(?:Struct|String|Number|Array|Union)\b/.test(cleaned)) {
        prefixes.add("S");
    }
    if (prefixes.size === 0) {
        // Default both so bare snippets without imports still match common styles
        prefixes.add("Schema");
        prefixes.add("S");
    }
    return [...prefixes];
}
function prefixAlt(prefixes) {
    return prefixes.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
}
/**
 * List Effect Schema assignments: const Foo = Schema.Struct / S.String etc.
 */
export function listSchemas(text) {
    const cleaned = stripComments(text ?? "");
    const schemas = [];
    const seen = new Set();
    const prefixes = detectSchemaPrefixes(cleaned);
    const pAlt = prefixAlt(prefixes);
    // const Foo = Schema.Struct( / Schema.String / Schema.String.pipe(
    const assignRe = new RegExp(`(?:export\\s+)?(?:const|let|var)\\s+([A-Za-z_][A-Za-z0-9_]*)\\s*=\\s*(?:${pAlt})\\s*\\.\\s*(${EFF_KINDS})\\b`, "g");
    let m;
    while ((m = assignRe.exec(cleaned))) {
        const name = m[1];
        const kind = m[2];
        if (seen.has(name))
            continue;
        seen.add(name);
        schemas.push({ name, kind });
    }
    // const Foo = Schema.String.pipe(...) — kind already String via above
    // const Foo = SomeOther.pipe(Schema.brand) — skip (not a Schema.* head)
    // Chained: const X = Schema.Struct({...}).pipe(...) — Struct already caught
    return { schemas, count: schemas.length };
}
/**
 * Find Schema.Struct({ ... }) / S.Struct({ ... }) bodies.
 */
function extractStructBodies(text) {
    const cleaned = stripComments(text ?? "");
    const prefixes = detectSchemaPrefixes(cleaned);
    const pAlt = prefixAlt(prefixes);
    const results = [];
    const re = new RegExp(`(?:${pAlt})\\s*\\.\\s*Struct\\s*\\(`, "g");
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
    // Schema.optional(Schema.String) / Schema.NullOr(Schema.Number)
    const wrap = v.match(new RegExp(`^(?:${pAlt})\\s*\\.\\s*(optional(?:With)?|NullOr|UndefinedOr|NullishOr|Array|NonEmptyArray|Union|Record|mutable|Readonly|brand)\\s*\\(`));
    if (wrap) {
        const outer = wrap[1];
        // Peek inner Schema.X
        const inner = v.match(new RegExp(`(?:${pAlt})\\s*\\.\\s*([A-Za-z_][A-Za-z0-9_]*)\\b`));
        // Find second Schema. occurrence for wrapped types
        const all = [
            ...v.matchAll(new RegExp(`(?:${pAlt})\\s*\\.\\s*([A-Za-z_][A-Za-z0-9_]*)\\b`, "g")),
        ];
        if (all.length >= 2) {
            return `${outer}(${all[1][1]})`;
        }
        if (inner)
            return outer;
        return outer;
    }
    // Schema.String / Schema.Number (no call or with call)
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
 * Keys inside Schema.Struct({ ... }) best-effort.
 */
export function listFields(text) {
    const cleaned = stripComments(text ?? "");
    const prefixes = detectSchemaPrefixes(cleaned);
    const bodies = extractStructBodies(cleaned);
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
            const th = parseTypeHint(val, prefixes);
            if (th)
                field.typeHint = th;
            fields.push(field);
        }
    }
    return { fields, count: fields.length };
}
/**
 * Schema.transform / filter / pipe / optional / NullOr / Union etc.
 */
export function listTransforms(text) {
    const cleaned = stripComments(text ?? "");
    const prefixes = detectSchemaPrefixes(cleaned);
    const pAlt = prefixAlt(prefixes);
    const transforms = [];
    for (const kind of TRANSFORM_KINDS) {
        // Prefixed: Schema.transform( / S.filter(
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
            transforms.push(info);
        }
        // Chained .pipe( — already covered when kind === 'pipe' via Schema.pipe?
        // Also bare .pipe( on a schema value (Effect Schema uses .pipe method)
        if (kind === "pipe") {
            const chainRe = /\.\s*pipe\s*\(/g;
            while ((m = chainRe.exec(cleaned))) {
                // Skip if already matched as Schema.pipe (
                const beforeDot = cleaned.slice(Math.max(0, m.index - 40), m.index);
                if (new RegExp(`(?:${pAlt})\\s*$`).test(beforeDot)) {
                    // This is Schema.pipe — already counted via prefRe
                    continue;
                }
                const before = cleaned.slice(Math.max(0, m.index - 200), m.index);
                let on;
                const assignMatches = [
                    ...before.matchAll(/(?:export\s+)?(?:const|let|var)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=/g),
                ];
                if (assignMatches.length) {
                    on = assignMatches[assignMatches.length - 1][1];
                }
                const info = { kind: "pipe" };
                if (on)
                    info.on = on;
                transforms.push(info);
            }
        }
    }
    return { transforms, count: transforms.length };
}
function countOccurrences(text, re) {
    let n = 0;
    const r = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    while (r.exec(text))
        n++;
    return n;
}
export function lintEffect(text) {
    const findings = [];
    const raw = text ?? "";
    if (!raw.trim()) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Source text is empty. Paste Effect Schema TS/JS (e.g. const Foo = Schema.Struct({ ... }) or import { Schema as S } from 'effect').",
        });
        return findings;
    }
    const cleaned = stripComments(raw);
    const prefixes = detectSchemaPrefixes(cleaned);
    const pAlt = prefixAlt(prefixes);
    const { schemas } = listSchemas(cleaned);
    const { fields } = listFields(cleaned);
    const { transforms } = listTransforms(cleaned);
    const hasEffect = new RegExp(`(?:${pAlt})\\s*\\.\\s*(?:Struct|String|Number|Boolean|Array|Union|optional|NullOr)\\b`).test(cleaned) ||
        /from\s+['"](?:effect|@effect\/schema)['"]/.test(cleaned);
    if (!hasEffect && schemas.length === 0) {
        findings.push({
            severity: "warn",
            rule: "no_effect_schema_detected",
            advice: "No `Schema.Struct` / `Schema.String` / `from 'effect'` patterns detected. Confirm this is Effect Schema source (Schema or S prefix).",
        });
    }
    const hasStruct = new RegExp(`(?:${pAlt})\\s*\\.\\s*Struct\\s*\\(`).test(cleaned);
    if (hasEffect && !hasStruct && schemas.every((s) => s.kind !== "Struct")) {
        findings.push({
            severity: "info",
            rule: "missing_struct",
            advice: "Effect Schema usage detected but no `Schema.Struct({ ... })` found. Object shapes usually use `Schema.Struct`; primitives alone may be intentional.",
        });
    }
    const anyCount = countOccurrences(cleaned, new RegExp(`(?:${pAlt})\\s*\\.\\s*Any\\b`, "g"));
    const unknownCount = countOccurrences(cleaned, new RegExp(`(?:${pAlt})\\s*\\.\\s*Unknown\\b`, "g"));
    if (anyCount + unknownCount >= 3) {
        findings.push({
            severity: "warn",
            rule: "any_unknown_overuse",
            advice: `Found ${anyCount}× Schema.Any and ${unknownCount}× Schema.Unknown. Prefer narrower schemas (Schema.String, Schema.Struct({...}), Schema.Union(...)) for safer parsing.`,
        });
    }
    else if (anyCount >= 1) {
        findings.push({
            severity: "info",
            rule: "schema_any_usage",
            advice: "`Schema.Any` detected — it accepts everything. Prefer `Schema.Unknown` plus narrowing, or a concrete schema.",
        });
    }
    // Branded tips: string/number id-like fields without brand
    const hasBrand = transforms.some((t) => t.kind === "brand");
    const idLike = fields.filter((f) => /^(id|.*Id|uuid|ulid)$/i.test(f.name));
    if (idLike.length >= 1 && !hasBrand) {
        findings.push({
            severity: "info",
            rule: "branded_id_tip",
            advice: `Field(s) looking like identifiers (${idLike
                .map((f) => f.name)
                .slice(0, 3)
                .join(", ")}) without Schema.brand. Consider \`Schema.String.pipe(Schema.brand("UserId"))\` for nominal typing.`,
        });
    }
    else if (hasBrand) {
        findings.push({
            severity: "info",
            rule: "brand_usage_ok",
            advice: "`Schema.brand` detected — good for nominal IDs. Keep encode/decode boundaries clear when crossing APIs.",
        });
    }
    // email/url plain String tip
    for (const f of fields) {
        const n = f.name.toLowerCase();
        if ((n === "email" || n.endsWith("email") || n === "emailaddress") &&
            (f.typeHint === "String" || f.typeHint === "NonEmptyString")) {
            findings.push({
                severity: "info",
                rule: "plain_email_string",
                advice: `Field "${f.name}" looks like an email but uses plain Schema.String. Consider a filter/pattern refinement or a dedicated email schema.`,
            });
            break;
        }
    }
    for (const f of fields) {
        const n = f.name.toLowerCase();
        if ((n === "url" || n === "website" || n === "href" || n.endsWith("url")) &&
            (f.typeHint === "String" || f.typeHint === "NonEmptyString")) {
            findings.push({
                severity: "info",
                rule: "plain_url_string",
                advice: `Field "${f.name}" looks like a URL but uses plain Schema.String. Consider Schema.filter / pattern refinements for URLs.`,
            });
            break;
        }
    }
    // optional vs NullOr tip confusion
    const hasOptional = transforms.some((t) => t.kind === "optional");
    const hasNullOr = transforms.some((t) => t.kind === "NullOr");
    if (hasOptional && hasNullOr) {
        findings.push({
            severity: "info",
            rule: "optional_vs_nullor_tip",
            advice: "Both `Schema.optional` and `Schema.NullOr` appear. optional ≈ key may be absent; NullOr ≈ value may be null. Prefer NullishOr when both null and undefined are allowed.",
        });
    }
    // Legacy @effect/schema package tip
    if (/from\s+['"]@effect\/schema['"]/.test(cleaned)) {
        findings.push({
            severity: "info",
            rule: "legacy_effect_schema_package",
            advice: "`@effect/schema` imports detected. Newer Effect versions export Schema from `effect` directly — consider consolidating imports.",
        });
    }
    if (schemas.length === 0 && hasEffect) {
        findings.push({
            severity: "info",
            rule: "inline_schemas_only",
            advice: "Effect Schema usage detected but no `const/let/var` (or `export const`) schema assignments matched. Inline `Schema.Struct({...})` may still appear in fields/transform hints.",
        });
    }
    if (fields.length === 0 && schemas.some((s) => s.kind === "Struct")) {
        findings.push({
            severity: "info",
            rule: "empty_struct_fields",
            advice: "`Schema.Struct(...)` assignments found but no object-literal keys parsed. Spreads, variables, or Class/TaggedStruct forms may not be visible to these heuristics.",
        });
    }
    return findings;
}
