/**
 * Best-effort fast-check JS/TS text heuristics.
 * No fast-check runtime, no network, no filesystem follow, no eval / no TS AST.
 */
/** Common fast-check arbitrary constructors. */
const FC_KINDS = "string|stringOf|hexaString|base64String|asciiString|fullUnicodeString|unicodeString|char16string|char|hexa|base64|ascii|fullUnicode|unicode|integer|nat|maxSafeInteger|maxSafeNat|bigInt|bigUint|bigIntN|bigUintN|double|float|boolean|falsy|constant|constantFrom|oneof|option|nullable|tuple|array|uniqueArray|dictionary|record|object|anything|json|jsonValue|unicodeJson|unicodeJsonValue|func|compareFunc|date|context|cloned|mapToConstant|webUrl|webAuthority|webFragments|webQueryParameters|webPath|webPathSegments|domain|emailAddress|ipV4|ipV4Extended|ipV6|uuid|uuidV|ulid|lorem|subarray|shuffledSubarray|infiniteStream|scheduler|gen|letrec|memo|commands|asyncModelRun|modelRun|property|asyncProperty|assert|check|sample|statistics|pre|sparseArray";
/** Constraint keys commonly passed as option objects to arbitraries / assert. */
const CONSTRAINT_KEYS = [
    "minLength",
    "maxLength",
    "min",
    "max",
    "size",
    "numRuns",
    "seed",
    "path",
    "endOnFailure",
    "verbose",
    "timeout",
    "interruptAfterTimeLimit",
    "skipAllAfterTimeLimit",
    "markInterruptAsFailure",
    "unbiased",
    "withCrossShrink",
    "noShrink",
    "depthIdentifier",
    "maxGeneratedTokens",
    "unit",
    "noDefaultInfinity",
    "noNaN",
    "minLength",
    "maxDepth",
    "depthSize",
    "withDeletedKeys",
    "requiredKeys",
    "nil",
    "freq",
    "maxLength",
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
 * Detect fc namespace prefixes and named imports from fast-check.
 * Returns { ns: string[] (e.g. 'fc'), named: Map<localName, kind> }
 */
export function detectFcImports(cleaned) {
    const ns = new Set();
    const named = new Map();
    // import * as fc from 'fast-check'
    const starRe = /import\s*\*\s*as\s+([A-Za-z_][A-Za-z0-9_]*)\s*from\s*['"]fast-check(?:\/[^'"]*)?['"]/g;
    let m;
    while ((m = starRe.exec(cleaned))) {
        ns.add(m[1]);
    }
    // import fc from 'fast-check' (default — uncommon but seen)
    const defRe = /import\s+([A-Za-z_][A-Za-z0-9_]*)\s+from\s*['"]fast-check(?:\/[^'"]*)?['"]/g;
    while ((m = defRe.exec(cleaned))) {
        ns.add(m[1]);
    }
    // import { string, integer as int, assert } from 'fast-check'
    const namedImportRe = /import\s*\{([^}]+)\}\s*from\s*['"]fast-check(?:\/[^'"]*)?['"]/g;
    while ((m = namedImportRe.exec(cleaned))) {
        const parts = m[1].split(",");
        for (const part of parts) {
            const p = part.trim();
            if (!p)
                continue;
            const asM = p.match(/^([A-Za-z_][A-Za-z0-9_]*)\s+as\s+([A-Za-z_][A-Za-z0-9_]*)$/);
            if (asM) {
                named.set(asM[2], asM[1]);
                continue;
            }
            const plain = p.match(/^([A-Za-z_][A-Za-z0-9_]*)$/);
            if (plain)
                named.set(plain[1], plain[1]);
        }
    }
    // Heuristic fallback: fc.string / fc.integer / fc.assert appear
    if (/\bfc\s*\.\s*(?:string|integer|array|record|property|assert|oneof|tuple|constant)\b/.test(cleaned)) {
        ns.add("fc");
    }
    if (ns.size === 0 && named.size === 0) {
        ns.add("fc");
    }
    return { ns: [...ns], named };
}
function nsAlt(ns) {
    return ns.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
}
/**
 * List arbitrary assignments: const fooArb = fc.string() / fc.integer() etc.
 * Also covers named imports: const x = string() when string was imported.
 */
