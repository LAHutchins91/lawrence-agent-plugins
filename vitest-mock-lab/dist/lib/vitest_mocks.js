/**
 * Best-effort Vitest vi.mock JS/TS text heuristics.
 * No vitest runtime, no network, no filesystem follow, no eval / no TS AST.
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
function countOccurrences(text, re) {
    let n = 0;
    const r = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    while (r.exec(text))
        n++;
    return n;
}
/** Parse string literal at top-level arg index. */
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
/** First top-level arg slice (trimmed). */
function argSliceAt(args, which) {
    let depth = 0;
    let inString = false;
    let quote = "";
    let argIndex = 0;
    let start = 0;
    let i = 0;
    const s = args;
    // skip leading whitespace for start of arg 0
    while (start < s.length && /\s/.test(s[start]))
        start++;
    i = start;
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
            if (argIndex === which) {
                return s.slice(start, i).trim();
            }
            argIndex++;
            i++;
            while (i < s.length && /\s/.test(s[i]))
                i++;
            start = i;
            continue;
        }
        i++;
    }
    if (argIndex === which) {
        const t = s.slice(start).trim();
        return t || undefined;
    }
    return undefined;
}
/** Summarize factory arg for display. */
function factoryHint(args) {
    const second = argSliceAt(args, 1);
    if (!second)
        return undefined;
    const t = second.trim();
    if (!t)
        return undefined;
    if (/^async\s*\(/.test(t) || /^\(/.test(t) || /^function\b/.test(t) || /^=>/.test(t)) {
        return "factory";
    }
    if (/^importActual\b|^vi\s*\.\s*importActual\b|^jest\s*\.\s*requireActual\b/.test(t)) {
        return "importActual";
    }
    // object / identifier factory
    if (t.startsWith("{") || /^[A-Za-z_$]/.test(t)) {
        return t.length > 40 ? t.slice(0, 37) + "..." : t;
    }
    return t.length > 40 ? t.slice(0, 37) + "..." : t;
}
function firstArgIdent(args) {
    const trimmed = args.trim();
    if (!trimmed)
        return undefined;
    if (trimmed[0] === "'" ||
        trimmed[0] === '"' ||
        trimmed[0] === "`" ||
        trimmed[0] === "/") {
        return undefined;
    }
    const m = trimmed.match(/^(?:await\s+)?((?:this|[A-Za-z_$][\w$]*)(?:\s*\.\s*[A-Za-z_$][\w$]*)*)/);
    return m?.[1]?.replace(/\s+/g, "");
}
/**
 * Detect vi / vitest identifiers from imports and heuristics.
 */
export function detectVitestImports(cleaned) {
    const vi = new Set();
    const jest = new Set();
    // import { vi, ... } from 'vitest'
    const namedImportRe = /import\s*\{([^}]+)\}\s*from\s*['"]vitest(?:\/[^'"]*)?['"]/g;
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
            if (orig === "vi")
                vi.add(local);
        }
    }
    // import * as vitest from 'vitest' — less common for vi
    const starRe = /import\s*\*\s*as\s+([A-Za-z_][A-Za-z0-9_]*)\s*from\s*['"]vitest(?:\/[^'"]*)?['"]/g;
    while ((m = starRe.exec(cleaned))) {
        // vitest.vi usage possible
        vi.add(m[1] + ".vi");
    }
    // Heuristic: bare vi.mock / vi.spyOn / vi.fn
    if (/\bvi\s*\.\s*(?:mock|doMock|unmock|hoisted|spyOn|fn|resetModules|clearAllMocks|restoreAllMocks|resetAllMocks)\b/.test(cleaned)) {
        vi.add("vi");
    }
    // jest.mock compat
    if (/\bjest\s*\.\s*(?:mock|doMock|unmock|spyOn|fn|resetModules|clearAllMocks|restoreAllMocks|resetAllMocks)\b/.test(cleaned)) {
        jest.add("jest");
    }
    const jestImport = /import\s*\{([^}]+)\}\s*from\s*['"]@jest\/globals['"]/g;
    while ((m = jestImport.exec(cleaned))) {
        if (/\bjest\b/.test(m[1]))
            jest.add("jest");
    }
    return { vi: [...vi], jest: [...jest] };
}
function nsAlt(ns) {
    // Filter weird "vitest.vi" double — handle separately; escape dots for regex
    return ns
        .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|");
}
/**
 * List mocks from vi.mock( / jest.mock(
 */
