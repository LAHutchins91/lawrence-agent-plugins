/**
 * Best-effort testdouble.js JS/TS text heuristics.
 * No testdouble runtime, no network, no filesystem follow, no eval / no TS AST.
 */
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
function assignNameBefore(cleaned, index) {
    const before = cleaned.slice(Math.max(0, index - 160), index);
    const m = before.match(/(?:export\s+)?(?:const|let|var)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*$/);
    return m?.[1];
}
function countOccurrences(text, re) {
    let n = 0;
    const r = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    while (r.exec(text))
        n++;
    return n;
}
function firstStringArg(args) {
    const trimmed = args.trim();
    if (!trimmed)
        return undefined;
    const c = trimmed[0];
    if (c !== "'" && c !== '"' && c !== "`")
        return undefined;
    let i = 1;
    let out = "";
    while (i < trimmed.length) {
        const ch = trimmed[i];
        if (ch === "\\" && i + 1 < trimmed.length) {
            out += trimmed[i + 1];
            i += 2;
            continue;
        }
        if (ch === c)
            return out;
        out += ch;
        i++;
    }
    return out;
}
/** Compact a call-expression slice for display (collapse whitespace). */
function compactCall(s, max = 80) {
    const c = s.replace(/\s+/g, " ").trim();
    if (c.length <= max)
        return c;
    return c.slice(0, max - 1) + "…";
}
/**
 * Detect td / testdouble identifiers from imports and heuristics.
 */
