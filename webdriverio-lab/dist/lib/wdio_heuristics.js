/**
 * Best-effort WebdriverIO JS/TS text heuristics.
 * No wdio / browser / WebDriver runtime, no network, no filesystem follow, no eval / no TS AST.
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
function findMatchingBracket(s, openBracketIndex) {
    let depth = 0;
    let inString = false;
    let quote = "";
    for (let i = openBracketIndex; i < s.length; i++) {
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
        if (c === "[")
            depth++;
        else if (c === "]") {
            depth--;
            if (depth === 0)
                return i;
        }
    }
    return -1;
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
/**
 * List Mocha-style describe/it/hooks from WDIO specs, or config `specs:` array entries.
 */
export function listSpecs(text) {
    const cleaned = stripComments(text ?? "");
    const specs = [];
    const seen = new Set();
    const push = (info, index) => {
        const key = `${info.kind}|${info.title ?? ""}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        specs.push(info);
    };
    // describe / context / suite
    const describeRe = /\b(?:describe|context|suite|xdescribe|fdescribe)\s*(?:\.\s*(?:only|skip|skipIf|skipUnless))?\s*\(/g;
    let m;
    while ((m = describeRe.exec(cleaned))) {
        const open = m.index + m[0].length - 1;
        const close = findMatchingParen(cleaned, open);
        const info = { kind: "describe" };
        if (close >= 0) {
            const args = cleaned.slice(open + 1, close);
            const title = stringArgAt(args, 0);
            if (title !== undefined && title.length > 0)
                info.title = title;
        }
        push(info, m.index);
    }
    // it / specify / test / xit / fit
    const itRe = /\b(?:it|specify|test|xit|fit|xspecify)\s*(?:\.\s*(?:only|skip|skipIf|skipUnless))?\s*\(/g;
    while ((m = itRe.exec(cleaned))) {
        const open = m.index + m[0].length - 1;
        const close = findMatchingParen(cleaned, open);
        const info = { kind: "it" };
        if (close >= 0) {
            const args = cleaned.slice(open + 1, close);
            const title = stringArgAt(args, 0);
            if (title !== undefined && title.length > 0)
                info.title = title;
        }
        push(info, m.index);
    }
    // before / beforeEach / beforeAll / after / afterEach / afterAll
    const hookRe = /\b(before(?:Each|All)?|after(?:Each|All)?)\s*(?:\.\s*skip)?\s*\(/g;
    while ((m = hookRe.exec(cleaned))) {
        const name = m[1];
        let kind = name;
        if (name.startsWith("before"))
            kind = "before";
        else if (name.startsWith("after"))
            kind = "after";
        // Keep specific hook name as kind when not plain before/after
        if (name !== "before" && name !== "after")
            kind = name;
        else
            kind = name;
        const open = m.index + m[0].length - 1;
        const close = findMatchingParen(cleaned, open);
        const info = { kind };
        if (close >= 0) {
            const args = cleaned.slice(open + 1, close);
            // hooks often have no title; optionally a timeout number — skip title
            const maybeTitle = stringArgAt(args, 0);
            if (maybeTitle !== undefined && maybeTitle.length > 0)
                info.title = maybeTitle;
        }
        push(info, m.index);
    }
    // config specs: [ '...', "..." ] or specs: ['./test/**/*.js']
    const specsKeyRe = /\bspecs\s*:\s*\[/g;
    while ((m = specsKeyRe.exec(cleaned))) {
        const open = m.index + m[0].length - 1;
        const close = findMatchingBracket(cleaned, open);
        if (close < 0)
            continue;
        const body = cleaned.slice(open + 1, close);
        // Collect string literals in the array
        const strRe = /(['"`])([^'"`\\]|\\.)*\1/g;
        let sm;
        while ((sm = strRe.exec(body))) {
            const lit = sm[0];
            const quote = lit[0];
            let inner = lit.slice(1, -1);
            // unescape lightly
            inner = inner.replace(/\\(.)/g, "$1");
            if (inner.length === 0)
                continue;
            push({ kind: "specs", title: inner }, m.index + sm.index);
        }
    }
    return { specs, count: specs.length };
}
/**
 * List selector APIs: $ / $$ / browser.$ / browser.$$ / custom$ / custom$$.
 */
