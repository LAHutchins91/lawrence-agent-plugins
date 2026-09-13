/**
 * Best-effort Puppeteer script JS/TS text heuristics.
 * No puppeteer / browser runtime, no network, no filesystem follow, no eval / no TS AST.
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
/**
 * List page lifecycle actions from puppeteer.launch / browser.newPage / page.goto / close.
 */
export function listPages(text) {
    const cleaned = stripComments(text ?? "");
    const pages = [];
    const seen = new Set();
    const push = (info, index) => {
        const key = `${info.action}|${info.url ?? ""}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        pages.push(info);
    };
    // puppeteer.launch( / puppeteer.default.launch( / require('puppeteer').launch(
    const launchRe = /\b(?:puppeteer(?:\s*\.\s*default)?|chromium|firefox)\s*\.\s*launch\s*\(/g;
    let m;
    while ((m = launchRe.exec(cleaned))) {
        push({ action: "launch" }, m.index);
    }
    // browser.newPage( / await browser.newPage(
    const newPageRe = /\b(?:\w+)\s*\.\s*newPage\s*\(/g;
    while ((m = newPageRe.exec(cleaned))) {
        push({ action: "newPage" }, m.index);
    }
    // page.goto( / await page.goto('url'
    const gotoRe = /\b(?:\w+)\s*\.\s*goto\s*\(/g;
    while ((m = gotoRe.exec(cleaned))) {
        const open = m.index + m[0].length - 1;
        const close = findMatchingParen(cleaned, open);
        const info = { action: "goto" };
        if (close >= 0) {
            const args = cleaned.slice(open + 1, close);
            const url = stringArgAt(args, 0);
            if (url !== undefined && url.length > 0)
                info.url = url;
        }
        push(info, m.index);
    }
    // page.close( / browser.close( / browser.disconnect(
    const closeRe = /\b([A-Za-z_$][\w$]*)\s*\.\s*(close|disconnect)\s*\(/g;
    while ((m = closeRe.exec(cleaned))) {
        const recv = (m[1] ?? "").toLowerCase();
        // Avoid false positives like Promise.close / stream.close — require pptr-ish receivers
        const looksLike = /^(browser|page|context|target|client|frame|b|p|ctx)$/.test(recv) ||
            recv.includes("browser") ||
            recv.includes("page") ||
            recv.includes("context");
        if (!looksLike)
            continue;
        push({ action: m[2] === "disconnect" ? "disconnect" : "close" }, m.index);
    }
    // page.setContent / page.reload as soft extras (optional string action)
    const setContentRe = /\b(?:\w+)\s*\.\s*setContent\s*\(/g;
    while ((m = setContentRe.exec(cleaned))) {
        push({ action: "setContent" }, m.index);
    }
    const reloadRe = /\b(?:\w+)\s*\.\s*reload\s*\(/g;
    while ((m = reloadRe.exec(cleaned))) {
        push({ action: "reload" }, m.index);
    }
    return { pages, count: pages.length };
}
/**
 * List selector APIs: click, type, $, $$, $eval, $$eval, waitForSelector, focus, hover, select, tap.
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
    // page.click('sel') / page.type('sel', ...) / page.focus / hover / select / tap / waitForSelector
    const namedApis = [
        "waitForSelector",
        "waitForXPath",
        "click",
        "type",
        "focus",
        "hover",
        "select",
        "tap",
        "fill",
    ];
    for (const api of namedApis) {
        const re = new RegExp(String.raw `\b(?:\w+)\s*\.\s*(${api})\s*\(`, "g");
        let m;
        while ((m = re.exec(cleaned))) {
            const open = m.index + m[0].length - 1;
            const close = findMatchingParen(cleaned, open);
            const info = { api: m[1] };
            if (close >= 0) {
                const args = cleaned.slice(open + 1, close);
                const sel = stringArgAt(args, 0);
                if (sel !== undefined && sel.length > 0)
                    info.selector = sel;
            }
            push(info, m.index);
        }
    }
    // page.$('sel') / page.$$('sel') / page.$eval / page.$$eval / page.$x
    const dollarApis = [
        { re: /\b(?:\w+)\s*\.\s*\$\$eval\s*\(/g, api: "$$eval" },
        { re: /\b(?:\w+)\s*\.\s*\$eval\s*\(/g, api: "$eval" },
        { re: /\b(?:\w+)\s*\.\s*\$\$\s*\(/g, api: "$$" },
        { re: /\b(?:\w+)\s*\.\s*\$x\s*\(/g, api: "$x" },
        { re: /\b(?:\w+)\s*\.\s*\$\s*\(/g, api: "$" },
    ];
    for (const { re, api } of dollarApis) {
        let m;
        // Reset lastIndex by creating fresh each loop — already new RegExp with g
        const r = new RegExp(re.source, re.flags);
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
    // elementHandle.click() without selector — skip (no selector arg)
    // page.locator('sel') (Puppeteer modern)
    const locatorRe = /\b(?:\w+)\s*\.\s*locator\s*\(/g;
    let lm;
    while ((lm = locatorRe.exec(cleaned))) {
        const open = lm.index + lm[0].length - 1;
        const close = findMatchingParen(cleaned, open);
        const info = { api: "locator" };
        if (close >= 0) {
            const args = cleaned.slice(open + 1, close);
            const sel = stringArgAt(args, 0);
            if (sel !== undefined && sel.length > 0)
                info.selector = sel;
        }
        push(info, lm.index);
    }
    return { selectors, count: selectors.length };
}
/**
 * List wait helpers: waitForSelector, waitForNavigation, waitForTimeout, waitForFunction, etc.
 */
export function listWaits(text) {
    const cleaned = stripComments(text ?? "");
    const waits = [];
    const seen = new Set();
    const push = (kind, index) => {
        const key = `${kind}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        waits.push({ kind });
    };
    const kinds = [
        "waitForSelector",
        "waitForNavigation",
        "waitForTimeout",
        "waitForFunction",
        "waitForResponse",
        "waitForRequest",
        "waitForNetworkIdle",
        "waitForXPath",
        "waitForFileChooser",
        "waitForFrame",
        "waitForDevicePrompt",
    ];
    for (const kind of kinds) {
        const re = new RegExp(String.raw `\b(?:\w+)\s*\.\s*(${kind})\s*\(`, "g");
        let m;
        while ((m = re.exec(cleaned))) {
            push(m[1], m.index);
        }
    }
    // setTimeout used as wait (soft) — page-level only via Promise + setTimeout patterns common in pptr scripts
    const sleepRe = /\b(?:new\s+Promise\s*\(\s*(?:resolve|r)\s*=>\s*setTimeout|await\s+new\s+Promise\s*\([^)]*setTimeout)/g;
    let sm;
    while ((sm = sleepRe.exec(cleaned))) {
        push("setTimeoutSleep", sm.index);
    }
    return { waits, count: waits.length };
}
export function lintPuppeteer(text) {
    const findings = [];
    const raw = text ?? "";
    if (!raw.trim()) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Source text is empty. Paste Puppeteer script JS/TS (e.g. puppeteer.launch(...) / browser.newPage() / page.goto(...) / page.click(...) / page.waitForSelector(...)).",
        });
        return findings;
    }
    const cleaned = stripComments(raw);
    const { pages } = listPages(cleaned);
    const { selectors } = listSelectors(cleaned);
    const { waits } = listWaits(cleaned);
    const hasPptr = /\bpuppeteer\b/.test(cleaned) ||
        /\brequire\s*\(\s*['"]puppeteer['"]\s*\)/.test(cleaned) ||
        /from\s+['"]puppeteer(?:-core)?['"]/.test(cleaned) ||
        pages.length > 0 ||
        selectors.length > 0 ||
        waits.length > 0 ||
        /\b(?:page|browser)\s*\.\s*[a-zA-Z$]/.test(cleaned);
    if (!hasPptr) {
        findings.push({
            severity: "warn",
            rule: "no_puppeteer_detected",
            advice: "No `puppeteer` import / `launch` / `newPage` / `page.*` patterns detected. Confirm this is Puppeteer script source (not Playwright — use a Playwright lab for that).",
        });
    }
    // waitForTimeout anti-pattern
    const wftCount = waits.filter((w) => w.kind === "waitForTimeout").length;
    const sleepCount = waits.filter((w) => w.kind === "setTimeoutSleep").length;
    if (wftCount + sleepCount >= 1) {
        findings.push({
            severity: "warn",
            rule: "waitForTimeout_antipattern",
            advice: `Found ${wftCount + sleepCount}× fixed-delay wait (\`waitForTimeout\` / \`setTimeout\` sleep). Prefer \`waitForSelector\` / \`waitForFunction\` / \`waitForNavigation\` / \`waitForNetworkIdle\` / response waits so scripts sync on conditions instead of arbitrary delays. Note: \`page.waitForTimeout\` was removed in recent Puppeteer versions.`,
        });
    }
    // missing close / browser.disconnect
    const launchCount = pages.filter((p) => p.action === "launch").length;
    const closeCount = pages.filter((p) => p.action === "close" || p.action === "disconnect").length;
    if (launchCount >= 1 && closeCount === 0) {
        findings.push({
            severity: "warn",
            rule: "missing_close_tip",
            advice: "`puppeteer.launch` (or equivalent) found without `browser.close()` / `page.close()` / `browser.disconnect()` in this text. Always close the browser (prefer `try/finally`) to avoid leaked Chromium processes — especially in CI and long-running scripts.",
        });
    }
    // networkidle tips
    const networkIdleInGoto = /waitUntil\s*:\s*['"`]networkidle[01]?['"`]/.test(cleaned);
    const hasWaitNetworkIdle = waits.some((w) => w.kind === "waitForNetworkIdle");
    const gotoCount = pages.filter((p) => p.action === "goto").length;
    if (gotoCount >= 1 && !networkIdleInGoto && !hasWaitNetworkIdle) {
        findings.push({
            severity: "info",
            rule: "networkidle_tip",
            advice: "`page.goto` without `waitUntil: 'networkidle0'|'networkidle2'` or `page.waitForNetworkIdle()`. For SPAs that keep connections open, prefer `domcontentloaded`/`load` plus a specific selector/response wait — `networkidle` can hang on long-polling sites.",
        });
    }
    if (networkIdleInGoto || hasWaitNetworkIdle) {
        findings.push({
            severity: "info",
            rule: "networkidle_hang_tip",
            advice: "`networkidle` / `waitForNetworkIdle` detected. On pages with websockets, analytics, or polling this can time out. Prefer waiting for a concrete selector, response, or `load`/`domcontentloaded` when idle is unreliable.",
        });
    }
    // headless defaults
    if (launchCount >= 1 &&
        !/\bheadless\s*:/.test(cleaned) &&
        !/\bheadless\s*\(/.test(cleaned)) {
        findings.push({
            severity: "info",
            rule: "headless_default_tip",
            advice: "`launch` without an explicit `headless` option. Puppeteer defaults changed across versions (`true` → `'new'` → shell). Set `headless: true` / `'new'` / `false` explicitly for reproducible CI vs local debugging.",
        });
    }
    // brittle CSS id/class selectors tip
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
    // page.$ without null check tip (soft) when many $ calls
    const dollarCount = selectors.filter((s) => s.api === "$").length;
    if (dollarCount >= 2 && !/\?\./.test(cleaned) && !/if\s*\(/.test(cleaned)) {
        findings.push({
            severity: "info",
            rule: "dollar_null_check_tip",
            advice: "Found " +
                String(dollarCount) +
                "× page.$() — $ returns null when missing. Prefer waitForSelector (throws/retries) or null-check before calling methods on the ElementHandle.",
        });
    }
    // no error handling around launch/goto
    if ((launchCount >= 1 || gotoCount >= 1) &&
        !/\btry\s*\{/.test(cleaned) &&
        !/\.catch\s*\(/.test(cleaned)) {
        findings.push({
            severity: "info",
            rule: "missing_try_finally_tip",
            advice: "Launch/goto without `try/catch` / `try/finally` in this text. Wrap navigation and always `browser.close()` in `finally` so failures still clean up the browser process.",
        });
    }
    // screenshot leftover / debugging
    if (/\b(?:\w+)\s*\.\s*(?:screenshot|pdf)\s*\(/.test(cleaned)) {
        findings.push({
            severity: "info",
            rule: "screenshot_pdf_tip",
            advice: "`page.screenshot` / `page.pdf` found — fine for debugging/artifacts; ensure output paths are intentional in CI and that you are not capturing sensitive page content into shared logs.",
        });
    }
    return findings;
}