export function detectTdImports(cleaned) {
    const td = new Set();
    // import * as td from 'testdouble'
    const starRe = /import\s*\*\s*as\s+([A-Za-z_][A-Za-z0-9_]*)\s*from\s*['"]testdouble(?:\/[^'"]*)?['"]/g;
    let m;
    while ((m = starRe.exec(cleaned)))
        td.add(m[1]);
    // import td from 'testdouble'
    const defRe = /import\s+([A-Za-z_][A-Za-z0-9_]*)\s+from\s*['"]testdouble(?:\/[^'"]*)?['"]/g;
    while ((m = defRe.exec(cleaned)))
        td.add(m[1]);
    // import { replace, when, verify, ... } from 'testdouble' — mark presence via 'td' heuristic later
    // named imports don't create a td ns; bare calls handled separately
    // require
    const reqRe = /(?:const|let|var)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*require\s*\(\s*['"]testdouble['"]\s*\)/g;
    while ((m = reqRe.exec(cleaned)))
        td.add(m[1]);
    // Heuristic fallback
    if (/\btd\s*\.\s*(?:replace|replaceEsm|when|verify|function|object|constructor|reset)\b/.test(cleaned)) {
        td.add("td");
    }
    return { td: [...td] };
}
function nsAlt(ns) {
    return ns
        .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|");
}
/**
 * List replacements from td.replace( / td.replaceEsm(
 */
export function listReplacements(text) {
    const cleaned = stripComments(text ?? "");
    const replacements = [];
    const seen = new Set();
    const imports = detectTdImports(cleaned);
    const push = (info, index) => {
        const key = `${info.module ?? ""}|${info.name ?? ""}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        replacements.push(info);
    };
    const hosts = new Set([...imports.td, "td"]);
    const alt = nsAlt([...hosts]);
    if (!alt)
        return { replacements, count: 0 };
    const re = new RegExp(`(?:${alt})\\s*\\.\\s*(?:replaceEsm|replace)\\s*\\(`, "g");
    let m;
    while ((m = re.exec(cleaned))) {
        const open = m.index + m[0].length - 1;
        const close = findMatchingParen(cleaned, open);
        const info = {};
        const name = assignNameBefore(cleaned, m.index);
        if (name)
            info.name = name;
        if (close >= 0) {
            const args = cleaned.slice(open + 1, close);
            const mod = firstStringArg(args);
            if (mod !== undefined)
                info.module = mod;
        }
        push(info, m.index);
    }
    // bare replace( / replaceEsm( from named imports
    const bareRe = /\b(replaceEsm|replace)\s*\(/g;
    while ((m = bareRe.exec(cleaned))) {
        const before = cleaned.slice(Math.max(0, m.index - 2), m.index);
        if (/\.\s*$/.test(before))
            continue;
        // only if testdouble context
        if (!/from\s*['"]testdouble['"]/.test(cleaned) &&
            !/require\s*\(\s*['"]testdouble['"]\s*\)/.test(cleaned) &&
            imports.td.length === 0) {
            continue;
        }
        const open = m.index + m[0].length - 1;
        const close = findMatchingParen(cleaned, open);
        const info = {};
        const name = assignNameBefore(cleaned, m.index);
        if (name)
            info.name = name;
        if (close >= 0) {
            const args = cleaned.slice(open + 1, close);
            const mod = firstStringArg(args);
            if (mod !== undefined)
                info.module = mod;
        }
        push(info, m.index);
    }
    return { replacements, count: replacements.length };
}
/**
 * List td.when(...).thenReturn/thenResolve/thenReject/thenCallback
 */
export function listWhens(text) {
    const cleaned = stripComments(text ?? "");
    const whens = [];
    const seen = new Set();
    const imports = detectTdImports(cleaned);
    const push = (info, index) => {
        const key = `${info.call ?? ""}|${info.then ?? ""}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        whens.push(info);
    };
    const hosts = new Set([...imports.td, "td"]);
    const alt = nsAlt([...hosts]);
    if (!alt)
        return { whens, count: 0 };
    // td.when( ... )  optionally .config  then .thenXxx(
    const whenRe = new RegExp(`(?:${alt})\\s*\\.\\s*when\\s*\\(`, "g");
    let m;
    while ((m = whenRe.exec(cleaned))) {
        const open = m.index + m[0].length - 1;
        const close = findMatchingParen(cleaned, open);
        if (close < 0) {
            push({}, m.index);
            continue;
        }
        const callArgs = cleaned.slice(open + 1, close);
        const info = {};
        if (callArgs.trim())
            info.call = compactCall(callArgs);
        // look ahead for .thenXxx after optional config object arg chaining:
        // td.when(call, {ignoreExtraArgs:true}).thenReturn(...)
        // td.when(call).thenReturn(...)
        const after = cleaned.slice(close + 1, close + 1 + 200);
        const thenM = after.match(/^\s*(?:,\s*\{[^}]*\}\s*)?(?:\)\s*)?\.?\s*(?:then(?:Return|Resolve|Reject|Callback|Do|Throw))\s*\(/);
        // simpler: search .thenReturn etc. in a short window after when(...)
        const window = cleaned.slice(close + 1, close + 1 + 160);
        const thenFind = window.match(/\.\s*(thenReturn|thenResolve|thenReject|thenCallback|thenDo|thenThrow)\s*\(/);
        if (thenFind)
            info.then = thenFind[1];
        push(info, m.index);
    }
    // bare when( from named import
    const bareWhen = /\bwhen\s*\(/g;
    while ((m = bareWhen.exec(cleaned))) {
        const before = cleaned.slice(Math.max(0, m.index - 2), m.index);
        if (/\.\s*$/.test(before))
            continue;
        if (!/from\s*['"]testdouble['"]/.test(cleaned) &&
            !/require\s*\(\s*['"]testdouble['"]\s*\)/.test(cleaned) &&
            imports.td.length === 0) {
            continue;
        }
        const open = m.index + m[0].length - 1;
        const close = findMatchingParen(cleaned, open);
        if (close < 0) {
            push({}, m.index);
            continue;
        }
        const callArgs = cleaned.slice(open + 1, close);
        const info = {};
        if (callArgs.trim())
            info.call = compactCall(callArgs);
        const window = cleaned.slice(close + 1, close + 1 + 160);
        const thenFind = window.match(/\.\s*(thenReturn|thenResolve|thenReject|thenCallback|thenDo|thenThrow)\s*\(/);
        if (thenFind)
            info.then = thenFind[1];
        // only count if then* found OR looks like td.when usage (has then nearby or double call)
        if (info.then || /\bthen(?:Return|Resolve|Reject|Callback)\b/.test(window)) {
            push(info, m.index);
        }
        else if (/from\s*['"]testdouble['"]/.test(cleaned) ||
            imports.td.length > 0) {
            push(info, m.index);
        }
    }
    return { whens, count: whens.length };
}
/**
 * List td.verify( call [, config] )
 */
export function listVerifies(text) {
    const cleaned = stripComments(text ?? "");
    const verifies = [];
    const seen = new Set();
    const imports = detectTdImports(cleaned);
    const push = (info, index) => {
        const key = `${info.call ?? ""}|${info.config ?? ""}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        verifies.push(info);
    };
    const hosts = new Set([...imports.td, "td"]);
    const alt = nsAlt([...hosts]);
    if (!alt)
        return { verifies, count: 0 };
    const parseVerifyArgs = (args) => {
        const info = {};
        // Split top-level args: first is call expr, second may be config object
        let depth = 0;
        let inString = false;
        let quote = "";
        let splitAt = -1;
        for (let i = 0; i < args.length; i++) {
            const c = args[i];
            if (inString) {
                if (c === "\\" && i + 1 < args.length) {
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
            if (c === "(" || c === "[" || c === "{")
                depth++;
            else if (c === ")" || c === "]" || c === "}")
                depth = Math.max(0, depth - 1);
            else if (c === "," && depth === 0) {
                splitAt = i;
                break;
            }
        }
        if (splitAt < 0) {
            const call = args.trim();
            if (call)
                info.call = compactCall(call);
        }
        else {
            const call = args.slice(0, splitAt).trim();
            const config = args.slice(splitAt + 1).trim();
            if (call)
                info.call = compactCall(call);
            if (config)
                info.config = compactCall(config, 60);
        }
        return info;
    };
    const re = new RegExp(`(?:${alt})\\s*\\.\\s*verify\\s*\\(`, "g");
    let m;
    while ((m = re.exec(cleaned))) {
        const open = m.index + m[0].length - 1;
        const close = findMatchingParen(cleaned, open);
        if (close < 0) {
            push({}, m.index);
            continue;
        }
        const args = cleaned.slice(open + 1, close);
        push(parseVerifyArgs(args), m.index);
    }
    // bare verify(
    const bare = /\bverify\s*\(/g;
    while ((m = bare.exec(cleaned))) {
        const before = cleaned.slice(Math.max(0, m.index - 2), m.index);
        if (/\.\s*$/.test(before))
            continue;
        if (!/from\s*['"]testdouble['"]/.test(cleaned) &&
            !/require\s*\(\s*['"]testdouble['"]\s*\)/.test(cleaned) &&
            imports.td.length === 0) {
            continue;
        }
        const open = m.index + m[0].length - 1;
        const close = findMatchingParen(cleaned, open);
        if (close < 0) {
            push({}, m.index);
            continue;
        }
        const args = cleaned.slice(open + 1, close);
        push(parseVerifyArgs(args), m.index);
    }
    return { verifies, count: verifies.length };
}
export function lintTestdouble(text) {
    const findings = [];
    const raw = text ?? "";
    if (!raw.trim()) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Source text is empty. Paste testdouble.js JS/TS (e.g. td.replace('./mod') / td.when(fn()).thenReturn(x) / td.verify(fn())).",
        });
        return findings;
    }
    const cleaned = stripComments(raw);
    const imports = detectTdImports(cleaned);
    const { replacements } = listReplacements(cleaned);
    const { whens } = listWhens(cleaned);
    const { verifies } = listVerifies(cleaned);
    const hasTd = /from\s+['"]testdouble(?:\/[^'"]*)?['"]/.test(cleaned) ||
        /require\s*\(\s*['"]testdouble['"]\s*\)/.test(cleaned) ||
        /\btd\s*\.\s*(?:replace|replaceEsm|when|verify|function|object|constructor|reset)\b/.test(cleaned) ||
        replacements.length > 0 ||
        whens.length > 0 ||
        verifies.length > 0;
    if (!hasTd) {
        findings.push({
            severity: "warn",
            rule: "no_testdouble_detected",
            advice: "No `td.replace` / `td.when` / `td.verify` / `from 'testdouble'` patterns detected. Confirm this is testdouble.js test source.",
        });
    }
    const tdResetCount = countOccurrences(cleaned, /\btd\s*\.\s*reset\s*\(/g);
    // replace without reset tip
    if (replacements.length >= 1 && tdResetCount === 0) {
        findings.push({
            severity: "warn",
            rule: "replace_without_reset_tip",
            advice: "`td.replace` / `td.replaceEsm` found without `td.reset()` in this text. Call `td.reset()` in afterEach (or equivalent) so module replacements do not leak across tests.",
        });
    }
    // when without verify tip
    if (whens.length >= 1 && verifies.length === 0) {
        findings.push({
            severity: "info",
            rule: "when_without_verify_tip",
            advice: `Found ${whens.length}× \`td.when(...).then*\` stubbing without \`td.verify(...)\` in this text. Prefer verifying important interactions with \`td.verify\` (or assert on return values) so stubs are not unused.`,
        });
    }
    // function vs object double tips
    const functionCount = countOccurrences(cleaned, /\btd\s*\.\s*function\s*\(|\btd\.func\s*\(/g);
    const objectCount = countOccurrences(cleaned, /\btd\s*\.\s*object\s*\(|\btd\s*\.\s*constructor\s*\(/g);
    if (functionCount >= 1 && objectCount === 0 && replacements.length === 0) {
        findings.push({
            severity: "info",
            rule: "function_double_tip",
            advice: "`td.function()` / `td.func()` doubles found. For module APIs with multiple methods, prefer `td.object(['method', …])` or `td.replace('./module')` so the SUT receives a shaped double.",
        });
    }
    if (objectCount >= 1 && functionCount === 0 && whens.length === 0) {
        findings.push({
            severity: "info",
            rule: "object_double_without_when_tip",
            advice: "`td.object` / `td.constructor` found without `td.when(...).then*` in this text. Unconfigured object methods return a unique empty value; stub behavior with `td.when` when the SUT depends on return values.",
        });
    }
    // many replaces — prefer afterEach reset reminder (already covered) + info
    if (replacements.length >= 3 && tdResetCount === 0) {
        findings.push({
            severity: "info",
            rule: "many_replaces_tip",
            advice: `Found ${replacements.length} replacements. Ensure every test path that uses \`td.replace\` also calls \`td.reset()\`, and prefer replacing only the modules under test.`,
        });
    }
    // thenCallback without verify tip (callback-style)
    const callbackWhens = whens.filter((w) => w.then === "thenCallback").length;
    if (callbackWhens >= 1 && verifies.length === 0) {
        findings.push({
            severity: "info",
            rule: "thenCallback_without_verify_tip",
            advice: "`thenCallback` stubbing found without `td.verify`. For callback-style doubles, verify the double was invoked (and assert on the real callback side effects).",
        });
    }
    return findings;
}