export function listSelectors(text) {
    const cleaned = stripComments(text ?? "");
    const selectors = [];
    const seen = new Set();
    const push = (info, index) => {
        const key = `${info.api}|${info.selector ?? ""}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        selectors.push(info);
    };
    // Order matters: longer / more specific first.
    // Use lookbehind so browser.custom$ is not also counted as bare custom$.
    const patterns = [
        { re: /\b(?:browser|driver|[A-Za-z_$][\w$]*)\s*\.\s*custom\$\$\s*\(/g, api: "custom$$" },
        { re: /\b(?:browser|driver|[A-Za-z_$][\w$]*)\s*\.\s*custom\$\s*\(/g, api: "custom$" },
        { re: /\b(?:browser|driver)\s*\.\s*\$\$\s*\(/g, api: "$$" },
        { re: /\b(?:browser|driver)\s*\.\s*\$\s*\(/g, api: "$" },
        { re: /(?<![.\w$])custom\$\$\s*\(/g, api: "custom$$" },
        { re: /(?<![.\w$])custom\$\s*\(/g, api: "custom$" },
        { re: /(?<![\w$.])\$\$\s*\(/g, api: "$$" },
        { re: /(?<![\w$.])\$\s*\(/g, api: "$" },
    ];
    for (const { re, api } of patterns) {
        const r = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
        let m;
        while ((m = r.exec(cleaned))) {
            const open = m.index + m[0].length - 1;
            const close = findMatchingParen(cleaned, open);
            const info = { api };
            if (close >= 0) {
                const args = cleaned.slice(open + 1, close);
                const sel = stringArgAt(args, 0);
                if (sel !== undefined && sel.length > 0)
                    info.selector = sel;
            }
            push(info, m.index);
        }
    }
    return { selectors, count: selectors.length };
}
const BROWSER_COMMANDS = [
    "url",
    "click",
    "setValue",
    "addValue",
    "clearValue",
    "getText",
    "getValue",
    "getAttribute",
    "getCSSProperty",
    "getTitle",
    "getUrl",
    "waitUntil",
    "waitForDisplayed",
    "waitForExist",
    "waitForClickable",
    "waitForEnabled",
    "pause",
    "keys",
    "execute",
    "executeAsync",
    "switchToFrame",
    "switchToParentFrame",
    "switchToWindow",
    "newWindow",
    "closeWindow",
    "refresh",
    "back",
    "forward",
    "scrollIntoView",
    "moveTo",
    "dragAndDrop",
    "selectByVisibleText",
    "selectByAttribute",
    "selectByIndex",
    "isDisplayed",
    "isExisting",
    "isClickable",
    "isEnabled",
    "isSelected",
    "saveScreenshot",
    "takeScreenshot",
    "debug",
    "call",
    "deleteCookies",
    "getCookies",
    "setCookies",
    "touchAction",
    "doubleClick",
    "rightClick",
];
/**
 * List common browser. / element. WDIO command APIs.
 */
export function listCommands(text) {
    const cleaned = stripComments(text ?? "");
    const commands = [];
    const seen = new Set();
    const push = (name, index) => {
        const key = `${name}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        commands.push({ name });
    };
    const hasWdioSignal = /\bbrowser\s*\./.test(cleaned) ||
        /\bdriver\s*\./.test(cleaned) ||
        /(?<![\w$.])\$\$?\s*\(/.test(cleaned) ||
        /\bcustom\$\$?\s*\(/.test(cleaned) ||
        /\bwebdriverio\b/.test(cleaned) ||
        /\b@wdio\//.test(cleaned);
    for (const name of BROWSER_COMMANDS) {
        const re = new RegExp(String.raw `\.\s*(${name})\s*\(`, "g");
        let m;
        while ((m = re.exec(cleaned))) {
            const start = m.index;
            const before = cleaned.slice(Math.max(0, start - 100), start);
            const trimmed = before.replace(/\s+$/, "");
            if (/\b(?:console|process|window|document|Math|JSON|Object|Array|Promise)\s*$/.test(trimmed)) {
                continue;
            }
            const looksWdio = /\b(?:browser|driver|element|el|elem|btn|input|page)\s*$/.test(trimmed) ||
                /\)\s*$/.test(trimmed) ||
                /\$\s*$/.test(trimmed) ||
                /\$\$\s*$/.test(trimmed) ||
                /custom\$\$?\s*$/.test(trimmed);
            if (!looksWdio && !hasWdioSignal)
                continue;
            // If no strong receiver, still accept when file has WDIO signal
            if (!looksWdio && hasWdioSignal) {
                // skip very generic .url( on non-wdio objects when signal is only distant
                if (!/\b(?:browser|driver|\$|await)\b/.test(before))
                    continue;
            }
            push(name, m.index);
        }
    }
    return { commands, count: commands.length };
}
export function lintWdio(text) {
    const findings = [];
    const raw = text ?? "";
    if (!raw.trim()) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Source text is empty. Paste WebdriverIO JS/TS (e.g. describe/it specs, browser.url(...), $('...').click(), browser.waitUntil(...), or a wdio.conf specs: array).",
        });
        return findings;
    }
    const cleaned = stripComments(raw);
    const { specs } = listSpecs(cleaned);
    const { selectors } = listSelectors(cleaned);
    const { commands } = listCommands(cleaned);
    const hasWdio = /\bwebdriverio\b/.test(cleaned) ||
        /\b@wdio\//.test(cleaned) ||
        /\brequire\s*\(\s*['"]@wdio\//.test(cleaned) ||
        /from\s+['"]@wdio\//.test(cleaned) ||
        /\bbrowser\s*\./.test(cleaned) ||
        /(?<![\w$.])\$\$?\s*\(/.test(cleaned) ||
        /\bcustom\$\$?\s*\(/.test(cleaned) ||
        specs.length > 0 ||
        selectors.length > 0 ||
        commands.length > 0 ||
        /\bexports\.config\b|\bexport\s+const\s+config\b|\bconfig\s*=\s*\{/.test(cleaned);
    if (!hasWdio) {
        findings.push({
            severity: "warn",
            rule: "no_wdio_detected",
            advice: "No WebdriverIO signals detected (`browser.*`, `$`/`$$`, `describe`/`it`, `@wdio/*`, or `specs:`). Confirm this is WDIO source (not Cypress/Playwright — use those labs for that).",
        });
    }
    // browser.pause anti-pattern
    const pauseCount = commands.filter((c) => c.name === "pause").length;
    const barePause = countOccurrences(cleaned, /\b(?:browser|driver)\s*\.\s*pause\s*\(/g) +
        countOccurrences(cleaned, /\.pause\s*\(\s*\d+/g);
    const pauses = Math.max(pauseCount, barePause);
    if (pauses >= 1) {
        findings.push({
            severity: "warn",
            rule: "browser_pause_antipattern",
            advice: `Found ${pauses}× \`browser.pause\` / fixed delay. Prefer \`browser.waitUntil\`, \`waitForDisplayed\` / \`waitForExist\` / \`waitForClickable\`, or element waits so tests sync on conditions instead of arbitrary sleeps.`,
        });
    }
    // XPath overuse
    const xpathLike = selectors.filter((s) => {
        const sel = (s.selector ?? "").trim();
        return (sel.startsWith("//") ||
            sel.startsWith(".//") ||
            /^xpath[=/]/i.test(sel) ||
            (sel.startsWith("(") && sel.includes("//")));
    });
    if (xpathLike.length >= 2 || (selectors.length >= 3 && xpathLike.length >= 1 && xpathLike.length / Math.max(1, selectors.length) >= 0.5)) {
        findings.push({
            severity: "info",
            rule: "xpath_overuse_tip",
            advice: `Found ${xpathLike.length}× XPath-looking selector(s). Prefer CSS / \`data-testid\` attributes when possible — XPath is slower and more brittle under DOM changes. Use XPath for text/axis queries that CSS cannot express.`,
        });
    }
    // missing waitUntil tip
    const hasWaitUntil = commands.some((c) => c.name === "waitUntil");
    const hasElementWait = commands.some((c) => [
        "waitForDisplayed",
        "waitForExist",
        "waitForClickable",
        "waitForEnabled",
    ].includes(c.name));
    const hasClickOrSet = commands.some((c) => ["click", "setValue", "addValue", "url"].includes(c.name)) ||
        selectors.length >= 1;
    if (hasClickOrSet && !hasWaitUntil && !hasElementWait && pauses === 0) {
        findings.push({
            severity: "info",
            rule: "missing_waitUntil_tip",
            advice: "Interactions (`url` / `click` / `setValue` / `$`) without `waitUntil` or `waitForDisplayed`/`waitForExist`/`waitForClickable` in this text. Add explicit waits for flaky SPAs instead of relying on implicit timeouts alone.",
        });
    }
    // sync mode deprecated
    if (/\bsync\s*:\s*true\b/.test(cleaned) ||
        /\bwdio-sync\b/.test(cleaned) ||
        /@wdio\/sync/.test(cleaned) ||
        /\bbrowser\s*\.\s*call\s*\(/.test(cleaned) &&
            /\bsync\b/.test(cleaned)) {
        findings.push({
            severity: "warn",
            rule: "sync_mode_deprecated_tip",
            advice: "Sync mode / `@wdio/sync` / `sync: true` signals detected. WebdriverIO sync mode is deprecated — migrate to async/await (`async` specs and `await browser.*` / `await $('...').click()`).",
        });
    }
    // brittle CSS id/class without data-testid
    const brittle = selectors.filter((s) => {
        const sel = s.selector ?? "";
        return (/^#[A-Za-z]/.test(sel) ||
            /^\.[A-Za-z]/.test(sel) ||
            /^[a-z]+(?:\.[A-Za-z_-]+)+$/.test(sel));
    }).length;
    const dataSel = selectors.filter((s) => /data-(?:testid|test|cy|qa)/i.test(s.selector ?? "")).length;
    if (selectors.length >= 3 && brittle >= 2 && dataSel === 0) {
        findings.push({
            severity: "info",
            rule: "brittle_selector_tip",
            advice: "Several selectors use CSS id/class patterns without `data-testid` / `data-test` attributes. Prefer stable test attributes so markup/style refactors are less brittle.",
        });
    }
    // browser.debug leftover
    if (commands.some((c) => c.name === "debug") || /\bbrowser\s*\.\s*debug\s*\(/.test(cleaned)) {
        findings.push({
            severity: "info",
            rule: "browser_debug_tip",
            advice: "`browser.debug()` found — useful locally, but remove or gate it before CI so the runner does not hang waiting for a REPL.",
        });
    }
    // no expect / assert in specs with it()
    const itCount = specs.filter((s) => s.kind === "it").length;
    if (itCount >= 1 &&
        !/\bexpect\s*\(/.test(cleaned) &&
        !/\bassert\b/.test(cleaned) &&
        !/\.to(?:Be|Equal|Have|Match|Contain)/i.test(cleaned) &&
        !/\bchai\b/.test(cleaned)) {
        findings.push({
            severity: "info",
            rule: "missing_assertion_tip",
            advice: "`it(...)` blocks without `expect` / assertion matchers in this text. Ensure each test asserts an observable outcome (WDIO + expect-webdriverio or your assertion lib).",
        });
    }
    return findings;
}
function countOccurrences(text, re) {
    let n = 0;
    const r = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    while (r.exec(text))
        n++;
    return n;
}
