/**
 * Best-effort Sinon stub/spy JS/TS text heuristics.
 * No sinon runtime, no network, no filesystem follow, no eval / no TS AST.
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
/** Parse first arg as identifier or this/obj path (not string). */
function firstArgIdent(args) {
    const trimmed = args.trim();
    if (!trimmed)
        return undefined;
    // skip string / template / regex first args
    if (trimmed[0] === "'" ||
        trimmed[0] === '"' ||
        trimmed[0] === "`" ||
        trimmed[0] === "/") {
        return undefined;
    }
    // identifier / member / this / await expr start
    const m = trimmed.match(/^(?:await\s+)?((?:this|[A-Za-z_$][\w$]*)(?:\s*\.\s*[A-Za-z_$][\w$]*)*)/);
    return m?.[1]?.replace(/\s+/g, "");
}
/** Parse string literal first or second arg as method name. */
function stringArgAt(args, which) {
    let depth = 0;
    let inString = false;
    let quote = "";
    let argIndex = 0;
    let i = 0;
    const s = args;
    while (i < s.length) {
        const c = s[i];
        if (inString) {
            if (c === "\\" && i + 1 < s.length) {
                i += 2;
                continue;
            }
            if (c === quote)
                inString = false;
            i++;
            continue;
        }
        if (c === '"' || c === "'" || c === "`") {
            if (argIndex === which && depth === 0) {
                quote = c;
                i++;
                let out = "";
                while (i < s.length) {
                    const ch = s[i];
                    if (ch === "\\" && i + 1 < s.length) {
                        out += s[i + 1];
                        i += 2;
                        continue;
                    }
                    if (ch === quote)
                        return out;
                    out += ch;
                    i++;
                }
                return out;
            }
            inString = true;
            quote = c;
            i++;
            continue;
        }
        if (c === "(" || c === "[" || c === "{") {
            depth++;
            i++;
            continue;
        }
        if (c === ")" || c === "]" || c === "}") {
            depth = Math.max(0, depth - 1);
            i++;
            continue;
        }
        if (c === "," && depth === 0) {
            argIndex++;
            i++;
            continue;
        }
        i++;
    }
    return undefined;
}
/**
 * Detect sinon / sandbox identifiers from imports and heuristics.
 */
