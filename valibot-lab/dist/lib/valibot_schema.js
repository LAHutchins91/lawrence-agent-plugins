/**
 * Best-effort Valibot schema TS/JS text heuristics.
 * No valibot runtime, no network, no filesystem follow, no eval / no TS AST.
 */
/** Schema constructors commonly used with Valibot. */
const VB_KINDS = "object|array|string|number|boolean|bigint|date|blob|file|symbol|undefined|null|void|any|unknown|never|enum|picklist|literal|union|intersect|tuple|record|map|set|function|lazy|promise|optional|nullable|nullish|nonNullable|nonNullish|nonOptional|exactOptional|undefinedable|instance|class|special|custom|variant|looseObject|strictObject|objectWithRest|looseTuple|strictTuple|tupleWithRest";
/** Validation / transformation actions commonly used inside v.pipe. */
const VB_ACTIONS = [
    "minLength",
    "maxLength",
    "length",
    "minValue",
    "maxValue",
    "gtValue",
    "ltValue",
    "value",
    "notValue",
    "values",
    "notValues",
    "email",
    "url",
    "uuid",
    "ulid",
    "ipv4",
    "ipv6",
    "mac",
    "isoDate",
    "isoDateTime",
    "isoTime",
    "isoTimestamp",
    "isoWeek",
    "creditCard",
    "imei",
    "bic",
    "hexColor",
    "digits",
    "emoji",
    "hexadecimal",
    "base64",
    "mimeType",
    "regex",
    "includes",
    "excludes",
    "startsWith",
    "endsWith",
    "empty",
    "nonEmpty",
    "trim",
    "toTrimmed",
    "toLowerCase",
    "toUpperCase",
    "transform",
    "check",
    "forward",
    "partialCheck",
    "rawCheck",
    "rawTransform",
    "readonly",
    "brand",
    "description",
    "title",
    "metadata",
    "pipe",
    "fallback",
    "toMinValue",
    "toMaxValue",
    "integer",
    "safeInteger",
    "finite",
    "multipleOf",
    "bytes",
    "minBytes",
    "maxBytes",
    "minSize",
    "maxSize",
    "size",
    "entries",
    "minEntries",
    "maxEntries",
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
function hasValibotImport(cleaned) {
    return (/from\s+['"]valibot['"]/.test(cleaned) ||
        /require\s*\(\s*['"]valibot['"]\s*\)/.test(cleaned));
}
/** Named imports from 'valibot' — map local aliases. */
function namedValibotImports(cleaned) {
    const map = new Map();
    const re = /import\s*\{([^}]+)\}\s*from\s*['"]valibot['"]/g;
    let m;
    while ((m = re.exec(cleaned))) {
        const parts = m[1].split(",");
        for (const p of parts) {
            const piece = p.trim();
            if (!piece)
                continue;
            const asM = piece.match(/^([A-Za-z_][A-Za-z0-9_]*)\s+as\s+([A-Za-z_][A-Za-z0-9_]*)$/);
            if (asM) {
                map.set(asM[2], asM[1]);
            }
            else {
                const id = piece.match(/^([A-Za-z_][A-Za-z0-9_]*)$/);
                if (id)
                    map.set(id[1], id[1]);
            }
        }
    }
    return map;
}
/**
 * List Valibot schemas from `const Foo = v.object` / named imports / export const.
 */
export function listSchemas(text) {
    const cleaned = stripComments(text ?? "");
    const schemas = [];
    const seen = new Set();
    // Prefixed: const Foo = v.object( / v.pipe(
    const assignRe = new RegExp(`(?:export\\s+)?(?:const|let|var)\\s+([A-Za-z_][A-Za-z0-9_]*)\\s*=\\s*v\\s*\\.\\s*(${VB_KINDS}|pipe)\\s*(?:\\(|$)`, "g");
    let m;
    while ((m = assignRe.exec(cleaned))) {
        const name = m[1];
        const kind = m[2];
        if (seen.has(name))
            continue;
        seen.add(name);
        schemas.push({ name, kind });
    }
    // Named imports: const Foo = object( / pipe(
    const named = namedValibotImports(cleaned);
    if (named.size > 0) {
        for (const [kindLocal, orig] of named.entries()) {
            if (!new RegExp(`^(?:${VB_KINDS}|pipe)$`).test(orig))
                continue;
            const re = new RegExp(`(?:export\\s+)?(?:const|let|var)\\s+([A-Za-z_][A-Za-z0-9_]*)\\s*=\\s*${kindLocal}\\s*\\(`, "g");
            while ((m = re.exec(cleaned))) {
                const name = m[1];
                if (seen.has(name))
                    continue;
                seen.add(name);
                schemas.push({ name, kind: orig });
            }
        }
    }
    return { schemas, count: schemas.length };
}
/**
 * Extract v.pipe(...) / pipe(...) chains with step names.
 */
export function listPipes(text) {
    const cleaned = stripComments(text ?? "");
    const pipes = [];
    const named = namedValibotImports(cleaned);
    const pipeLocals = new Set(["pipe"]);
    for (const [local, orig] of named) {
        if (orig === "pipe")
            pipeLocals.add(local);
    }
    // Match v.pipe( and bare pipe( (when imported)
    const patterns = [/\bv\s*\.\s*pipe\s*\(/g];
    for (const loc of pipeLocals) {
        if (loc === "pipe" && !named.has("pipe") && !hasValibotImport(cleaned)) {
            // still allow v.pipe; bare pipe only if imported
            continue;
        }
        if (loc !== "pipe" || named.has("pipe")) {
            patterns.push(new RegExp(`\\b${loc}\\s*\\(`, "g"));
        }
    }
    // Always try bare pipe if named import present or namespace import
    if (named.has("pipe") || hasValibotImport(cleaned)) {
        patterns.push(/\bpipe\s*\(/g);
    }
    const seenSpans = new Set();
    for (const re of patterns) {
        let m;
        while ((m = re.exec(cleaned))) {
            // Skip if this is actually v.pipe already counted via another pattern —
            // for bare pipe, avoid matching the "pipe" inside "v.pipe"
            if (!m[0].includes(".") && m.index > 0) {
                const prev = cleaned[m.index - 1];
                if (prev === ".")
                    continue;
            }
            const openParen = m.index + m[0].length - 1;
            const closeParen = findMatchingParen(cleaned, openParen);
            if (closeParen < 0)
                continue;
            const spanKey = `${openParen}:${closeParen}`;
            if (seenSpans.has(spanKey))
                continue;
            seenSpans.add(spanKey);
            const args = cleaned.slice(openParen + 1, closeParen);
            const parts = splitTopLevelCommas(args);
            const steps = [];
            for (const p of parts) {
                const step = summarizePipeStep(p, named);
                if (step)
                    steps.push(step);
            }
            // Look backward for assignment name
            const before = cleaned.slice(Math.max(0, m.index - 120), m.index);
            const nameM = before.match(/(?:export\s+)?(?:const|let|var)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*$/);
            const info = { steps };
            if (nameM)
                info.on = nameM[1];
            pipes.push(info);
        }
    }
    return { pipes, count: pipes.length };
}
function summarizePipeStep(part, named) {
    const p = part.trim();
    if (!p)
        return undefined;
    // v.string() / v.email() / v.minLength(1)
    const vCall = p.match(/^v\s*\.\s*([A-Za-z_][A-Za-z0-9_]*)\s*(?:\(|$)/);
    if (vCall)
        return vCall[1];
    // Bare named: string() / email() / minLength(5)
    const bare = p.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*(?:\(|$)/);
    if (bare) {
        const local = bare[1];
        if (named.has(local))
            return named.get(local);
        // Heuristic: known kind or action name
        if (new RegExp(`^(?:${VB_KINDS})$`).test(local) ||
            VB_ACTIONS.includes(local)) {
            return local;
        }
        return local;
    }
    // Nested pipe
    if (/^v\s*\.\s*pipe\s*\(/.test(p) || /^pipe\s*\(/.test(p))
        return "pipe";
    return undefined;
}
/**
 * Count Valibot action calls like v.minLength, v.email, v.transform, etc.
 */
export function listActions(text) {
    const cleaned = stripComments(text ?? "");
    const named = namedValibotImports(cleaned);
    const counts = new Map();
    for (const action of VB_ACTIONS) {
        // skip "pipe" as schema construct — still count v.pipe? User listed transform, check, forward etc.
        // We'll count pipe separately only if used as action-like; include it.
        let n = 0;
        const vRe = new RegExp(`\\bv\\s*\\.\\s*${action}\\s*\\(`, "g");
        n += countOccurrences(cleaned, vRe);
        // Named import alias
        for (const [local, orig] of named) {
            if (orig !== action)
                continue;
            const re = new RegExp(`\\b${local}\\s*\\(`, "g");
            let m;
            while ((m = re.exec(cleaned))) {
                if (m.index > 0 && cleaned[m.index - 1] === ".")
                    continue;
                n++;
            }
        }
        // Bare action name when imported from valibot (or same name present in named map)
        if (named.has(action) || (hasValibotImport(cleaned) && named.size > 0 && [...named.values()].includes(action))) {
            // already counted via alias loop if local===action
            if (!named.has(action) && [...named.values()].includes(action)) {
                // aliased only — already counted
            }
        }
        else if (named.size === 0 && hasValibotImport(cleaned)) {
            // namespace-only import: only v.action counted
        }
        if (n > 0)
            counts.set(action, n);
    }
    const actions = [...counts.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    const total = actions.reduce((s, a) => s + a.count, 0);
    return { actions, total };
}
function countOccurrences(text, re) {
    let n = 0;
    const r = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    while (r.exec(text))
        n++;
    return n;
}
export function lintValibot(text) {
    const findings = [];
    const raw = text ?? "";
    if (!raw.trim()) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Source text is empty. Paste Valibot schema TS/JS (e.g. const Foo = v.object({ ... }) or v.pipe(v.string(), v.email())).",
        });
        return findings;
    }
    const cleaned = stripComments(raw);
    const { schemas } = listSchemas(cleaned);
    const { pipes } = listPipes(cleaned);
    const { actions, total: actionTotal } = listActions(cleaned);
    const hasVb = /\bv\s*\.\s*(?:object|array|string|number|boolean|pipe|union|optional)\b/.test(cleaned) || /from\s+['"]valibot['"]/.test(cleaned);
    if (!hasVb && schemas.length === 0) {
        findings.push({
            severity: "warn",
            rule: "no_valibot_detected",
            advice: "No `v.object` / `v.string` / `v.pipe` / `from 'valibot'` patterns detected. Confirm this is Valibot schema source.",
        });
    }
    const anyCount = countOccurrences(cleaned, /\bv\s*\.\s*any\s*\(/g);
    const unknownCount = countOccurrences(cleaned, /\bv\s*\.\s*unknown\s*\(/g);
    // Also bare any()/unknown() when named-imported
    const named = namedValibotImports(cleaned);
    let bareAny = 0;
    let bareUnknown = 0;
    if (named.has("any") || [...named.values()].includes("any")) {
        const loc = [...named.entries()].find(([, o]) => o === "any")?.[0] ?? "any";
        bareAny = countBareCalls(cleaned, loc);
    }
    if (named.has("unknown") || [...named.values()].includes("unknown")) {
        const loc = [...named.entries()].find(([, o]) => o === "unknown")?.[0] ?? "unknown";
        bareUnknown = countBareCalls(cleaned, loc);
    }
    const anyTotal = anyCount + bareAny;
    const unknownTotal = unknownCount + bareUnknown;
    if (anyTotal + unknownTotal >= 3) {
        findings.push({
            severity: "warn",
            rule: "any_unknown_overuse",
            advice: `Found ${anyTotal}× any() and ${unknownTotal}× unknown(). Prefer narrower schemas (v.string(), v.object({...}), v.union([...])) for safer parsing.`,
        });
    }
    else if (anyTotal >= 1) {
        findings.push({
            severity: "info",
            rule: "v_any_usage",
            advice: "`v.any()` / `any()` detected — it accepts everything. Prefer `v.unknown()` plus narrowing, or a concrete schema.",
        });
    }
    // Missing pipe tip: validations as second-arg arrays (legacy) or string() followed by email-looking field without pipe
    // Legacy: v.string([v.email()]) — array of actions as method args (Valibot <0.31 style)
    if (/\bv\s*\.\s*(?:string|number|boolean|array|object)\s*\(\s*\[/.test(cleaned)) {
        findings.push({
            severity: "warn",
            rule: "deprecated_action_array_args",
            advice: "Schema constructors with an action array argument (e.g. `v.string([v.email()])`) are legacy. Prefer `v.pipe(v.string(), v.email())` (Valibot ≥0.31).",
        });
    }
    // Tip: validations present as sibling calls without pipe — e.g. many actions but zero pipes
    if (actionTotal >= 2 && pipes.length === 0 && !/\bv\s*\.\s*pipe\s*\(/.test(cleaned)) {
        // Only tip if actions that typically need pipe are used (email, minLength, etc.)
        const pipeNeeding = actions.filter((a) => [
            "email",
            "url",
            "uuid",
            "regex",
            "minLength",
            "maxLength",
            "minValue",
            "maxValue",
            "transform",
            "check",
            "forward",
            "toTrimmed",
            "toLowerCase",
            "toUpperCase",
        ].includes(a.name));
        if (pipeNeeding.length >= 1) {
            findings.push({
                severity: "info",
                rule: "missing_pipe_for_validations",
                advice: "Validation/transform actions detected without `v.pipe(...)`. In modern Valibot, compose with `v.pipe(v.string(), v.email(), v.minLength(1))` rather than chaining like Zod.",
            });
        }
    }
    // email/url field names with plain v.string() and no pipe/email nearby
    if (/\b(?:email|emailAddress)\s*:\s*v\s*\.\s*string\s*\(\s*\)/.test(cleaned) &&
        !/\bv\s*\.\s*email\s*\(/.test(cleaned) &&
        !pipes.some((p) => p.steps.includes("email"))) {
        findings.push({
            severity: "info",
            rule: "missing_email_action",
            advice: 'Field looking like "email" uses plain `v.string()`. Prefer `v.pipe(v.string(), v.email())`.',
        });
    }
    if (/\b(?:url|website|href)\s*:\s*v\s*\.\s*string\s*\(\s*\)/.test(cleaned) &&
        !/\bv\s*\.\s*url\s*\(/.test(cleaned) &&
        !pipes.some((p) => p.steps.includes("url"))) {
        findings.push({
            severity: "info",
            rule: "missing_url_action",
            advice: 'Field looking like a URL uses plain `v.string()`. Prefer `v.pipe(v.string(), v.url())`.',
        });
    }
    // Deprecated: coerce helpers moved; some old names
    if (/\bv\s*\.\s*coerce\b/.test(cleaned)) {
        findings.push({
            severity: "info",
            rule: "deprecated_coerce_tip",
            advice: "`v.coerce` is not the Valibot idiom — use typed schemas plus `v.pipe` / `v.transform` (or dedicated parsers) instead of Zod-style coerce.",
        });
    }
    if (/\bv\s*\.\s*nativeEnum\s*\(/.test(cleaned)) {
        findings.push({
            severity: "info",
            rule: "native_enum_tip",
            advice: "`v.nativeEnum` is uncommon in Valibot — prefer `v.picklist([...])` or `v.enum_(...)` / enum schemas for string unions.",
        });
    }
    if (schemas.length === 0 && hasVb) {
        findings.push({
            severity: "info",
            rule: "inline_schemas_only",
            advice: "Valibot usage detected but no `const/let/var` (or `export const`) schema assignments matched. Inline `v.object({...})` / `v.pipe(...)` may still appear in pipe/action hints.",
        });
    }
    if (schemas.some((s) => s.kind === "object") &&
        pipes.length === 0 &&
        actionTotal === 0) {
        findings.push({
            severity: "info",
            rule: "objects_without_pipes",
            advice: "`v.object` assignments found with no `v.pipe` / actions in this snippet. Add `v.pipe` for per-field validations (email, minLength, etc.) when needed.",
        });
    }
    return findings;
}
function countBareCalls(cleaned, name) {
    let n = 0;
    const re = new RegExp(`\\b${name}\\s*\\(`, "g");
    let m;
    while ((m = re.exec(cleaned))) {
        if (m.index > 0 && cleaned[m.index - 1] === ".")
            continue;
        n++;
    }
    return n;
}
