/**
 * Shared remix.config / vite remix({…}) text helpers.
 * Classic AppConfig + vitePlugin remix options — best-effort heuristics (no eval).
 * No remix binary, no network, no filesystem follow.
 */
export function asMap(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value;
    }
    return null;
}
export function stripJsonComments(text) {
    const src = text ?? "";
    let out = "";
    let i = 0;
    const n = src.length;
    let inString = false;
    let escape = false;
    while (i < n) {
        const ch = src[i];
        const next = i + 1 < n ? src[i + 1] : "";
        if (inString) {
            out += ch;
            if (escape) {
                escape = false;
            }
            else if (ch === "\\") {
                escape = true;
            }
            else if (ch === '"') {
                inString = false;
            }
            i++;
            continue;
        }
        if (ch === '"') {
            inString = true;
            out += ch;
            i++;
            continue;
        }
        if (ch === "/" && next === "/") {
            i += 2;
            while (i < n && src[i] !== "\n" && src[i] !== "\r")
                i++;
            continue;
        }
        if (ch === "/" && next === "*") {
            i += 2;
            while (i < n) {
                if (src[i] === "*" && i + 1 < n && src[i + 1] === "/") {
                    i += 2;
                    break;
                }
                i++;
            }
            continue;
        }
        out += ch;
        i++;
    }
    return out;
}
function looksLikeJs(text) {
    const t = text.trim();
    return (/\bmodule\.exports\b/.test(t) ||
        /\bexport\s+default\b/.test(t) ||
        /\bexports\./.test(t) ||
        /\brequire\s*\(/.test(t) ||
        /\bimport\s+/.test(t) ||
        /\bdefineConfig\s*\(/.test(t) ||
        /\bremix\s*\(/.test(t) ||
        /\bvitePlugin\b/.test(t) ||
        /\bsatisfies\b/.test(t));
}
export function extractBalanced(src, start) {
    if (start < 0 || start >= src.length)
        return null;
    const open = src[start];
    const close = open === "[" ? "]" : open === "{" ? "}" : null;
    if (!close)
        return null;
    let depth = 0;
    let inStr = null;
    let escape = false;
    for (let i = start; i < src.length; i++) {
        const ch = src[i];
        if (inStr) {
            if (escape) {
                escape = false;
            }
            else if (ch === "\\") {
                escape = true;
            }
            else if (ch === inStr) {
                inStr = null;
            }
            continue;
        }
        if (ch === '"' || ch === "'" || ch === "`") {
            inStr = ch;
            continue;
        }
        if (ch === open)
            depth++;
        else if (ch === close) {
            depth--;
            if (depth === 0)
                return src.slice(start, i + 1);
        }
    }
    return null;
}
function extractBalancedParen(src, start) {
    if (start < 0 || start >= src.length || src[start] !== "(")
        return null;
    let depth = 0;
    let inStr = null;
    let escape = false;
    for (let i = start; i < src.length; i++) {
        const ch = src[i];
        if (inStr) {
            if (escape) {
                escape = false;
            }
            else if (ch === "\\") {
                escape = true;
            }
            else if (ch === inStr) {
                inStr = null;
            }
            continue;
        }
        if (ch === '"' || ch === "'" || ch === "`") {
            inStr = ch;
            continue;
        }
        if (ch === "(")
            depth++;
        else if (ch === ")") {
            depth--;
            if (depth === 0)
                return src.slice(start, i + 1);
        }
    }
    return null;
}
function unescapeStr(s) {
    return s.replace(/\\(.)/g, "$1");
}
function firstStringInParens(par) {
    const m = /(["'`])((?:\\.|(?!\1).)*)\1/.exec(par);
    return m ? unescapeStr(m[2]) : undefined;
}
function heuristicObjectLiteral(objSrc) {
    const out = {};
    const body = objSrc.trim();
    if (!body.startsWith("{") || !body.endsWith("}"))
        return out;
    const inner = body.slice(1, -1);
    let i = 0;
    while (i < inner.length) {
        while (i < inner.length && /[\s,]/.test(inner[i]))
            i++;
        if (i >= inner.length)
            break;
        let key = "";
        const keyStr = /^(["'`])((?:\\.|(?!\1).)*)\1/.exec(inner.slice(i));
        if (keyStr) {
            key = unescapeStr(keyStr[2]);
            i += keyStr[0].length;
        }
        else {
            const bare = /^([A-Za-z_$][\w$]*)/.exec(inner.slice(i));
            if (!bare) {
                i++;
                continue;
            }
            key = bare[1];
            i += bare[0].length;
        }
        while (i < inner.length && /\s/.test(inner[i]))
            i++;
        if (inner[i] !== ":") {
            i++;
            continue;
        }
        i++;
        while (i < inner.length && /\s/.test(inner[i]))
            i++;
        if (i >= inner.length)
            break;
        const ch = inner[i];
        if (ch === "{" || ch === "[") {
            const bal = extractBalanced(inner, i);
            if (!bal) {
                i++;
                continue;
            }
            if (ch === "[") {
                out[key] = heuristicArrayLiteral(bal);
            }
            else {
                out[key] = heuristicObjectLiteral(bal);
            }
            i += bal.length;
            continue;
        }
        const strM = /^(["'`])((?:\\.|(?!\1).)*)\1/.exec(inner.slice(i));
        if (strM) {
            out[key] = unescapeStr(strM[2]);
            i += strM[0].length;
            continue;
        }
        const boolM = /^(true|false)\b/.exec(inner.slice(i));
        if (boolM) {
            out[key] = boolM[1] === "true";
            i += boolM[0].length;
            continue;
        }
        const numM = /^(-?\d+(?:\.\d+)?)\b/.exec(inner.slice(i));
        if (numM) {
            out[key] = Number(numM[1]);
            i += numM[0].length;
            continue;
        }
        if (/^null\b/.test(inner.slice(i))) {
            out[key] = null;
            i += 4;
            continue;
        }
        const callM = /^([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*\(/.exec(inner.slice(i));
        if (callM) {
            const name = callM[1];
            const parenStart = i + callM[0].length - 1;
            const par = extractBalancedParen(inner, parenStart);
            if (par) {
                if (name === "require") {
                    const req = firstStringInParens(par);
                    out[key] = req !== undefined ? req : { __call: name, __args: par };
                }
                else {
                    out[key] = { __call: name, __args: par };
                }
                i = parenStart + par.length;
                continue;
            }
        }
        const ident = /^([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)/.exec(inner.slice(i));
        if (ident) {
            out[key] = ident[0];
            i += ident[0].length;
            continue;
        }
        i++;
    }
    return out;
}
function heuristicArrayLiteral(arrSrc) {
    const body = arrSrc.trim();
    if (!body.startsWith("[") || !body.endsWith("]"))
        return [];
    const inner = body.slice(1, -1);
    const out = [];
    let i = 0;
    while (i < inner.length) {
        while (i < inner.length && /[\s,]/.test(inner[i]))
            i++;
        if (i >= inner.length)
            break;
        if (inner[i] === "{") {
            const bal = extractBalanced(inner, i);
            if (!bal)
                break;
            out.push(heuristicObjectLiteral(bal));
            i += bal.length;
            continue;
        }
        if (inner[i] === "[") {
            const bal = extractBalanced(inner, i);
            if (!bal)
                break;
            out.push(heuristicArrayLiteral(bal));
            i += bal.length;
            continue;
        }
        const strM = /^(["'`])((?:\\.|(?!\1).)*)\1/.exec(inner.slice(i));
        if (strM) {
            out.push(unescapeStr(strM[2]));
            i += strM[0].length;
            continue;
        }
        const boolM = /^(true|false)\b/.exec(inner.slice(i));
        if (boolM) {
            out.push(boolM[1] === "true");
            i += boolM[0].length;
            continue;
        }
        const numM = /^(-?\d+(?:\.\d+)?)\b/.exec(inner.slice(i));
        if (numM) {
            out.push(Number(numM[1]));
            i += numM[0].length;
            continue;
        }
        if (/^null\b/.test(inner.slice(i))) {
            out.push(null);
            i += 4;
            continue;
        }
        const reqM = /^require\s*\(\s*(["'`])((?:\\.|(?!\1).)*)\1\s*\)/.exec(inner.slice(i));
        if (reqM) {
            out.push(unescapeStr(reqM[2]));
            i += reqM[0].length;
            continue;
        }
        const callM = /^([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*\(/.exec(inner.slice(i));
        if (callM) {
            const name = callM[1];
            const parenStart = i + callM[0].length - 1;
            const par = extractBalancedParen(inner, parenStart);
            if (par) {
                out.push({ __call: name, __args: par });
                i = parenStart + par.length;
                continue;
            }
        }
        const ident = /^([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)/.exec(inner.slice(i));
        if (ident) {
            out.push(ident[1]);
            i += ident[0].length;
            continue;
        }
        i++;
    }
    return out;
}
function findExportObject(src) {
    const patterns = [
        /(?:module\.exports\s*=\s*|export\s+default\s*|exports\.default\s*=\s*)(?:defineConfig\s*\(\s*)?\{/,
        /(?:module\.exports\s*=\s*|export\s+default\s*)\([^)]*\)\s*=>\s*\(\s*\{/,
        /(?:module\.exports\s*=\s*|export\s+default\s*)\([^)]*\)\s*=>\s*\{/,
        /(?:module\.exports\s*=\s*|export\s+default\s*)function\s*\([^)]*\)\s*\{/,
        /\bdefineConfig\s*\(\s*\{/,
    ];
    for (const re of patterns) {
        const m = re.exec(src);
        if (!m)
            continue;
        const brace = src.indexOf("{", m.index + m[0].length - 1);
        if (brace < 0)
            continue;
        const bal = extractBalanced(src, brace);
        if (!bal)
            continue;
        if (/function\s*\(/.test(m[0]) || /=>\s*\{/.test(m[0])) {
            const ret = /\breturn\s*\{/.exec(bal);
            if (ret) {
                const inner = extractBalanced(bal, ret.index + ret[0].indexOf("{"));
                if (inner)
                    return inner;
            }
        }
        return bal;
    }
    return null;
}
/** Find remix({ … }) / vitePlugin({ … }) / remixVitePlugin({ … }) options object. */
function findRemixPluginOptions(src) {
    const patterns = [
        /\bvitePlugin\s*(?:as\s+\w+\s*)?(?:=\s*)?\b/,
        /\b(?:remix|vitePlugin|remixVitePlugin)\s*\(\s*\{/,
    ];
    // Direct call forms
    const callRe = /\b(?:remix|vitePlugin|remixVitePlugin)\s*\(\s*\{/g;
    let m;
    while ((m = callRe.exec(src)) !== null) {
        const brace = src.indexOf("{", m.index + m[0].length - 1);
        if (brace < 0)
            continue;
        const bal = extractBalanced(src, brace);
        if (bal)
            return bal;
    }
    // aliased: remix({…}) after import { vitePlugin as remix }
    void patterns;
    return null;
}
function pullArrayField(out, src, field) {
    if (out[field] !== undefined)
        return;
    const re = new RegExp(`\\b${field}\\s*:\\s*\\[`);
    const m = re.exec(src);
    if (!m)
        return;
    const bal = extractBalanced(src, m.index + m[0].indexOf("["));
    if (bal)
        out[field] = heuristicArrayLiteral(bal);
}
function pullObjectField(out, src, field) {
    if (out[field] !== undefined)
        return;
    const re = new RegExp(`\\b${field}\\s*:\\s*\\{`);
    const m = re.exec(src);
    if (!m)
        return;
    const bal = extractBalanced(src, m.index + m[0].indexOf("{"));
    if (bal)
        out[field] = heuristicObjectLiteral(bal);
}
function pullScalarField(out, src, field) {
    if (out[field] !== undefined)
        return;
    const strRe = new RegExp(`\\b${field}\\s*:\\s*(["'\`])((?:\\\\.|(?!\\1).)*)\\1`);
    const strM = strRe.exec(src);
    if (strM) {
        out[field] = unescapeStr(strM[2]);
        return;
    }
    const boolRe = new RegExp(`\\b${field}\\s*:\\s*(true|false)\\b`);
    const boolM = boolRe.exec(src);
    if (boolM) {
        out[field] = boolM[1] === "true";
        return;
    }
    const callRe = new RegExp(`\\b${field}\\s*:\\s*([A-Za-z_$][\\w$]*(?:\\.[A-Za-z_$][\\w$]*)*)\\s*\\(`);
    const callM = callRe.exec(src);
    if (callM) {
        const name = callM[1];
        const parenStart = callM.index + callM[0].length - 1;
        const par = extractBalancedParen(src, parenStart);
        if (par) {
            if (name === "require") {
                const req = firstStringInParens(par);
                out[field] = req !== undefined ? req : { __call: name, __args: par };
            }
            else {
                out[field] = { __call: name, __args: par };
            }
        }
    }
}
const REMIX_SCALAR_FIELDS = [
    "appDirectory",
    "assetsBuildDirectory",
    "publicPath",
    "serverBuildPath",
    "serverModuleFormat",
    "serverPlatform",
    "server",
    "serverBuildTarget",
    "serverBuildDirectory",
    "browserBuildDirectory",
    "devServerPort",
    "devServerBroadcastDelay",
];
const REMIX_ARRAY_FIELDS = ["ignoredRouteFiles", "watchPaths"];
const REMIX_OBJECT_FIELDS = ["future", "serverDependenciesToBundle"];
function pullRemixFields(out, src) {
    for (const f of REMIX_SCALAR_FIELDS)
        pullScalarField(out, src, f);
    for (const f of REMIX_ARRAY_FIELDS)
        pullArrayField(out, src, f);
    for (const f of REMIX_OBJECT_FIELDS)
        pullObjectField(out, src, f);
    // routes can be a function or string path — capture string or mark as function
    if (out.routes === undefined) {
        const strRe = /\broutes\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(src);
        if (strRe) {
            out.routes = unescapeStr(strRe[2]);
        }
        else if (/\broutes\s*[:=]\s*(?:async\s*)?(?:function\b|\()/.test(src)) {
            out.routes = { __call: "routes", __args: "(function)" };
        }
        else if (/\broutes\s*\(/.test(src)) {
            // vite remix({ routes(defineRoutes) {…} }) method shorthand
            out.routes = { __call: "routes", __args: "(method)" };
        }
    }
}
function detectFlavor(src, fromPlugin) {
    if (fromPlugin)
        return "vite-plugin";
    if (/\b@remix-run\/dev\b/.test(src) &&
        /\b(?:vitePlugin|remixVitePlugin)\b/.test(src)) {
        return "vite-plugin";
    }
    if (/\bdefineConfig\b/.test(src) && /\bremix\s*\(/.test(src)) {
        return "vite-plugin";
    }
    if (/\bAppConfig\b/.test(src) ||
        /\bignoredRouteFiles\b/.test(src) ||
        /\bserverBuildPath\b/.test(src) ||
        /\bserverBuildTarget\b/.test(src) ||
        /\breremix\.config\b/i.test(src) ||
        /\bmodule\.exports\b/.test(src)) {
        // classic if it looks like remix.config without vite plugin call as primary
        if (/\b(?:remix|vitePlugin|remixVitePlugin)\s*\(\s*\{/.test(src)) {
            return "vite-plugin";
        }
        return "classic";
    }
    if (/\b(?:remix|vitePlugin|remixVitePlugin)\s*\(\s*\{/.test(src)) {
        return "vite-plugin";
    }
    return "unknown";
}
function isRemixish(map) {
    return (map.appDirectory !== undefined ||
        map.ignoredRouteFiles !== undefined ||
        map.assetsBuildDirectory !== undefined ||
        map.publicPath !== undefined ||
        map.serverBuildPath !== undefined ||
        map.serverModuleFormat !== undefined ||
        map.serverPlatform !== undefined ||
        map.server !== undefined ||
        map.serverBuildTarget !== undefined ||
        map.future !== undefined ||
        map.routes !== undefined ||
        map.watchPaths !== undefined);
}
export function heuristicExtractJs(text) {
    const src = text ?? "";
    let out = {};
    let fromPlugin = false;
    // Prefer vite remix({…}) options when present
    const pluginOpts = findRemixPluginOptions(src);
    if (pluginOpts && pluginOpts.startsWith("{")) {
        out = { ...heuristicObjectLiteral(pluginOpts) };
        fromPlugin = true;
        pullRemixFields(out, pluginOpts);
    }
    // Also try classic export / defineConfig root
    const exported = findExportObject(src);
    if (exported && exported.startsWith("{")) {
        const root = heuristicObjectLiteral(exported);
        // If root looks like vite config (has plugins), don't treat whole as remix
        if (fromPlugin || root.plugins !== undefined) {
            // merge only remix-ish keys missing from plugin extract
            if (!fromPlugin && isRemixish(root)) {
                out = { ...root, ...out };
            }
        }
        else if (isRemixish(root) || Object.keys(out).length === 0) {
            out = { ...root, ...out };
        }
    }
    // Fallback: pull remix fields from whole source
    pullRemixFields(out, src);
    return { out, fromPlugin };
}
export function parseRemixConfigText(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed) {
        return { raw: null, format: "empty", source: text ?? "" };
    }
    {
        const stripped = stripJsonComments(trimmed);
        try {
            const raw = JSON.parse(stripped);
            const map0 = asMap(raw);
            if (map0) {
                return {
                    raw: map0,
                    format: "jsonc",
                    source: trimmed,
                    flavor: isRemixish(map0) ? "classic" : "unknown",
                };
            }
            return {
                raw: null,
                format: "jsonc",
                parseError: "remix config root must be a JSON object",
                source: trimmed,
            };
        }
        catch {
            // fall through
        }
    }
    if (looksLikeJs(trimmed) ||
        /\bappDirectory\s*:/.test(trimmed) ||
        /\bignoredRouteFiles\s*:/.test(trimmed) ||
        /\bfuture\s*:/.test(trimmed) ||
        /\bserverBuildPath\s*:/.test(trimmed) ||
        /\bremix\s*\(/.test(trimmed) ||
        /\bvitePlugin\b/.test(trimmed)) {
        const { out: extracted, fromPlugin } = heuristicExtractJs(trimmed);
        const flavor = detectFlavor(trimmed, fromPlugin);
        if (extracted &&
            (isRemixish(extracted) || Object.keys(extracted).length > 0)) {
            return {
                raw: extracted,
                format: "js-heuristic",
                heuristic: true,
                source: trimmed,
                flavor,
            };
        }
        return {
            raw: null,
            format: "js-heuristic",
            parseError: "JS config heuristics found no remix options (limits: no eval; regex extraction only)",
            heuristic: true,
            source: trimmed,
            flavor,
        };
    }
    return {
        raw: null,
        format: "unknown",
        parseError: "Unrecognized remix config text",
        source: trimmed,
    };
}
function stringOrUndef(v) {
    if (typeof v === "string") {
        const t = v.trim();
        return t || undefined;
    }
    return undefined;
}
function routesHintValue(v) {
    if (typeof v === "string")
        return v;
    const map = asMap(v);
    if (map && typeof map.__call === "string") {
        return `(${map.__call} function)`;
    }
    return undefined;
}
function stringArray(v) {
    if (!Array.isArray(v))
        return undefined;
    const out = [];
    for (const item of v) {
        if (typeof item === "string" && item.trim())
            out.push(item.trim());
    }
    return out.length ? out : [];
}
export function extractRoutesHint(raw, source) {
    const result = {};
    if (raw) {
        const app = stringOrUndef(raw.appDirectory);
        if (app)
            result.appDirectory = app;
        const routes = routesHintValue(raw.routes);
        if (routes)
            result.routes = routes;
        const ignored = stringArray(raw.ignoredRouteFiles);
        if (ignored)
            result.ignoredRouteFiles = ignored;
        const assets = stringOrUndef(raw.assetsBuildDirectory);
        if (assets)
            result.assetsBuildDirectory = assets;
        const pub = stringOrUndef(raw.publicPath);
        if (pub)
            result.publicPath = pub;
    }
    if (source) {
        if (result.appDirectory === undefined) {
            const m = /\bappDirectory\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(source);
            if (m)
                result.appDirectory = unescapeStr(m[2]);
        }
        if (result.assetsBuildDirectory === undefined) {
            const m = /\bassetsBuildDirectory\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(source);
            if (m)
                result.assetsBuildDirectory = unescapeStr(m[2]);
        }
        if (result.publicPath === undefined) {
            const m = /\bpublicPath\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(source);
            if (m)
                result.publicPath = unescapeStr(m[2]);
        }
        if (result.ignoredRouteFiles === undefined) {
            const m = /\bignoredRouteFiles\s*:\s*\[/.exec(source);
            if (m) {
                const bal = extractBalanced(source, m.index + m[0].indexOf("["));
                if (bal) {
                    const arr = heuristicArrayLiteral(bal);
                    result.ignoredRouteFiles = arr.filter((x) => typeof x === "string");
                }
            }
        }
        if (result.routes === undefined) {
            const strM = /\broutes\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(source);
            if (strM)
                result.routes = unescapeStr(strM[2]);
            else if (/\broutes\s*[:=]\s*(?:async\s*)?(?:function\b|\()/.test(source) ||
                /\broutes\s*\(/.test(source)) {
                result.routes = "(routes function)";
            }
        }
    }
    return result;
}
export function extractServerBuildHint(raw, source) {
    const result = {};
    if (raw) {
        const path = stringOrUndef(raw.serverBuildPath);
        if (path)
            result.serverBuildPath = path;
        const fmt = stringOrUndef(raw.serverModuleFormat);
        if (fmt)
            result.serverModuleFormat = fmt;
        const plat = stringOrUndef(raw.serverPlatform);
        if (plat)
            result.serverPlatform = plat;
        // server can be string path or require/call
        const serverStr = stringOrUndef(raw.server);
        if (serverStr)
            result.server = serverStr;
        else {
            const map = asMap(raw.server);
            if (map && typeof map.__call === "string") {
                if (map.__call === "require" && typeof map.__args === "string") {
                    const s = firstStringInParens(map.__args);
                    if (s)
                        result.server = s;
                }
                else {
                    result.server = map.__call;
                }
            }
        }
        const target = stringOrUndef(raw.serverBuildTarget);
        if (target)
            result.serverBuildTarget = target;
    }
    if (source) {
        if (result.serverBuildPath === undefined) {
            const m = /\bserverBuildPath\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(source);
            if (m)
                result.serverBuildPath = unescapeStr(m[2]);
        }
        if (result.serverModuleFormat === undefined) {
            const m = /\bserverModuleFormat\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(source);
            if (m)
                result.serverModuleFormat = unescapeStr(m[2]);
        }
        if (result.serverPlatform === undefined) {
            const m = /\bserverPlatform\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(source);
            if (m)
                result.serverPlatform = unescapeStr(m[2]);
        }
        if (result.serverBuildTarget === undefined) {
            const m = /\bserverBuildTarget\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(source);
            if (m)
                result.serverBuildTarget = unescapeStr(m[2]);
        }
        if (result.server === undefined) {
            const strM = /\bserver\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(source);
            if (strM)
                result.server = unescapeStr(strM[2]);
            else {
                const reqM = /\bserver\s*:\s*require\s*\(\s*(["'`])((?:\\.|(?!\1).)*)\1\s*\)/.exec(source);
                if (reqM)
                    result.server = unescapeStr(reqM[2]);
            }
        }
    }
    return result;
}
export function extractFutureFlags(raw, source) {
    let futureMap = raw ? asMap(raw.future) : null;
    if (!futureMap && source) {
        const m = /\bfuture\s*:\s*\{/.exec(source);
        if (m) {
            const bal = extractBalanced(source, m.index + m[0].indexOf("{"));
            if (bal)
                futureMap = heuristicObjectLiteral(bal);
        }
    }
    if (!futureMap) {
        return { future: {}, keys: [] };
    }
    const future = {};
    const keys = [];
    for (const [k, v] of Object.entries(futureMap)) {
        if (k.startsWith("__"))
            continue;
        keys.push(k);
        future[k] = v;
    }
    return { future, keys };
}
export function lintRemixConfig(raw, parseError, format, source, flavor) {
    const findings = [];
    if (parseError) {
        findings.push({
            severity: "error",
            rule: "invalid_config",
            advice: `Could not parse remix config: ${parseError}`,
        });
        return findings;
    }
    if (!raw) {
        findings.push({
            severity: "info",
            rule: "empty_config",
            advice: "No remix config content provided (empty input).",
        });
        return findings;
    }
    const keys = Object.keys(raw).filter((k) => !k.startsWith("__"));
    if (keys.length === 0) {
        findings.push({
            severity: "info",
            rule: "empty_config",
            advice: "Parsed config object is empty — no remix options detected.",
        });
        return findings;
    }
    if (format === "js-heuristic") {
        findings.push({
            severity: "info",
            rule: "js_heuristic_limits",
            advice: "JS/TS remix.config / vite remix({…}) was parsed with best-effort string heuristics (no eval). Nested spreads, computed keys, dynamic imports, env branches, and function-returned configs are not fully resolved — verify critical values manually.",
        });
    }
    const routes = extractRoutesHint(raw, source);
    const server = extractServerBuildHint(raw, source);
    const future = extractFutureFlags(raw, source);
    const src = source ?? "";
    // Classic remix.config.js is deprecated in favor of Vite plugin
    const looksClassicFile = flavor === "classic" ||
        /\bserverBuildTarget\b/.test(src) ||
        (/\bmodule\.exports\b/.test(src) &&
            /\bignoredRouteFiles\b/.test(src) &&
            !/\b(?:vitePlugin|remixVitePlugin)\b/.test(src) &&
            !/\bdefineConfig\b/.test(src));
    if (looksClassicFile && flavor !== "vite-plugin") {
        findings.push({
            severity: "warn",
            rule: "deprecated_remix_config",
            advice: "Classic remix.config.js / AppConfig is legacy — Remix Vite (`@remix-run/dev` vitePlugin / remix()) is the supported path. Migrate server/build options into vite.config and the remix() plugin options.",
        });
    }
    if (flavor === "vite-plugin" && server.serverBuildTarget) {
        findings.push({
            severity: "warn",
            rule: "conflicting_classic_server_target",
            advice: "serverBuildTarget is a classic remix.config field and is generally unused with the Vite remix plugin. Remove it or confirm you are not mixing Classic Compiler + Vite configs.",
        });
    }
    if (server.serverBuildTarget &&
        (server.serverModuleFormat || server.serverPlatform) &&
        flavor !== "vite-plugin") {
        findings.push({
            severity: "info",
            rule: "classic_server_fields",
            advice: "Both serverBuildTarget and serverModuleFormat/serverPlatform appear — in classic Remix, prefer one style for your Remix major; targets like \"node-cjs\" / \"vercel\" overlap with module format settings.",
        });
    }
    // Missing appDirectory tip when other route-ish options present
    if (routes.appDirectory === undefined &&
        (routes.ignoredRouteFiles !== undefined ||
            routes.routes !== undefined ||
            /\bignoredRouteFiles\b/.test(src) ||
            /\broutes\s*[:(]/.test(src))) {
        findings.push({
            severity: "info",
            rule: "missing_app_directory",
            advice: "No appDirectory detected — Remix defaults to \"app\". Set appDirectory explicitly if your routes live elsewhere (e.g. \"src\").",
        });
    }
    // Conflicting future flags — v2_* and v3_* mixed without clarity
    const futureKeys = future.keys;
    const hasV2 = futureKeys.some((k) => /^v2_/.test(k));
    const hasV3 = futureKeys.some((k) => /^v3_/.test(k));
    if (hasV2 && hasV3) {
        findings.push({
            severity: "warn",
            rule: "conflicting_future_flags",
            advice: "Both v2_* and v3_* future flags are present. After upgrading past Remix v2, drop obsolete v2_* flags; keep only flags documented for your Remix major.",
        });
    }
    // All-false future block
    if (futureKeys.length > 0 &&
        futureKeys.every((k) => future.future[k] === false)) {
        findings.push({
            severity: "info",
            rule: "future_all_false",
            advice: "future flags are all false — either enable intended flags or remove the future block to reduce noise.",
        });
    }
    if (server.serverModuleFormat &&
        !["esm", "cjs"].includes(server.serverModuleFormat)) {
        findings.push({
            severity: "warn",
            rule: "server_module_format_value",
            advice: `Unusual serverModuleFormat "${server.serverModuleFormat}" — expected "esm" | "cjs".`,
        });
    }
    if (server.serverPlatform &&
        !["node", "neutral"].includes(server.serverPlatform)) {
        findings.push({
            severity: "warn",
            rule: "server_platform_value",
            advice: `Unusual serverPlatform "${server.serverPlatform}" — expected "node" | "neutral".`,
        });
    }
    if (routes.publicPath &&
        !routes.publicPath.startsWith("/") &&
        !/^https?:\/\//.test(routes.publicPath)) {
        findings.push({
            severity: "info",
            rule: "public_path_slash",
            advice: 'publicPath usually starts with "/" (e.g. "/build/"). Confirm this value matches how assets are served.',
        });
    }
    return findings;
}