export function detectSinonImports(cleaned) {
    const sinon = new Set();
    const sandboxes = new Set();
    const namedImportRe = /import\s*\{([^}]+)\}\s*from\s*['"]sinon(?:\/[^'"]*)?['"]/g;
    let m;
    while ((m = namedImportRe.exec(cleaned))) {
        const parts = m[1].split(",");
        for (const part of parts) {
            const p = part.trim();
            if (!p)
                continue;
            const asM = p.match(/^([A-Za-z_][A-Za-z0-9_]*)\s+as\s+([A-Za-z_][A-Za-z0-9_]*)$/);
            const orig = asM ? asM[1] : p.match(/^([A-Za-z_][A-Za-z0-9_]*)$/)?.[1];
            const local = asM ? asM[2] : orig;
            if (!orig || !local)
                continue;
            if (orig === "default" || orig === "sinon")
                sinon.add(local);
            else if (/^(stub|spy|fake|createSandbox|useFakeTimers|fakeServer|restore|assert|match)$/.test(orig)) {
                // named imports of helpers — still mark sinon presence via local usage later
                if (orig === "createSandbox")
                    sandboxes.add(local);
            }
        }
    }
    // import sinon from 'sinon' / import * as sinon from 'sinon'
    const defRe = /import\s+([A-Za-z_][A-Za-z0-9_]*)\s+from\s*['"]sinon(?:\/[^'"]*)?['"]/g;
    while ((m = defRe.exec(cleaned)))
        sinon.add(m[1]);
    const starRe = /import\s*\*\s*as\s+([A-Za-z_][A-Za-z0-9_]*)\s*from\s*['"]sinon(?:\/[^'"]*)?['"]/g;
    while ((m = starRe.exec(cleaned)))
        sinon.add(m[1]);
    // require('sinon')
    const reqRe = /(?:const|let|var)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*require\s*\(\s*['"]sinon['"]\s*\)/g;
    while ((m = reqRe.exec(cleaned)))
        sinon.add(m[1]);
    // Heuristic fallback
    if (/\bsinon\s*\.\s*(?:stub|spy|fake|createSandbox|useFakeTimers|fakeServer)\b/.test(cleaned)) {
        sinon.add("sinon");
    }
    // sandbox variables: const sandbox = sinon.createSandbox() / createSandbox()
    const sbAssign = /(?:const|let|var)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(?:[A-Za-z_][A-Za-z0-9_]*\s*\.\s*)?createSandbox\s*\(/g;
    while ((m = sbAssign.exec(cleaned)))
        sandboxes.add(m[1]);
    // also common name "sandbox"
    if (/\bsandbox\s*\.\s*(?:stub|spy|restore|useFakeTimers)\s*\(/.test(cleaned)) {
        sandboxes.add("sandbox");
    }
    return { sinon: [...sinon], sandboxes: [...sandboxes] };
}
function nsAlt(ns) {
    return ns
        .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|");
}
function parseStubOrSpyCall(cleaned, matchIndex, matchLen) {
    const open = matchIndex + matchLen - 1;
    const close = findMatchingParen(cleaned, open);
    const info = {};
    const name = assignNameBefore(cleaned, matchIndex);
    if (name)
        info.name = name;
    if (close < 0)
        return info;
    const args = cleaned.slice(open + 1, close);
    const target = firstArgIdent(args);
    if (target)
        info.target = target;
    // method: second string arg, or first string if no target (sinon.stub().returns — rare)
    const method = stringArgAt(args, target ? 1 : 0) ??
        (target ? stringArgAt(args, 1) : undefined);
    if (method)
        info.method = method;
    // also: obj.method form already in target — leave method undefined unless string arg
    return info;
}
/**
 * List stubs from sinon.stub( / sandbox.stub(
 */
export function listStubs(text) {
    const cleaned = stripComments(text ?? "");
    const stubs = [];
    const seen = new Set();
    const imports = detectSinonImports(cleaned);
    const push = (info, index) => {
        const key = `${info.target ?? ""}|${info.method ?? ""}|${info.name ?? ""}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        stubs.push(info);
    };
    const hosts = new Set([
        ...imports.sinon,
        ...imports.sandboxes,
        "sinon",
        "sandbox",
    ]);
    const alt = nsAlt([...hosts]);
    if (!alt)
        return { stubs, count: 0 };
    const re = new RegExp(`(?:${alt})\\s*\\.\\s*stub\\s*\\(`, "g");
    let m;
    while ((m = re.exec(cleaned))) {
        const info = parseStubOrSpyCall(cleaned, m.index, m[0].length);
        const stub = {};
        if (info.target !== undefined)
            stub.target = info.target;
        if (info.method !== undefined)
            stub.method = info.method;
        if (info.name !== undefined)
            stub.name = info.name;
        push(stub, m.index);
    }
    // bare stub( from named import { stub }
    const bareStub = /\bstub\s*\(/g;
    while ((m = bareStub.exec(cleaned))) {
        // skip if already matched as ns.stub(
        const before = cleaned.slice(Math.max(0, m.index - 2), m.index);
        if (/\.\s*$/.test(before))
            continue;
        const info = parseStubOrSpyCall(cleaned, m.index, m[0].length);
        const stub = {};
        if (info.target !== undefined)
            stub.target = info.target;
        if (info.method !== undefined)
            stub.method = info.method;
        if (info.name !== undefined)
            stub.name = info.name;
        // only count if looks like sinon usage (has target or sinon import)
        if (stub.target || imports.sinon.length > 0 || /from\s*['"]sinon['"]/.test(cleaned)) {
            push(stub, m.index);
        }
    }
    return { stubs, count: stubs.length };
}
/**
 * List spies from sinon.spy( / sandbox.spy(
 */
export function listSpies(text) {
    const cleaned = stripComments(text ?? "");
    const spies = [];
    const seen = new Set();
    const imports = detectSinonImports(cleaned);
    const push = (info, index) => {
        const key = `${info.target ?? ""}|${info.method ?? ""}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        spies.push(info);
    };
    const hosts = new Set([
        ...imports.sinon,
        ...imports.sandboxes,
        "sinon",
        "sandbox",
    ]);
    const alt = nsAlt([...hosts]);
    if (!alt)
        return { spies, count: 0 };
    const re = new RegExp(`(?:${alt})\\s*\\.\\s*spy\\s*\\(`, "g");
    let m;
    while ((m = re.exec(cleaned))) {
        const info = parseStubOrSpyCall(cleaned, m.index, m[0].length);
        const spy = {};
        if (info.target !== undefined)
            spy.target = info.target;
        if (info.method !== undefined)
            spy.method = info.method;
        push(spy, m.index);
    }
    const bareSpy = /\bspy\s*\(/g;
    while ((m = bareSpy.exec(cleaned))) {
        const before = cleaned.slice(Math.max(0, m.index - 2), m.index);
        if (/\.\s*$/.test(before))
            continue;
        const info = parseStubOrSpyCall(cleaned, m.index, m[0].length);
        const spy = {};
        if (info.target !== undefined)
            spy.target = info.target;
        if (info.method !== undefined)
            spy.method = info.method;
        if (spy.target || imports.sinon.length > 0 || /from\s*['"]sinon['"]/.test(cleaned)) {
            push(spy, m.index);
        }
    }
    return { spies, count: spies.length };
}
/**
 * List fakes: sinon.fake / useFakeTimers / fakeServer / createSandbox
 */
export function listFakes(text) {
    const cleaned = stripComments(text ?? "");
    const fakes = [];
    const seen = new Set();
    const imports = detectSinonImports(cleaned);
    const push = (kind, index) => {
        const key = `${kind}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        fakes.push({ kind });
    };
    const hosts = new Set([...imports.sinon, "sinon"]);
    const alt = nsAlt([...hosts]);
    // sinon.fake / sinon.fake.returns / sinon.fake.resolves / etc. / bare fake(
    // Count each sinon.fake(...) or sinon.fake.xxx( as kind 'fake'
    const fakeRe = alt
        ? new RegExp(`(?:${alt})\\s*\\.\\s*fake(?:\\s*\\.\\s*[A-Za-z_][A-Za-z0-9_]*)?\\s*\\(`, "g")
        : null;
    if (fakeRe) {
        let m;
        while ((m = fakeRe.exec(cleaned)))
            push("fake", m.index);
    }
    // also sinon.fake without call (assignment of factory) — rare
    const fakeProp = alt
        ? new RegExp(`(?:${alt})\\s*\\.\\s*fake\\b(?!\\s*\\.|\\s*\\()`, "g")
        : null;
    if (fakeProp) {
        let m;
        while ((m = fakeProp.exec(cleaned)))
            push("fake", m.index);
    }
    // useFakeTimers
    const timersHosts = new Set([
        ...imports.sinon,
        ...imports.sandboxes,
        "sinon",
        "sandbox",
    ]);
    const tAlt = nsAlt([...timersHosts]);
    if (tAlt) {
        const re = new RegExp(`(?:${tAlt})\\s*\\.\\s*useFakeTimers\\s*\\(`, "g");
        let m;
        while ((m = re.exec(cleaned)))
            push("fakeTimers", m.index);
    }
    // bare useFakeTimers(
    {
        const re = /\buseFakeTimers\s*\(/g;
        let m;
        while ((m = re.exec(cleaned))) {
            const before = cleaned.slice(Math.max(0, m.index - 2), m.index);
            if (/\.\s*$/.test(before))
                continue;
            push("fakeTimers", m.index);
        }
    }
    // fakeServer / createFakeServer / fakeServerWithClock
    if (tAlt) {
        const re = new RegExp(`(?:${tAlt})\\s*\\.\\s*(?:fakeServer(?:WithClock)?|createFakeServer(?:WithClock)?)\\s*(?:\\(|\\.)`, "g");
        let m;
        while ((m = re.exec(cleaned)))
            push("fakeServer", m.index);
    }
    {
        const re = /\b(?:fakeServer(?:WithClock)?|createFakeServer(?:WithClock)?)\s*(?:\(|\.)/g;
        let m;
        while ((m = re.exec(cleaned))) {
            const before = cleaned.slice(Math.max(0, m.index - 2), m.index);
            if (/\.\s*$/.test(before))
                continue;
            push("fakeServer", m.index);
        }
    }
    // createSandbox
    if (alt) {
        const re = new RegExp(`(?:${alt})\\s*\\.\\s*createSandbox\\s*\\(`, "g");
        let m;
        while ((m = re.exec(cleaned)))
            push("createSandbox", m.index);
    }
    {
        const re = /\bcreateSandbox\s*\(/g;
        let m;
        while ((m = re.exec(cleaned))) {
            const before = cleaned.slice(Math.max(0, m.index - 2), m.index);
            if (/\.\s*$/.test(before))
                continue;
            push("createSandbox", m.index);
        }
    }
    return { fakes, count: fakes.length };
}
export function lintSinon(text) {
    const findings = [];
    const raw = text ?? "";
    if (!raw.trim()) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Source text is empty. Paste Sinon stub/spy JS/TS (e.g. sinon.stub(obj, 'method') / sandbox.spy(...) / sinon.useFakeTimers()).",
        });
        return findings;
    }
    const cleaned = stripComments(raw);
    const imports = detectSinonImports(cleaned);
    const { stubs } = listStubs(cleaned);
    const { spies } = listSpies(cleaned);
    const { fakes } = listFakes(cleaned);
    const hasSinon = /from\s+['"]sinon(?:\/[^'"]*)?['"]/.test(cleaned) ||
        /require\s*\(\s*['"]sinon['"]\s*\)/.test(cleaned) ||
        /\bsinon\s*\.\s*(?:stub|spy|fake|createSandbox|useFakeTimers|fakeServer)\b/.test(cleaned) ||
        /\bsandbox\s*\.\s*(?:stub|spy|restore|useFakeTimers)\s*\(/.test(cleaned) ||
        stubs.length > 0 ||
        spies.length > 0 ||
        fakes.length > 0;
    if (!hasSinon) {
        findings.push({
            severity: "warn",
            rule: "no_sinon_detected",
            advice: "No `sinon.stub` / `sandbox.spy` / `useFakeTimers` / `from 'sinon'` patterns detected. Confirm this is Sinon test source.",
        });
    }
    const hasSandbox = imports.sandboxes.length > 0 ||
        fakes.some((f) => f.kind === "createSandbox") ||
        /\bcreateSandbox\s*\(/.test(cleaned);
    const restoreCount = countOccurrences(cleaned, /\.restore\s*\(|\bsandbox\s*\.\s*restore\s*\(/g);
    // Stubs without restore / sandbox tip
    if (stubs.length >= 1 && !hasSandbox && restoreCount === 0) {
        findings.push({
            severity: "warn",
            rule: "stub_without_restore_or_sandbox_tip",
            advice: "Stubs found without `sandbox.restore()` / `.restore()` or `createSandbox()` in this text. Prefer `const sandbox = sinon.createSandbox()` and `sandbox.restore()` in afterEach to avoid leaked stubs across tests.",
        });
    }
    // calledOnce / calledWith without assert tip
    const calledOnceCount = countOccurrences(cleaned, /\.calledOnce\b|\.calledTwice\b|\.calledThrice\b|\.calledWith\b|\.calledOnceWith\b|\.called\b/g);
    const assertCount = countOccurrences(cleaned, /\bsinon\s*\.\s*assert\s*\.|\bassert\s*\.\s*(?:called|calledOnce|calledWith|callCount)\b|\bexpect\s*\(|\bassert\s*\(/g);
    if (calledOnceCount >= 1 && assertCount === 0) {
        findings.push({
            severity: "info",
            rule: "calledOnce_missing_assert_tip",
            advice: `Found ${calledOnceCount}× spy/stub call property check(s) (\`calledOnce\` / \`calledWith\` / …) without an obvious \`sinon.assert.*\` / \`expect(...)\` / \`assert(...)\` wrapper. Prefer \`sinon.assert.calledOnce(spy)\` (or your assertion library) so failures throw clearly.`,
        });
    }
    // fake timers without restore
    const timerFakes = fakes.filter((f) => f.kind === "fakeTimers").length;
    const clockRestore = countOccurrences(cleaned, /\bclock\s*\.\s*restore\s*\(|\.useFakeTimers[\s\S]{0,200}?\.restore\s*\(/g) + restoreCount;
    if (timerFakes >= 1 && clockRestore === 0 && !hasSandbox) {
        findings.push({
            severity: "warn",
            rule: "fake_timers_without_restore",
            advice: "`useFakeTimers` found without `.restore()` / sandbox restore in this text. Always restore fake timers (or use a sandbox) so real timers are not left mocked for later tests.",
        });
    }
    // fakeServer without restore
    const serverFakes = fakes.filter((f) => f.kind === "fakeServer").length;
    if (serverFakes >= 1 && restoreCount === 0 && !hasSandbox) {
        findings.push({
            severity: "info",
            rule: "fake_server_without_restore_tip",
            advice: "`fakeServer` / `createFakeServer` found without restore/sandbox in this text. Call `.restore()` (or sandbox.restore()) after assertions.",
        });
    }
    // many stubs — sandbox tip
    if (stubs.length + spies.length >= 4 && !hasSandbox) {
        findings.push({
            severity: "info",
            rule: "prefer_sandbox_tip",
            advice: `Found ${stubs.length} stub(s) and ${spies.length} spy(s) without \`createSandbox\`. A shared sandbox simplifies restore and keeps tests isolated.`,
        });
    }
    // stub with yields/callsFake without returns — informational only if nothing else
    const yieldsCount = countOccurrences(cleaned, /\.(?:yields|yieldsAsync|callsArg|callsArgWith|callsFake|resolves|rejects|returns)\s*\(/g);
    if (stubs.length >= 2 && yieldsCount === 0) {
        findings.push({
            severity: "info",
            rule: "stub_behavior_unset_tip",
            advice: "Multiple stubs without `.returns` / `.resolves` / `.callsFake` / `.yields` in this text. Unconfigured stubs return `undefined`; set behavior when the SUT depends on return values.",
        });
    }
    return findings;
}