export function listArbs(text) {
    const cleaned = stripComments(text ?? "");
    const arbs = [];
    const seen = new Set();
    const { ns, named } = detectFcImports(cleaned);
    const nAlt = nsAlt(ns);
    // const Name = fc.kind(...)
    if (nAlt) {
        const assignRe = new RegExp(`(?:export\\s+)?(?:const|let|var)\\s+([A-Za-z_][A-Za-z0-9_]*)\\s*=\\s*(?:${nAlt})\\s*\\.\\s*(${FC_KINDS})\\b`, "g");
        let m;
        while ((m = assignRe.exec(cleaned))) {
            const name = m[1];
            const kind = m[2];
            // skip property/assert/check/sample — those are not arbs
            if (/^(property|asyncProperty|assert|check|sample|statistics|pre|commands|asyncModelRun|modelRun)$/.test(kind)) {
                continue;
            }
            if (seen.has(name))
                continue;
            seen.add(name);
            arbs.push({ name, kind });
        }
    }
    // Named import usage: const Name = string(...) / integer(...) when imported
    for (const [local, kind] of named) {
        if (/^(property|asyncProperty|assert|check|sample|statistics|pre|commands|asyncModelRun|modelRun)$/.test(kind)) {
            continue;
        }
        const re = new RegExp(`(?:export\\s+)?(?:const|let|var)\\s+([A-Za-z_][A-Za-z0-9_]*)\\s*=\\s*${local.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*(?:\\(|$)`, "g");
        let m;
        while ((m = re.exec(cleaned))) {
            const name = m[1];
            if (seen.has(name))
                continue;
            seen.add(name);
            arbs.push({ name, kind });
        }
    }
    return { arbs, count: arbs.length };
}
/**
 * Detect fc.property / fc.asyncProperty / fc.assert(fc.property(...)) patterns.
 */
