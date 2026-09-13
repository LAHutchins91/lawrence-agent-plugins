/**
 * Best-effort MSW handler JS/TS text heuristics.
 * No msw runtime, no network, no filesystem follow, no eval / no TS AST.
 */
const HTTP_METHODS = "get|post|put|patch|delete|head|options|all";
const REST_METHODS = HTTP_METHODS;
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
function firstArgPath(args) {
    const trimmed = args.trim();
    if (!trimmed)
        return undefined;
    // string / template literal first arg
    if (trimmed[0] === "'" || trimmed[0] === '"' || trimmed[0] === "`") {
        const q = trimmed[0];
        let i = 1;
        let out = "";
        while (i < trimmed.length) {
            const c = trimmed[i];
            if (c === "\\" && i + 1 < trimmed.length) {
                out += trimmed[i + 1];
                i += 2;
                continue;
            }
            if (c === q)
                break;
            out += c;
            i++;
        }
        return out;
    }
    // RegExp literal: /path/
    if (trimmed[0] === "/") {
        let i = 1;
        while (i < trimmed.length) {
            if (trimmed[i] === "\\" && i + 1 < trimmed.length) {
                i += 2;
                continue;
            }
            if (trimmed[i] === "/") {
                return trimmed.slice(0, i + 1);
            }
            i++;
        }
    }
    // path.xxx or variable — skip
    return undefined;
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
/**
 * Detect http / rest / graphql namespace prefixes from msw imports.
 */
export function detectMswImports(cleaned) {
    const http = new Set();
    const rest = new Set();
    const graphql = new Set();
    const httpResponse = new Set();
    const setupWorker = new Set();
    const setupServer = new Set();
    const namedHandlers = new Map();
    // import { http, rest, graphql, HttpResponse, setupWorker, setupServer } from 'msw'
    // also from 'msw/node' / 'msw/browser' / 'msw/native'
    const namedImportRe = /import\s*\{([^}]+)\}\s*from\s*['"]msw(?:\/[^'"]*)?['"]/g;
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
            if (orig === "http")
                http.add(local);
            else if (orig === "rest")
                rest.add(local);
            else if (orig === "graphql")
                graphql.add(local);
            else if (orig === "HttpResponse")
                httpResponse.add(local);
            else if (orig === "setupWorker")
                setupWorker.add(local);
            else if (orig === "setupServer")
                setupServer.add(local);
            else if (/^(get|post|put|patch|delete|head|options|all)$/i.test(orig)) {
                namedHandlers.set(local, orig.toUpperCase());
            }
            else if (/^(query|mutation)$/i.test(orig)) {
                namedHandlers.set(local, orig.toUpperCase());
            }
        }
    }
    // import * as msw from 'msw' — rare; treat msw.http later via heuristic
    const starRe = /import\s*\*\s*as\s+([A-Za-z_][A-Za-z0-9_]*)\s*from\s*['"]msw(?:\/[^'"]*)?['"]/g;
    while ((m = starRe.exec(cleaned))) {
        // namespace.http / .rest / .graphql
        const ns = m[1];
        if (new RegExp(`\\b${ns}\\s*\\.\\s*http\\b`).test(cleaned))
            http.add(`${ns}.http`);
        if (new RegExp(`\\b${ns}\\s*\\.\\s*rest\\b`).test(cleaned))
            rest.add(`${ns}.rest`);
        if (new RegExp(`\\b${ns}\\s*\\.\\s*graphql\\b`).test(cleaned))
            graphql.add(`${ns}.graphql`);
    }
    // Heuristic fallbacks
    if (/\bhttp\s*\.\s*(?:get|post|put|patch|delete|head|options|all)\s*\(/.test(cleaned)) {
        http.add("http");
    }
    if (/\brest\s*\.\s*(?:get|post|put|patch|delete|head|options|all)\s*\(/.test(cleaned)) {
        rest.add("rest");
    }
    if (/\bgraphql\s*\.\s*(?:query|mutation|link|operation)\s*\(/.test(cleaned)) {
        graphql.add("graphql");
    }
    if (/\bHttpResponse\s*\./.test(cleaned) || /\bnew\s+HttpResponse\b/.test(cleaned)) {
        httpResponse.add("HttpResponse");
    }
    if (/\bsetupWorker\s*\(/.test(cleaned))
        setupWorker.add("setupWorker");
    if (/\bsetupServer\s*\(/.test(cleaned))
        setupServer.add("setupServer");
    if (http.size === 0 && /\bhttp\s*\./.test(cleaned))
        http.add("http");
    if (rest.size === 0 && /\brest\s*\./.test(cleaned))
        rest.add("rest");
    if (graphql.size === 0 && /\bgraphql\s*\./.test(cleaned))
        graphql.add("graphql");
    return {
        http: [...http],
        rest: [...rest],
        graphql: [...graphql],
        httpResponse: [...httpResponse],
        setupWorker: [...setupWorker],
        setupServer: [...setupServer],
        namedHandlers,
    };
}
function nsAlt(ns) {
    return ns
        .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|");
}
/**
 * List MSW handlers from http/rest/graphql method calls.
 */
export function listHandlers(text) {
    const cleaned = stripComments(text ?? "");
    const handlers = [];
    const seen = new Set();
    const imports = detectMswImports(cleaned);
    const push = (info, index) => {
        const key = `${info.method}|${info.path ?? ""}|${info.name ?? ""}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        handlers.push(info);
    };
    // http.get / rest.post etc.
    const httpNs = imports.http.length ? imports.http : ["http"];
    const restNs = imports.rest.length ? imports.rest : ["rest"];
    for (const [nsList, label] of [
        [httpNs, "http"],
        [restNs, "rest"],
    ]) {
        const alt = nsAlt(nsList);
        if (!alt)
            continue;
        // Only match if this ns actually appears (avoid false rest when only http)
        const present = label === "http"
            ? imports.http.length > 0 ||
                /\bhttp\s*\.\s*(?:get|post|put|patch|delete|head|options|all)\s*\(/.test(cleaned)
            : imports.rest.length > 0 ||
                /\brest\s*\.\s*(?:get|post|put|patch|delete|head|options|all)\s*\(/.test(cleaned);
        if (!present && label === "rest" && imports.rest.length === 0)
            continue;
        if (!present && label === "http" && imports.http.length === 0) {
            // still allow default http if patterns match below via regex
        }
        const re = new RegExp(`(?:${alt})\\s*\\.\\s*(${HTTP_METHODS})\\s*\\(`, "gi");
        let m;
        while ((m = re.exec(cleaned))) {
            const method = m[1].toUpperCase();
            const open = m.index + m[0].length - 1;
            const close = findMatchingParen(cleaned, open);
            if (close < 0)
                continue;
            const args = cleaned.slice(open + 1, close);
            const path = firstArgPath(args);
            const name = assignNameBefore(cleaned, m.index);
            const info = { method };
            if (path !== undefined)
                info.path = path;
            if (name)
                info.name = name;
            push(info, m.index);
        }
    }
    // graphql.query / graphql.mutation
    const gqlNs = imports.graphql.length ? imports.graphql : ["graphql"];
    const gqlAlt = nsAlt(gqlNs);
    if (gqlAlt &&
        (imports.graphql.length > 0 ||
            /\bgraphql\s*\.\s*(?:query|mutation|link|operation)\s*\(/.test(cleaned))) {
        const re = new RegExp(`(?:${gqlAlt})\\s*\\.\\s*(query|mutation|link|operation)\\s*\\(`, "gi");
        let m;
        while ((m = re.exec(cleaned))) {
            const method = m[1].toUpperCase();
            const open = m.index + m[0].length - 1;
            const close = findMatchingParen(cleaned, open);
            if (close < 0)
                continue;
            const args = cleaned.slice(open + 1, close);
            // first arg is often operation name string
            const opName = firstArgPath(args);
            const name = assignNameBefore(cleaned, m.index);
            const info = { method };
            if (opName !== undefined)
                info.path = opName;
            if (name)
                info.name = name;
            push(info, m.index);
        }
    }
    // Named handler imports used as get('/path', ...) — uncommon but possible
    for (const [local, method] of imports.namedHandlers) {
        const re = new RegExp(`\\b${local.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\(`, "g");
        let m;
        while ((m = re.exec(cleaned))) {
            const open = m.index + m[0].length - 1;
            const close = findMatchingParen(cleaned, open);
            if (close < 0)
                continue;
            const args = cleaned.slice(open + 1, close);
            const path = firstArgPath(args);
            const name = assignNameBefore(cleaned, m.index);
            const info = { method };
            if (path !== undefined)
                info.path = path;
            if (name)
                info.name = name;
            push(info, m.index);
        }
    }
    return { handlers, count: handlers.length };
}
/**
 * Count handlers by HTTP/GraphQL method.
 */
export function listMethods(text) {
    const { handlers } = listHandlers(text);
    const methods = {};
    for (const h of handlers) {
        const key = h.method.toUpperCase();
        methods[key] = (methods[key] ?? 0) + 1;
    }
    return { methods, total: handlers.length };
}
/**
 * Detect response fixtures: HttpResponse.json/text/xml/... and res(ctx.json(...)).
 */
export function listFixtures(text) {
    const cleaned = stripComments(text ?? "");
    const fixtures = [];
    const seen = new Set();
    const imports = detectMswImports(cleaned);
    const hrNs = imports.httpResponse.length
        ? imports.httpResponse
        : ["HttpResponse"];
    const hrAlt = nsAlt(hrNs);
    const push = (kind, on, index) => {
        const key = `${kind}|${on ?? ""}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        const info = { kind };
        if (on)
            info.on = on;
        fixtures.push(info);
    };
    // HttpResponse.json / .text / .xml / .html / .arrayBuffer / .formData / .error
    const hrKinds = "json|text|xml|html|arrayBuffer|formData|error|jsonp";
    if (hrAlt) {
        const re = new RegExp(`(?:${hrAlt})\\s*\\.\\s*(${hrKinds})\\s*\\(`, "gi");
        let m;
        while ((m = re.exec(cleaned))) {
            const rawKind = m[1];
            const kind = rawKind === "json"
                ? "Json"
                : rawKind === "text"
                    ? "Text"
                    : rawKind === "xml"
                        ? "Xml"
                        : rawKind === "html"
                            ? "Html"
                            : rawKind === "arrayBuffer"
                                ? "ArrayBuffer"
                                : rawKind === "formData"
                                    ? "FormData"
                                    : rawKind === "error"
                                        ? "Error"
                                        : rawKind.charAt(0).toUpperCase() + rawKind.slice(1);
            const on = assignNameBefore(cleaned, m.index);
            // Also try to find enclosing handler name by looking further back for const X = http.get
            let handlerOn = on;
            if (!handlerOn) {
                const before = cleaned.slice(Math.max(0, m.index - 400), m.index);
                const hm = before.match(/(?:export\s+)?(?:const|let|var)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(?:http|rest|graphql)\s*\.\s*(?:get|post|put|patch|delete|head|options|all|query|mutation)\s*\(/i);
                if (hm)
                    handlerOn = hm[1];
            }
            push(kind, handlerOn, m.index);
        }
        // new HttpResponse(...)
        const newRe = new RegExp(`\\bnew\\s+(?:${hrAlt})\\s*\\(`, "g");
        let nm;
        while ((nm = newRe.exec(cleaned))) {
            const on = assignNameBefore(cleaned, nm.index);
            push("HttpResponse", on, nm.index);
        }
    }
    // res(ctx.json(...)) / ctx.text / ctx.xml / ctx.html / ctx.body / ctx.status (MSW v1)
    const ctxKinds = "json|text|xml|html|body|status|cookie|set|delay|data|errors";
    const ctxRe = new RegExp(`\\bctx\\s*\\.\\s*(${ctxKinds})\\s*\\(`, "gi");
    let cm;
    while ((cm = ctxRe.exec(cleaned))) {
        const raw = cm[1].toLowerCase();
        const kind = raw === "json"
            ? "Json"
            : raw === "text"
                ? "Text"
                : raw === "xml"
                    ? "Xml"
                    : raw === "html"
                        ? "Html"
                        : raw === "body"
                            ? "Body"
                            : raw === "data"
                                ? "Data"
                                : raw === "errors"
                                    ? "Errors"
                                    : raw.charAt(0).toUpperCase() + raw.slice(1);
        const before = cleaned.slice(Math.max(0, cm.index - 400), cm.index);
        const hm = before.match(/(?:export\s+)?(?:const|let|var)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(?:http|rest|graphql)\s*\.\s*(?:get|post|put|patch|delete|head|options|all|query|mutation)\s*\(/i);
        push(kind, hm?.[1], cm.index);
    }
    // Also res(ctx...) pattern count as presence — already covered via ctx.*
    void REST_METHODS;
    return { fixtures, count: fixtures.length };
}
export function lintMsw(text) {
    const findings = [];
    const raw = text ?? "";
    if (!raw.trim()) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Source text is empty. Paste MSW handler JS/TS (e.g. http.get('/api', ...) or rest.post(...) / graphql.query(...)).",
        });
        return findings;
    }
    const cleaned = stripComments(raw);
    const imports = detectMswImports(cleaned);
    const { handlers } = listHandlers(cleaned);
    const { fixtures } = listFixtures(cleaned);
    const hasMsw = /from\s+['"]msw(?:\/[^'"]*)?['"]/.test(cleaned) ||
        /\bhttp\s*\.\s*(?:get|post|put|patch|delete|head|options|all)\s*\(/.test(cleaned) ||
        /\brest\s*\.\s*(?:get|post|put|patch|delete|head|options|all)\s*\(/.test(cleaned) ||
        /\bgraphql\s*\.\s*(?:query|mutation)\s*\(/.test(cleaned) ||
        /\bHttpResponse\b/.test(cleaned) ||
        /\bsetupWorker\s*\(/.test(cleaned) ||
        /\bsetupServer\s*\(/.test(cleaned) ||
        handlers.length > 0;
    if (!hasMsw) {
        findings.push({
            severity: "warn",
            rule: "no_msw_detected",
            advice: "No `http.get` / `rest.*` / `graphql.*` / `from 'msw'` patterns detected. Confirm this is MSW handler source.",
        });
    }
    // Missing setupWorker / setupServer tip when handlers exist
    const hasSetup = imports.setupWorker.length > 0 ||
        imports.setupServer.length > 0 ||
        /\bsetupWorker\s*\(/.test(cleaned) ||
        /\bsetupServer\s*\(/.test(cleaned);
    if (handlers.length >= 1 && !hasSetup) {
        findings.push({
            severity: "info",
            rule: "missing_setup_worker_server_tip",
            advice: "Handlers found without `setupWorker` / `setupServer` in this text. Wire them with `setupWorker(...handlers)` (browser) or `setupServer(...handlers)` (Node) and call `.listen()` / `.listen()` in tests.",
        });
    }
    // Wildcard path overuse: * or :param-heavy or RegExp-heavy
    let wildcards = 0;
    for (const h of handlers) {
        if (!h.path)
            continue;
        if (h.path.includes("*") ||
            h.path === "*" ||
            /\/:\w+/.test(h.path) ||
            h.path.startsWith("/") && h.path.includes("*") ||
            /^\/.*\/[gimsuy]*$/.test(h.path) // RegExp literal string form from firstArgPath
        ) {
            // count * and many params
            if (h.path.includes("*") || (h.path.match(/:\w+/g) || []).length >= 2) {
                wildcards++;
            }
            else if (h.path.startsWith("/") && h.path.endsWith("/") && h.path.length > 2) {
                // likely RegExp
                wildcards++;
            }
        }
    }
    // Also count '*' string paths
    const starPaths = handlers.filter((h) => h.path === "*" || (h.path && /\*/.test(h.path))).length;
    const wildcardTotal = Math.max(wildcards, starPaths);
    if (wildcardTotal >= 3) {
        findings.push({
            severity: "warn",
            rule: "wildcard_path_overuse",
            advice: `Found ${wildcardTotal} handlers with wildcard/\`*\`/multi-param paths. Prefer specific paths when possible so mocks do not shadow unintended routes; put catch-alls last.`,
        });
    }
    // Passthrough tips
    const passthroughCount = countOccurrences(cleaned, /\.passthrough\s*\(|\bpassthrough\s*\(/g);
    if (handlers.length >= 4 && passthroughCount === 0) {
        findings.push({
            severity: "info",
            rule: "passthrough_tip",
            advice: "Several handlers and no `.passthrough()`. For routes you do not mock, return `passthrough()` (or omit a catch-all) so real network requests can proceed in browser/Node.",
        });
    }
    if (passthroughCount >= 3) {
        findings.push({
            severity: "info",
            rule: "passthrough_overuse_tip",
            advice: `Found ${passthroughCount}× \`passthrough()\`. If most handlers only passthrough, consider removing them or narrowing which paths are registered.`,
        });
    }
    // rest.* usage tip (MSW v1 API)
    const restCount = countOccurrences(cleaned, /\brest\s*\.\s*(?:get|post|put|patch|delete|head|options|all)\s*\(/gi);
    if (restCount >= 1) {
        findings.push({
            severity: "info",
            rule: "rest_api_legacy_tip",
            advice: `Found ${restCount}× \`rest.*\` handler(s). MSW v2 prefers \`http.get/post/...\` + \`HttpResponse\`. Consider migrating when upgrading.`,
        });
    }
    // Handlers without obvious fixture / response
    if (handlers.length >= 2 && fixtures.length === 0 && passthroughCount === 0) {
        findings.push({
            severity: "info",
            rule: "missing_fixture_tip",
            advice: "Handlers found but no `HttpResponse.json/text/...` or `ctx.json/text/...` fixtures matched. Ensure resolvers return `HttpResponse.*` (v2) or `res(ctx.*)` (v1).",
        });
    }
    // GraphQL without operation name
    const gqlUnnamed = handlers.filter((h) => (h.method === "QUERY" || h.method === "MUTATION") &&
        (h.path === undefined || h.path === ""));
    if (gqlUnnamed.length >= 1) {
        findings.push({
            severity: "info",
            rule: "graphql_unnamed_operation_tip",
            advice: `Found ${gqlUnnamed.length} GraphQL handler(s) without a clear operation-name string as the first argument. Prefer \`graphql.query('OpName', ...)\` for precise matching.`,
        });
    }
    // bypass / onUnhandledRequest tip when setup present
    if (hasSetup &&
        !/onUnhandledRequest\s*:/.test(cleaned) &&
        handlers.length >= 1) {
        findings.push({
            severity: "info",
            rule: "on_unhandled_request_tip",
            advice: "`setupWorker` / `setupServer` without `onUnhandledRequest` in this text. Consider `{ onUnhandledRequest: 'bypass' | 'warn' | 'error' }` to control unmatched requests in tests.",
        });
    }
    return findings;
}