export function listMocks(text) {
    const cleaned = stripComments(text ?? "");
    const mocks = [];
    const seen = new Set();
    const push = (info, index) => {
        const key = `${info.module ?? ""}|${info.factory ?? ""}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        mocks.push(info);
    };
    const re = /\b(?:vi|jest)\s*\.\s*mock\s*\(/g;
    let m;
    while ((m = re.exec(cleaned))) {
        const open = m.index + m[0].length - 1;
        const close = findMatchingParen(cleaned, open);
        const info = {};
        if (close >= 0) {
            const args = cleaned.slice(open + 1, close);
            const mod = stringArgAt(args, 0);
            if (mod !== undefined)
                info.module = mod;
            const fac = factoryHint(args);
            if (fac !== undefined)
                info.factory = fac;
        }
        push(info, m.index);
    }
    return { mocks, count: mocks.length };
}
/**
 * List spies from vi.spyOn( / vi.fn(
 */
export function listSpies(text) {
    const cleaned = stripComments(text ?? "");
    const spies = [];
    const seen = new Set();
    const push = (info, index) => {
        const key = `${info.target ?? ""}|${info.method ?? ""}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        spies.push(info);
    };
    // vi.spyOn(obj, 'method') / jest.spyOn(...)
    const spyRe = /\b(?:vi|jest)\s*\.\s*spyOn\s*\(/g;
    let m;
    while ((m = spyRe.exec(cleaned))) {
        const open = m.index + m[0].length - 1;
        const close = findMatchingParen(cleaned, open);
        const info = {};
        if (close >= 0) {
            const args = cleaned.slice(open + 1, close);
            const target = firstArgIdent(args);
            if (target)
                info.target = target;
            const method = stringArgAt(args, target ? 1 : 0);
            if (method)
                info.method = method;
        }
        push(info, m.index);
    }
    // vi.fn( / jest.fn( — treat as spy with optional assigned name as target hint via preceding const
    const fnRe = /\b(?:vi|jest)\s*\.\s*fn\s*\(/g;
    while ((m = fnRe.exec(cleaned))) {
        const info = { method: "fn" };
        const before = cleaned.slice(Math.max(0, m.index - 160), m.index);
        const nameM = before.match(/(?:export\s+)?(?:const|let|var)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*$/);
        if (nameM)
            info.target = nameM[1];
        push(info, m.index);
    }
    return { spies, count: spies.length };
}
/**
 * List hoist-related: vi.hoisted / vi.doMock / vi.unmock / vi.resetModules
 */
export function listHoisted(text) {
    const cleaned = stripComments(text ?? "");
    const hoisted = [];
    const seen = new Set();
    const push = (kind, index) => {
        const key = `${kind}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        hoisted.push({ kind });
    };
    const patterns = [
        { re: /\b(?:vi|jest)\s*\.\s*hoisted\s*\(/g, kind: "hoisted" },
        { re: /\b(?:vi|jest)\s*\.\s*doMock\s*\(/g, kind: "doMock" },
        { re: /\b(?:vi|jest)\s*\.\s*unmock\s*\(/g, kind: "unmock" },
        { re: /\b(?:vi|jest)\s*\.\s*resetModules\s*\(/g, kind: "resetModules" },
        // also doUnmock
        { re: /\b(?:vi|jest)\s*\.\s*doUnmock\s*\(/g, kind: "doUnmock" },
    ];
    for (const { re, kind } of patterns) {
        let m;
        const r = new RegExp(re.source, "g");
        while ((m = r.exec(cleaned)))
            push(kind, m.index);
    }
    return { hoisted, count: hoisted.length };
}
export function lintVitestMocks(text) {
    const findings = [];
    const raw = text ?? "";
    if (!raw.trim()) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Source text is empty. Paste Vitest mock/spy JS/TS (e.g. vi.mock('./mod', () => (...)) / vi.spyOn(obj, 'm') / vi.fn() / vi.hoisted(...)).",
        });
        return findings;
    }
    const cleaned = stripComments(raw);
    const { mocks } = listMocks(cleaned);
    const { spies } = listSpies(cleaned);
    const { hoisted } = listHoisted(cleaned);
    const imports = detectVitestImports(cleaned);
    const hasVitest = /from\s+['"]vitest(?:\/[^'"]*)?['"]/.test(cleaned) ||
        /\bvi\s*\.\s*(?:mock|doMock|unmock|hoisted|spyOn|fn|resetModules)\b/.test(cleaned) ||
        /\bjest\s*\.\s*(?:mock|doMock|unmock|spyOn|fn|resetModules)\b/.test(cleaned) ||
        mocks.length > 0 ||
        spies.length > 0 ||
        hoisted.length > 0 ||
        imports.vi.length > 0;
    if (!hasVitest) {
        findings.push({
            severity: "warn",
            rule: "no_vitest_mock_detected",
            advice: "No `vi.mock` / `vi.spyOn` / `vi.fn` / `vi.hoisted` / `from 'vitest'` patterns detected. Confirm this is Vitest (or jest-compat) mock source.",
        });
    }
    const clearCount = countOccurrences(cleaned, /\b(?:vi|jest)\s*\.\s*(?:clearAllMocks|resetAllMocks|restoreAllMocks)\s*\(/g);
    const afterEachClear = /afterEach\s*\(\s*(?:async\s*)?(?:\([^)]*\)|[A-Za-z_][\w]*)\s*=>[\s\S]{0,400}?(?:clearAllMocks|resetAllMocks|restoreAllMocks)/.test(cleaned) ||
        /afterEach\s*\([\s\S]{0,400}?(?:clearAllMocks|resetAllMocks|restoreAllMocks)/.test(cleaned);
    // Mock without clearAllMocks tip
    if (mocks.length >= 1 && clearCount === 0 && !afterEachClear) {
        findings.push({
            severity: "warn",
            rule: "mock_without_clearAllMocks_tip",
            advice: "`vi.mock` / `jest.mock` found without `vi.clearAllMocks()` / `resetAllMocks` / `restoreAllMocks` in this text. Prefer clearing mock state in `beforeEach`/`afterEach` so call history does not leak across tests.",
        });
    }
    // Spy without mockRestore
    const spyOnCount = spies.filter((s) => s.method !== "fn").length;
    const restoreCount = countOccurrences(cleaned, /\.mockRestore\s*\(|\b(?:vi|jest)\s*\.\s*restoreAllMocks\s*\(/g);
    if (spyOnCount >= 1 && restoreCount === 0) {
        findings.push({
            severity: "warn",
            rule: "spy_without_mockRestore",
            advice: "`vi.spyOn` found without `.mockRestore()` / `vi.restoreAllMocks()` in this text. Restore spies in `afterEach` to avoid leaking patched methods into later tests.",
        });
    }
    // Import order vs hoist tip:
    // If there is an import of a relative/aliased module AND a vi.mock of a similar path,
    // and any import appears textually before the first vi.mock — remind that vi.mock is hoisted
    // but factory closures / vi.hoisted may still need care.
    const firstMock = cleaned.search(/\b(?:vi|jest)\s*\.\s*mock\s*\(/);
    const firstImport = cleaned.search(/^\s*import\s+/m);
    if (firstMock >= 0 &&
        firstImport >= 0 &&
        firstImport < firstMock &&
        mocks.length >= 1) {
        // Check if any mocked module string looks like a local path that might also be imported
        const mockedMods = mocks.map((x) => x.module).filter(Boolean);
        const importPaths = [];
        const importRe = /import\s+(?:[\s\S]*?)\s*from\s*['"]([^'"]+)['"]/g;
        let im;
        while ((im = importRe.exec(cleaned)))
            importPaths.push(im[1]);
        const overlap = mockedMods.some((mod) => importPaths.some((p) => p === mod || p.endsWith(mod) || mod.endsWith(p)));
        if (overlap || mockedMods.some((m) => m.startsWith(".") || m.startsWith("@"))) {
            const hasHoisted = hoisted.some((h) => h.kind === "hoisted");
            findings.push({
                severity: "info",
                rule: "import_order_vs_hoist_tip",
                advice: hasHoisted
                    ? "`vi.mock` is hoisted above imports at runtime; you already use `vi.hoisted` — keep shared mock state inside `vi.hoisted(() => ...)` so the factory can reference it safely."
                    : "`import` appears before `vi.mock` in source order. Vitest hoists `vi.mock` automatically, but variables used inside the mock factory are not hoisted — wrap shared state in `vi.hoisted(() => ({ ... }))` when the factory needs locals.",
            });
        }
    }
    // vi.fn without mockClear tip when many fns
    const fnCount = spies.filter((s) => s.method === "fn").length;
    if (fnCount >= 3 && clearCount === 0 && !afterEachClear) {
        findings.push({
            severity: "info",
            rule: "many_fn_without_clear_tip",
            advice: `Found ${fnCount}× \`vi.fn\` / \`jest.fn\` without clear/reset helpers in this text. Call \`vi.clearAllMocks()\` in \`beforeEach\` when asserting call counts across multiple tests.`,
        });
    }
    // doMock without resetModules tip
    const doMockCount = hoisted.filter((h) => h.kind === "doMock").length;
    const resetMods = hoisted.filter((h) => h.kind === "resetModules").length;
    if (doMockCount >= 1 && resetMods === 0) {
        findings.push({
            severity: "info",
            rule: "doMock_without_resetModules_tip",
            advice: "`vi.doMock` is not hoisted; pair it with dynamic `await import(...)` and often `vi.resetModules()` so subsequent tests do not keep a stale module cache.",
        });
    }
    // mock factory missing when many mocks — soft tip
    const withoutFactory = mocks.filter((m) => !m.factory).length;
    if (mocks.length >= 2 && withoutFactory === mocks.length) {
        findings.push({
            severity: "info",
            rule: "mock_factory_unset_tip",
            advice: "Multiple `vi.mock` / `jest.mock` calls without an inline factory. Automock may be fine, but provide a factory when you need specific exports or `importOriginal` / `importActual`.",
        });
    }
    return findings;
}