export function listProps(text) {
    const cleaned = stripComments(text ?? "");
    const properties = [];
    const { ns, named } = detectFcImports(cleaned);
    const nAlt = nsAlt(ns.length ? ns : ["fc"]);
    // Track assert( wrappers so we can mark assert: true
    const assertSpans = [];
    // fc.assert( ... ) and named assert( ... )
    const assertCallers = [];
    if (nAlt) {
        assertCallers.push(`(?:${nAlt})\\s*\\.\\s*assert`);
    }
    for (const [local, kind] of named) {
        if (kind === "assert")
            assertCallers.push(local.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    }
    for (const ac of assertCallers) {
        const re = new RegExp(`${ac}\\s*\\(`, "g");
        let m;
        while ((m = re.exec(cleaned))) {
            const open = m.index + m[0].length - 1;
            const close = findMatchingParen(cleaned, open);
            if (close < 0)
                continue;
            assertSpans.push({ start: open, end: close });
        }
    }
    function insideAssert(idx) {
        return assertSpans.some((s) => idx >= s.start && idx <= s.end);
    }
    const hits = [];
    const propKinds = [
        { kind: "property", async: false },
        { kind: "asyncProperty", async: true },
    ];
    for (const { kind, async: isAsync } of propKinds) {
        if (nAlt) {
            const re = new RegExp(`(?:${nAlt})\\s*\\.\\s*${kind}\\s*\\(`, "g");
            let m;
            while ((m = re.exec(cleaned))) {
                const before = cleaned.slice(Math.max(0, m.index - 120), m.index);
                const nameM = before.match(/(?:export\s+)?(?:const|let|var)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*$/);
                hits.push({
                    index: m.index,
                    async: isAsync,
                    assignName: nameM?.[1],
                });
            }
        }
        for (const [local, orig] of named) {
            if (orig !== kind)
                continue;
            const re = new RegExp(`\\b${local.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\(`, "g");
            let m;
            while ((m = re.exec(cleaned))) {
                const before = cleaned.slice(Math.max(0, m.index - 120), m.index);
                const nameM = before.match(/(?:export\s+)?(?:const|let|var)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*$/);
                hits.push({
                    index: m.index,
                    async: isAsync,
                    assignName: nameM?.[1],
                });
            }
        }
    }
    // Also catch bare fc.assert without nested property visible? We'll still emit
    // properties from property/asyncProperty hits.
    const seenKeys = new Set();
    for (const h of hits) {
        const info = {};
        if (h.assignName)
            info.name = h.assignName;
        if (h.async)
            info.async = true;
        if (insideAssert(h.index))
            info.assert = true;
        const key = `${info.name ?? ""}@${h.index}:${info.async}:${info.assert}`;
        if (seenKeys.has(key))
            continue;
        seenKeys.add(key);
        properties.push(info);
    }
    // Assert calls that wrap something but property wasn't matched inside —
    // still surface as assert-only entries if assertSpans exist with no property hit inside
    for (const span of assertSpans) {
        const hasProp = hits.some((h) => h.index >= span.start && h.index <= span.end);
        if (!hasProp) {
            // Look for property text inside the assert args as a fallback
            const inner = cleaned.slice(span.start, span.end);
            const hasPropText = /\.(?:property|asyncProperty)\s*\(/.test(inner) ||
                /\b(?:property|asyncProperty)\s*\(/.test(inner);
            const isAsync = /asyncProperty\s*\(/.test(inner);
            const info = { assert: true };
            if (isAsync)
                info.async = true;
            // Try to find assignment name before assert
            const before = cleaned.slice(Math.max(0, span.start - 200), span.start);
            const nameM = before.match(/(?:export\s+)?(?:const|let|var)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(?:[A-Za-z_][A-Za-z0-9_]*\s*\.\s*)?assert\s*$/);
            // Actually assert is usually a call statement, not assigned. Skip name.
            void nameM;
            void hasPropText;
            const key = `assert@${span.start}:${isAsync}`;
            if (!seenKeys.has(key)) {
                seenKeys.add(key);
                // Only add if we didn't already capture a property inside — we know hasProp is false
                // Prefer not to add empty assert-only if there's no property text either —
                // but user wants assert detection. Add with assert:true.
                properties.push(info);
            }
        }
    }
    return { properties, count: properties.length };
}
/**
 * Options objects passed to arbitraries / assert — extract constraint keys.
 */
export function listConstraints(text) {
    const cleaned = stripComments(text ?? "");
    const constraints = [];
    const { ns, named } = detectFcImports(cleaned);
    const nAlt = nsAlt(ns.length ? ns : ["fc"]);
    const keySet = new Set([
        "minLength",
        "maxLength",
        "min",
        "max",
        "size",
        "numRuns",
        "seed",
        "path",
        "endOnFailure",
        "verbose",
        "timeout",
        "interruptAfterTimeLimit",
        "skipAllAfterTimeLimit",
        "markInterruptAsFailure",
        "unbiased",
        "withCrossShrink",
        "noShrink",
        "depthIdentifier",
        "maxGeneratedTokens",
        "unit",
        "noDefaultInfinity",
        "noNaN",
        "maxDepth",
        "depthSize",
        "withDeletedKeys",
        "requiredKeys",
        "nil",
        "freq",
        "withBias",
        "noInteger",
        "maxLength",
    ]);
    void CONSTRAINT_KEYS;
    // Match fc.kind( ... { opts } ) and collect object literals that look like constraints
    const callSites = [];
    if (nAlt) {
        const re = new RegExp(`(?:${nAlt})\\s*\\.\\s*([A-Za-z_][A-Za-z0-9_]*)\\s*\\(`, "g");
        let m;
        while ((m = re.exec(cleaned))) {
            const kind = m[1];
            const open = m.index + m[0].length - 1;
            const close = findMatchingParen(cleaned, open);
            if (close < 0)
                continue;
            const before = cleaned.slice(Math.max(0, m.index - 120), m.index);
            const nameM = before.match(/(?:export\s+)?(?:const|let|var)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*$/);
            callSites.push({
                on: nameM?.[1] ?? kind,
                argsStart: open + 1,
                argsEnd: close,
            });
        }
    }
    for (const [local, kind] of named) {
        const re = new RegExp(`\\b${local.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\(`, "g");
        let m;
        while ((m = re.exec(cleaned))) {
            const open = m.index + m[0].length - 1;
            const close = findMatchingParen(cleaned, open);
            if (close < 0)
                continue;
            const before = cleaned.slice(Math.max(0, m.index - 120), m.index);
            const nameM = before.match(/(?:export\s+)?(?:const|let|var)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*$/);
            callSites.push({
                on: nameM?.[1] ?? kind,
                argsStart: open + 1,
                argsEnd: close,
            });
        }
    }
    const seen = new Set();
    for (const site of callSites) {
        const args = cleaned.slice(site.argsStart, site.argsEnd);
        // Find object literals in args
        for (let i = 0; i < args.length; i++) {
            if (args[i] !== "{")
                continue;
            // skip if inside a string roughly — findMatchingBrace handles strings
            const end = findMatchingBrace(args, i);
            if (end < 0)
                continue;
            const body = args.slice(i + 1, end);
            const entries = splitTopLevelCommas(body);
            const keys = [];
            for (const entry of entries) {
                const km = entry.match(/^(?:([A-Za-z_][A-Za-z0-9_]*)|['"`]([^'"`]+)['"`])\s*:/);
                if (!km)
                    continue;
                const k = (km[1] || km[2]);
                if (keySet.has(k))
                    keys.push(k);
            }
            if (keys.length === 0) {
                i = end;
                continue;
            }
            const uniq = [...new Set(keys)];
            const sig = `${site.on ?? ""}::${uniq.join(",")}`;
            if (!seen.has(sig)) {
                seen.add(sig);
                const info = { keys: uniq };
                if (site.on)
                    info.on = site.on;
                constraints.push(info);
            }
            i = end;
        }
    }
    return { constraints, count: constraints.length };
}
function countOccurrences(text, re) {
    let n = 0;
    const r = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    while (r.exec(text))
        n++;
    return n;
}
export function lintFastCheck(text) {
    const findings = [];
    const raw = text ?? "";
    if (!raw.trim()) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Source text is empty. Paste fast-check JS/TS (e.g. const arb = fc.string() or fc.assert(fc.property(...))).",
        });
        return findings;
    }
    const cleaned = stripComments(raw);
    const { ns, named } = detectFcImports(cleaned);
    const nAlt = nsAlt(ns.length ? ns : ["fc"]);
    const { arbs } = listArbs(cleaned);
    const { properties } = listProps(cleaned);
    const { constraints } = listConstraints(cleaned);
    const hasFc = new RegExp(`(?:${nAlt})\\s*\\.\\s*(?:string|integer|array|record|property|assert|oneof|tuple|constant|boolean|nat)\\b`).test(cleaned) ||
        /from\s+['"]fast-check(?:\/[^'"]*)?['"]/.test(cleaned) ||
        named.size > 0;
    if (!hasFc && arbs.length === 0 && properties.length === 0) {
        findings.push({
            severity: "warn",
            rule: "no_fast_check_detected",
            advice: "No `fc.string` / `fc.property` / `from 'fast-check'` patterns detected. Confirm this is fast-check source (`import * as fc from 'fast-check'` or named imports).",
        });
    }
    // Assert without property
    const assertCount = countOccurrences(cleaned, new RegExp(`(?:${nAlt})\\s*\\.\\s*assert\\s*\\(`, "g"));
    let namedAssert = 0;
    for (const [local, kind] of named) {
        if (kind === "assert") {
            namedAssert += countOccurrences(cleaned, new RegExp(`\\b${local.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\(`, "g"));
        }
    }
    const totalAssert = assertCount + namedAssert;
    const propCount = properties.filter((p) => p.assert || p.name || p.async !== undefined).length;
    const hasPropertyCall = new RegExp(`(?:${nAlt})\\s*\\.\\s*(?:async)?property\\s*\\(`).test(cleaned) ||
        [...named.entries()].some(([local, kind]) => (kind === "property" || kind === "asyncProperty") &&
            new RegExp(`\\b${local.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\(`).test(cleaned));
    if (totalAssert >= 1 && !hasPropertyCall && properties.every((p) => !p.assert || !hasPropertyCall)) {
        // More precise: assert present but no property/asyncProperty anywhere
        if (!hasPropertyCall) {
            findings.push({
                severity: "warn",
                rule: "assert_without_property",
                advice: "`fc.assert(...)` found but no `fc.property` / `fc.asyncProperty` call detected. Assert usually wraps a property: `fc.assert(fc.property(arb, (v) => { ... }))`.",
            });
        }
    }
    void propCount;
    // Missing seed tip when assert exists without seed in constraints
    const hasSeed = constraints.some((c) => c.keys.includes("seed")) || /\bseed\s*:/.test(cleaned);
    if (totalAssert >= 1 && !hasSeed) {
        findings.push({
            severity: "info",
            rule: "missing_seed_tip",
            advice: "`fc.assert` without an explicit `seed` in parameters. For reproducible failures, pass `{ seed: <n> }` (and `path` from the counterexample) to replay.",
        });
    }
    // Unbounded integer tip: fc.integer() with no min/max
    const intBare = countOccurrences(cleaned, new RegExp(`(?:${nAlt})\\s*\\.\\s*integer\\s*\\(\\s*\\)`, "g"));
    // Also integer({ ... }) without min/max
    const intCallRe = new RegExp(`(?:${nAlt})\\s*\\.\\s*integer\\s*\\(`, "g");
    let unboundedInts = intBare;
    let im;
    while ((im = intCallRe.exec(cleaned))) {
        const open = im.index + im[0].length - 1;
        const close = findMatchingParen(cleaned, open);
        if (close < 0)
            continue;
        const args = cleaned.slice(open + 1, close).trim();
        if (!args)
            continue; // already counted as bare
        // positional fc.integer(min, max) is bounded
        if (/^-?\d/.test(args) || /^-?0x/.test(args))
            continue;
        if (/\{/.test(args) && !/\bmin\s*:/.test(args) && !/\bmax\s*:/.test(args)) {
            unboundedInts++;
        }
    }
    // named integer()
    for (const [local, kind] of named) {
        if (kind !== "integer")
            continue;
        const re = new RegExp(`\\b${local.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\(\\s*\\)`, "g");
        unboundedInts += countOccurrences(cleaned, re);
    }
    if (unboundedInts >= 1) {
        findings.push({
            severity: "info",
            rule: "unbounded_integer_tip",
            advice: `Found ${unboundedInts}× \`fc.integer()\` without \`min\`/\`max\`. Prefer \`fc.integer({ min, max })\` (or positional min/max) to keep generation in a useful range and speed shrinking.`,
        });
    }
    // Unbounded string tip
    const stringBare = countOccurrences(cleaned, new RegExp(`(?:${nAlt})\\s*\\.\\s*string\\s*\\(\\s*\\)`, "g"));
    if (stringBare >= 2) {
        findings.push({
            severity: "info",
            rule: "unbounded_string_tip",
            advice: `Found ${stringBare}× bare \`fc.string()\`. Consider \`fc.string({ minLength, maxLength })\` (or \`size\`) to bound length for faster runs.`,
        });
    }
    // anything / object overuse
    const anythingCount = countOccurrences(cleaned, new RegExp(`(?:${nAlt})\\s*\\.\\s*(?:anything|object)\\s*\\(`, "g"));
    if (anythingCount >= 2) {
        findings.push({
            severity: "warn",
            rule: "anything_object_overuse",
            advice: `Found ${anythingCount}× \`fc.anything\` / \`fc.object\`. Prefer narrower arbitraries (\`fc.record\`, \`fc.oneof\`, \`fc.string\`) for clearer failures and faster shrinking.`,
        });
    }
    // property without assert
    if (hasPropertyCall && totalAssert === 0) {
        findings.push({
            severity: "info",
            rule: "property_without_assert",
            advice: "`fc.property` / `fc.asyncProperty` found without `fc.assert`. Remember to run properties via `fc.assert(prop)` (or your test runner's equivalent) so failures are reported.",
        });
    }
    // Missing numRuns tip
    const hasNumRuns = constraints.some((c) => c.keys.includes("numRuns")) || /\bnumRuns\s*:/.test(cleaned);
    if (totalAssert >= 1 && !hasNumRuns) {
        findings.push({
            severity: "info",
            rule: "missing_numruns_tip",
            advice: "`fc.assert` without explicit `numRuns`. Default run count may be fine; raise `numRuns` for stronger confidence or lower it for faster CI smoke tests.",
        });
    }
    if (arbs.length === 0 && hasFc && !hasPropertyCall) {
        findings.push({
            severity: "info",
            rule: "inline_arbs_only",
            advice: "fast-check usage detected but no `const/let/var` arbitrary assignments matched. Inline `fc.string()` inside `fc.property(...)` may still appear in other hints.",
        });
    }
    return findings;
}
