/**
 * Best-effort Testing Library JS/TS text heuristics.
 * No DOM / @testing-library runtime, no network, no filesystem follow, no eval / no TS AST.
 */
const VARIANT_PREFIXES = [
    { prefix: "getAll", variant: "getAll" },
    { prefix: "queryAll", variant: "queryAll" },
    { prefix: "findAll", variant: "findAll" },
    { prefix: "get", variant: "get" },
    { prefix: "query", variant: "query" },
    { prefix: "find", variant: "find" },
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
function countOccurrences(text, re) {
    let n = 0;
    const r = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    while (r.exec(text))
        n++;
    return n;
}
function parseQueryName(full) {
    for (const { prefix, variant } of VARIANT_PREFIXES) {
        if (full.startsWith(prefix) && full.length > prefix.length) {
            const rest = full.slice(prefix.length);
            if (rest.startsWith("By") || rest.startsWith("AllBy")) {
                return { name: full, variant };
            }
            // getByRole style: prefix already includes get/query/find
            if (/^By[A-Z]/.test(rest)) {
                return { name: full, variant };
            }
        }
    }
    // Fallback: detect variant from leading getAll/get/queryAll/query/findAll/find
    for (const { prefix, variant } of VARIANT_PREFIXES) {
        if (full.startsWith(prefix)) {
            return { name: full, variant };
        }
    }
    return { name: full };
}
/**
 * List Testing Library queries from screen.*, within.*, destructured render helpers,
 * and bare getBy / queryBy / findBy calls.
 */
export function listQueries(text) {
    const cleaned = stripComments(text ?? "");
    const queries = [];
    const seen = new Set();
    const push = (info, index) => {
        const key = `${info.name}|${info.variant ?? ""}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        queries.push(info);
    };
    // screen.getByRole( / within(...).getByText( / container.getBy...
    const dottedRe = /\b(?:screen|within\s*\([^)]*\)|container|utils|queries)\s*\.\s*((?:getAll|queryAll|findAll|get|query|find)By[A-Za-z]+)\s*(?:<[^>]*>)?\s*\(/g;
    let m;
    while ((m = dottedRe.exec(cleaned))) {
        push(parseQueryName(m[1]), m.index);
    }
    // Destructured: const { getByRole, findByText } = render(...)
    // Also: const { getByText } = screen / within(...)
    const destructureRe = /(?:const|let|var)\s*\{([^}]+)\}\s*=\s*(?:await\s+)?(?:render|screen|within)\s*(?:\(|\.|$)/g;
    while ((m = destructureRe.exec(cleaned))) {
        const parts = m[1].split(",");
        for (const part of parts) {
            const p = part.trim();
            if (!p)
                continue;
            const asM = p.match(/^([A-Za-z_][A-Za-z0-9_]*)\s+as\s+([A-Za-z_][A-Za-z0-9_]*)$/);
            const orig = asM ? asM[1] : p.match(/^([A-Za-z_][A-Za-z0-9_]*)$/)?.[1];
            if (!orig)
                continue;
            if (/^(?:getAll|queryAll|findAll|get|query|find)By[A-Za-z]+$/.test(orig)) {
                push(parseQueryName(orig), m.index);
            }
        }
    }
    // Bare calls: getByRole( / findByText( — not already counted as dotted
    // Avoid matching screen.getByRole twice by requiring no leading "."
    const bareRe = /(?<![\w.])((?:getAll|queryAll|findAll|get|query|find)By[A-Za-z]+)\s*(?:<[^>]*>)?\s*\(/g;
    while ((m = bareRe.exec(cleaned))) {
        // Skip if preceded by screen./within(...)./container. — already matched
        const before = cleaned.slice(Math.max(0, m.index - 40), m.index);
        if (/\b(?:screen|container|utils|queries)\s*\.\s*$/.test(before) ||
            /within\s*\([^)]*\)\s*\.\s*$/.test(before)) {
            continue;
        }
        push(parseQueryName(m[1]), m.index);
    }
    return { queries, count: queries.length };
}
/**
 * List events from userEvent.* / fireEvent.*
 */
export function listEvents(text) {
    const cleaned = stripComments(text ?? "");
    const events = [];
    const seen = new Set();
    const push = (kind, index) => {
        const key = `${kind}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        events.push({ kind });
    };
    // userEvent.click( / userEvent.type( / await user.click( after setup
    // Also: const user = userEvent.setup(); user.click(...)
    const ueDirect = /\buserEvent\s*\.\s*(setup|[A-Za-z_][A-Za-z0-9_]*)\s*(?:\(|$)/g;
    let m;
    while ((m = ueDirect.exec(cleaned))) {
        const method = m[1];
        push(method === "setup" ? "userEvent.setup" : `userEvent.${method}`, m.index);
    }
    // fireEvent.click( / fireEvent.change(
    const feRe = /\bfireEvent\s*\.\s*([A-Za-z_][A-Za-z0-9_]*)\s*\(/g;
    while ((m = feRe.exec(cleaned))) {
        push(`fireEvent.${m[1]}`, m.index);
    }
    // Heuristic: const user = userEvent.setup(); then user.click / user.type
    // Only count if userEvent.setup appears and later user.<method>(
    if (/\buserEvent\s*\.\s*setup\s*\(/.test(cleaned)) {
        // Collect identifiers assigned from userEvent.setup
        const assignRe = /(?:const|let|var)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(?:await\s+)?userEvent\s*\.\s*setup\s*\(/g;
        const userIds = new Set();
        while ((m = assignRe.exec(cleaned))) {
            userIds.add(m[1]);
        }
        // Also: const user = await userEvent.setup()
        if (userIds.size === 0) {
            // default common name "user" when setup present
            if (/\buser\s*\.\s*[a-z]/.test(cleaned))
                userIds.add("user");
        }
        for (const id of userIds) {
            const esc = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const callRe = new RegExp(`\\b${esc}\\s*\\.\\s*([A-Za-z_][A-Za-z0-9_]*)\\s*\\(`, "g");
            while ((m = callRe.exec(cleaned))) {
                const method = m[1];
                // skip obvious non-event props
                if (["setup", "then", "catch", "finally"].includes(method))
                    continue;
                push(`user.${method}`, m.index);
            }
        }
    }
    return { events, count: events.length };
}
/**
 * List waits: waitFor / waitForElementToBeRemoved / findBy* (as wait kind)
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
    const patterns = [
        { re: /\bwaitForElementToBeRemoved\s*(?:<[^>]*>)?\s*\(/g, kind: "waitForElementToBeRemoved" },
        { re: /\bwaitFor\s*(?:<[^>]*>)?\s*\(/g, kind: "waitFor" },
        { re: /\bwait\s*(?:<[^>]*>)?\s*\(/g, kind: "wait" }, // @testing-library/dom wait alias (rare)
    ];
    for (const { re, kind } of patterns) {
        let m;
        const r = new RegExp(re.source, "g");
        while ((m = r.exec(cleaned))) {
            // avoid counting waitForElementToBeRemoved as waitFor
            if (kind === "waitFor") {
                const slice = cleaned.slice(m.index, m.index + 40);
                if (slice.startsWith("waitForElementToBeRemoved"))
                    continue;
            }
            if (kind === "wait") {
                const slice = cleaned.slice(m.index, m.index + 20);
                if (slice.startsWith("waitFor"))
                    continue;
            }
            push(typeof kind === "function" ? kind(m) : kind, m.index);
        }
    }
    // findBy* / findAllBy* — each call is an implicit wait
    const findRe = /\b(?:screen\s*\.\s*|within\s*\([^)]*\)\s*\.\s*|container\s*\.\s*)?((?:findAll|find)By[A-Za-z]+)\s*(?:<[^>]*>)?\s*\(/g;
    let m;
    while ((m = findRe.exec(cleaned))) {
        push("findBy", m.index);
    }
    // Also bare findBy from destructure usage already covered by findRe with optional prefix
    return { waits, count: waits.length };
}
export function lintTestingLibrary(text) {
    const findings = [];
    const raw = text ?? "";
    if (!raw.trim()) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Source text is empty. Paste Testing Library JS/TS (e.g. screen.getByRole(...) / userEvent.click(...) / waitFor(...) / render(...)).",
        });
        return findings;
    }
    const cleaned = stripComments(raw);
    const { queries } = listQueries(cleaned);
    const { events } = listEvents(cleaned);
    const { waits } = listWaits(cleaned);
    const hasTl = /@testing-library\//.test(cleaned) ||
        /\bscreen\s*\./.test(cleaned) ||
        /\brender\s*\(/.test(cleaned) ||
        /\buserEvent\b/.test(cleaned) ||
        /\bfireEvent\b/.test(cleaned) ||
        /\bwaitFor\b/.test(cleaned) ||
        queries.length > 0 ||
        events.length > 0 ||
        waits.length > 0;
    if (!hasTl) {
        findings.push({
            severity: "warn",
            rule: "no_testing_library_detected",
            advice: "No `screen.` / `render(` / `getBy*` / `userEvent` / `fireEvent` / `waitFor` / `@testing-library/*` patterns detected. Confirm this is Testing Library test source.",
        });
    }
    // getBy* in async without findBy/waitFor tip
    const hasAsync = /\basync\s+(?:function\b|\()/.test(cleaned) ||
        /\bit\s*\(\s*(['"`])[^'"`]*\1\s*,\s*async\b/.test(cleaned) ||
        /\btest\s*\(\s*(['"`])[^'"`]*\1\s*,\s*async\b/.test(cleaned) ||
        /\bawait\s+/.test(cleaned);
    const getQueries = queries.filter((q) => q.variant === "get" || q.variant === "getAll");
    const hasFindOrWait = waits.some((w) => w.kind === "waitFor" || w.kind === "findBy" || w.kind === "waitForElementToBeRemoved") ||
        queries.some((q) => q.variant === "find" || q.variant === "findAll");
    if (hasAsync && getQueries.length >= 1 && !hasFindOrWait) {
        findings.push({
            severity: "warn",
            rule: "getBy_in_async_without_findBy_waitFor_tip",
            advice: "Async test uses `getBy*` / `getAllBy*` without `findBy*` / `waitFor` / `waitForElementToBeRemoved` in this text. Prefer `findBy*` or `await waitFor(...)` for UI that appears after async work; `getBy*` asserts immediate presence only.",
        });
    }
    // Container / document.querySelector overuse vs role/text queries
    const containerQueryCount = countOccurrences(cleaned, /\bcontainer\s*\.\s*(?:querySelector|querySelectorAll|getElementsBy)\s*\(/g) +
        countOccurrences(cleaned, /\bdocument\s*\.\s*(?:querySelector|querySelectorAll|getElementById)\s*\(/g) +
        countOccurrences(cleaned, /\.querySelector(?:All)?\s*\(/g);
    const semanticQueryCount = queries.filter((q) => /By(?:Role|LabelText|PlaceholderText|Text|DisplayValue|AltText|Title)\b/.test(q.name)).length;
    const testIdCount = queries.filter((q) => /ByTestId\b/.test(q.name)).length;
    if (containerQueryCount >= 2 && semanticQueryCount === 0) {
        findings.push({
            severity: "warn",
            rule: "container_queries_overuse",
            advice: "Multiple `container.querySelector` / `document.querySelector` uses without semantic Testing Library queries (`getByRole` / `getByLabelText` / `getByText`, etc.). Prefer accessible queries so tests mirror how users find UI.",
        });
    }
    if (testIdCount >= 3 && semanticQueryCount === 0) {
        findings.push({
            severity: "info",
            rule: "testid_over_semantic_tip",
            advice: `Found ${testIdCount}× ByTestId without role/label/text queries. Prefer \`getByRole\` / \`getByLabelText\` / \`getByText\` when the UI is accessible; reserve \`data-testid\` for cases without a good accessible query.`,
        });
    }
    // Missing cleanup tip
    const hasRender = /\brender\s*\(/.test(cleaned);
    const hasCleanup = /\bcleanup\s*\(/.test(cleaned) ||
        /\bafterEach\s*\([\s\S]{0,200}?cleanup\b/.test(cleaned) ||
        /@testing-library\/react(?:-native)?['"]/.test(cleaned); // RTL auto-cleanup in modern versions — still tip if many renders
    if (hasRender && !hasCleanup && countOccurrences(cleaned, /\brender\s*\(/g) >= 2) {
        findings.push({
            severity: "info",
            rule: "missing_cleanup_tip",
            advice: "Multiple `render(` calls without an explicit `cleanup()` / `afterEach(cleanup)` in this text. Modern `@testing-library/react` auto-cleans after each test; if you share a suite across environments or older versions, call `cleanup()` in `afterEach`.",
        });
    }
    // Prefer userEvent over fireEvent
    const fireCount = events.filter((e) => e.kind.startsWith("fireEvent.")).length;
    const userCount = events.filter((e) => e.kind.startsWith("userEvent.") ||
        e.kind.startsWith("user.") ||
        e.kind === "userEvent.setup").length;
    if (fireCount >= 1 && userCount === 0) {
        findings.push({
            severity: "info",
            rule: "prefer_userEvent_over_fireEvent",
            advice: "`fireEvent.*` found without `userEvent` in this text. Prefer `@testing-library/user-event` (`userEvent.setup()` then `user.click` / `user.type`) for interactions closer to real user behavior; keep `fireEvent` for low-level edge cases.",
        });
    }
    // Direct node access / .firstChild smells
    if (countOccurrences(cleaned, /\.firstChild\b|\.lastChild\b|\.children\s*\[/g) >=
        2 &&
        semanticQueryCount === 0) {
        findings.push({
            severity: "info",
            rule: "dom_traversal_over_queries_tip",
            advice: "DOM traversal (`.firstChild` / `.children[...]`) without semantic queries. Prefer Testing Library queries so refactors to markup are less brittle.",
        });
    }
    // queryBy used for presence assertion tip (should often be getBy)
    const queryVariantCount = queries.filter((q) => q.variant === "query" || q.variant === "queryAll").length;
    if (queryVariantCount >= 2 && getQueries.length === 0) {
        findings.push({
            severity: "info",
            rule: "queryBy_without_getBy_tip",
            advice: "Several `queryBy*` / `queryAllBy*` uses and no `getBy*`. Use `getBy*` when the element must be present (better failure messages); reserve `queryBy*` for asserting absence (`expect(...).not.toBeInTheDocument()`).",
        });
    }
    return findings;
}
