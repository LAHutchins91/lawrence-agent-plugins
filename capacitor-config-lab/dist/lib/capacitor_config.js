/**
 * Shared capacitor.config JSON / JS / TS text helpers.
 * Best-effort heuristics (no eval). No capacitor binary, no network, no filesystem follow.
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
        /\bCapacitorConfig\b/.test(t) ||
        /\bsatisfies\b/.test(t) ||
        /\bprocess\.env\b/.test(t));
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
        const envM = /^process\.env(?:\.([A-Za-z_][\w]*)|\(\s*(["'`])((?:\\.|(?!\2).)*)\2\s*\)|\[\s*(["'`])((?:\\.|(?!\4).)*)\4\s*\])/.exec(inner.slice(i));
        if (envM) {
            const envKey = envM[1] || (envM[3] ? unescapeStr(envM[3]) : unescapeStr(envM[5] || ""));
            out[key] = { __env: envKey };
            i += envM[0].length;
            continue;
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
        /(?:const|let|var)\s+config\s*(?::\s*[^=]+)?=\s*\{/,
        /(?:module\.exports\s*=\s*|export\s+default\s*)\([^)]*\)\s*=>\s*\(\s*\{/,
        /(?:module\.exports\s*=\s*|export\s+default\s*)\([^)]*\)\s*=>\s*\{/,
        /(?:module\.exports\s*=\s*|export\s+default\s*)(?:async\s+)?function\s*\([^)]*\)\s*\{/,
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
    }
}
const CAP_SCALAR_FIELDS = [
    "appId",
    "appName",
    "webDir",
    "bundledWebRuntime",
    "androidScheme",
    "iosScheme",
    "backgroundColor",
    "loggingBehavior",
];
const CAP_OBJECT_FIELDS = [
    "server",
    "plugins",
    "android",
    "ios",
    "cordova",
];
function pullCapFields(out, src) {
    for (const f of CAP_SCALAR_FIELDS)
        pullScalarField(out, src, f);
    for (const f of CAP_OBJECT_FIELDS)
        pullObjectField(out, src, f);
    // allowNavigation is under server but also pull if top-level array appears
    pullArrayField(out, src, "allowNavigation");
}
function isCapacitorish(map) {
    return (map.appId !== undefined ||
        map.appName !== undefined ||
        map.webDir !== undefined ||
        map.bundledWebRuntime !== undefined ||
        map.server !== undefined ||
        map.plugins !== undefined ||
        map.androidScheme !== undefined ||
        map.iosScheme !== undefined ||
        map.android !== undefined ||
        map.ios !== undefined);
}
export function heuristicExtractJs(text) {
    const src = text ?? "";
    let out = {};
    const exported = findExportObject(src);
    if (exported && exported.startsWith("{")) {
        out = { ...heuristicObjectLiteral(exported) };
    }
    pullCapFields(out, exported ?? src);
    pullCapFields(out, src);
    return out;
}
export function parseCapacitorConfigText(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed) {
        return { raw: null, format: "empty", source: text ?? "" };
    }
    {
        const stripped = stripJsonComments(trimmed);
        try {
            const parsed = JSON.parse(stripped);
            const map0 = asMap(parsed);
            if (map0) {
                return {
                    raw: map0,
                    format: "jsonc",
                    source: trimmed,
                };
            }
            return {
                raw: null,
                format: "jsonc",
                parseError: "Capacitor config root must be a JSON object",
                source: trimmed,
            };
        }
        catch {
            // fall through
        }
    }
    if (looksLikeJs(trimmed) ||
        /\bappId\s*:/.test(trimmed) ||
        /\bwebDir\s*:/.test(trimmed) ||
        /\bappName\s*:/.test(trimmed) ||
        /\bbundledWebRuntime\s*:/.test(trimmed) ||
        /\bandroidScheme\s*:/.test(trimmed)) {
        const extracted = heuristicExtractJs(trimmed);
        if (extracted &&
            (isCapacitorish(extracted) || Object.keys(extracted).length > 0)) {
            return {
                raw: extracted,
                format: "js-heuristic",
                heuristic: true,
                source: trimmed,
            };
        }
        return {
            raw: null,
            format: "js-heuristic",
            parseError: "JS/TS capacitor.config heuristics found no Capacitor options (limits: no eval; regex extraction only)",
            heuristic: true,
            source: trimmed,
        };
    }
    return {
        raw: null,
        format: "unknown",
        parseError: "Unrecognized capacitor.config text",
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
function boolOrUndef(v) {
    if (typeof v === "boolean")
        return v;
    return undefined;
}
function asStringArray(v) {
    if (typeof v === "string" && v.trim())
        return [v.trim()];
    if (!Array.isArray(v))
        return [];
    const out = [];
    for (const item of v) {
        if (typeof item === "string" && item.trim())
            out.push(item.trim());
    }
    return out;
}
export function extractAppId(raw, source) {
    const result = {};
    if (raw) {
        const appId = stringOrUndef(raw.appId);
        if (appId)
            result.appId = appId;
        const appName = stringOrUndef(raw.appName);
        if (appName)
            result.appName = appName;
        const webDir = stringOrUndef(raw.webDir);
        if (webDir)
            result.webDir = webDir;
        const bwr = boolOrUndef(raw.bundledWebRuntime);
        if (bwr !== undefined)
            result.bundledWebRuntime = bwr;
    }
    if (source) {
        for (const field of ["appId", "appName", "webDir"]) {
            if (result[field] === undefined) {
                const re = new RegExp(`\\b${field}\\s*:\\s*(["'\`])((?:\\\\.|(?!\\1).)*)\\1`);
                const m = re.exec(source);
                if (m)
                    result[field] = unescapeStr(m[2]);
            }
        }
        if (result.bundledWebRuntime === undefined) {
            const m = /\bbundledWebRuntime\s*:\s*(true|false)\b/.exec(source);
            if (m)
                result.bundledWebRuntime = m[1] === "true";
        }
    }
    return result;
}
export function extractPluginsList(raw, source) {
    let pluginsObj = raw
        ? asMap(raw.plugins)
        : null;
    if (!pluginsObj && source) {
        const m = /\bplugins\s*:\s*\{/.exec(source);
        if (m) {
            const bal = extractBalanced(source, m.index + m[0].indexOf("{"));
            if (bal)
                pluginsObj = heuristicObjectLiteral(bal);
        }
    }
    if (!pluginsObj) {
        return { plugins: [], count: 0 };
    }
    const plugins = Object.keys(pluginsObj).filter((k) => !k.startsWith("__"));
    const pluginConfig = {};
    for (const k of plugins) {
        pluginConfig[k] = pluginsObj[k];
    }
    return {
        plugins,
        count: plugins.length,
        pluginConfig: plugins.length ? pluginConfig : undefined,
    };
}
export function extractServerUrlHint(raw, source) {
    const result = {};
    let serverMap = raw
        ? asMap(raw.server)
        : null;
    if (!serverMap && source) {
        const m = /\bserver\s*:\s*\{/.exec(source);
        if (m) {
            const bal = extractBalanced(source, m.index + m[0].indexOf("{"));
            if (bal)
                serverMap = heuristicObjectLiteral(bal);
        }
    }
    if (serverMap) {
        const server = {};
        const url = stringOrUndef(serverMap.url);
        if (url)
            server.url = url;
        const cleartext = boolOrUndef(serverMap.cleartext);
        if (cleartext !== undefined)
            server.cleartext = cleartext;
        const allow = asStringArray(serverMap.allowNavigation);
        if (allow.length)
            server.allowNavigation = allow;
        // source fallbacks inside server block
        if (source && server.url === undefined) {
            const urlM = /\burl\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(source);
            if (urlM)
                server.url = unescapeStr(urlM[2]);
        }
        if (source && server.cleartext === undefined) {
            const cM = /\bcleartext\s*:\s*(true|false)\b/.exec(source);
            if (cM)
                server.cleartext = cM[1] === "true";
        }
        if (source && !server.allowNavigation) {
            const aM = /\ballowNavigation\s*:\s*\[/.exec(source);
            if (aM) {
                const bal = extractBalanced(source, aM.index + aM[0].indexOf("["));
                if (bal) {
                    const arr = asStringArray(heuristicArrayLiteral(bal));
                    if (arr.length)
                        server.allowNavigation = arr;
                }
            }
        }
        if (server.url !== undefined ||
            server.cleartext !== undefined ||
            server.allowNavigation !== undefined) {
            result.server = server;
        }
    }
    else if (source) {
        // Loose field pulls when no server object parsed
        const server = {};
        const urlM = /\bserver\s*:\s*\{[\s\S]{0,400}?\burl\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(source) || /\burl\s*:\s*(["'`])((?:https?:\/\/|capacitor:\/\/)[^"'`]*)\1/.exec(source);
        if (urlM)
            server.url = unescapeStr(urlM[2]);
        const cM = /\bcleartext\s*:\s*(true|false)\b/.exec(source);
        if (cM)
            server.cleartext = cM[1] === "true";
        const aM = /\ballowNavigation\s*:\s*\[/.exec(source);
        if (aM) {
            const bal = extractBalanced(source, aM.index + aM[0].indexOf("["));
            if (bal) {
                const arr = asStringArray(heuristicArrayLiteral(bal));
                if (arr.length)
                    server.allowNavigation = arr;
            }
        }
        if (server.url !== undefined ||
            server.cleartext !== undefined ||
            server.allowNavigation !== undefined) {
            result.server = server;
        }
    }
    if (raw) {
        const and = stringOrUndef(raw.androidScheme);
        if (and)
            result.androidScheme = and;
        const ios = stringOrUndef(raw.iosScheme);
        if (ios)
            result.iosScheme = ios;
    }
    if (source) {
        if (result.androidScheme === undefined) {
            const m = /\bandroidScheme\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(source);
            if (m)
                result.androidScheme = unescapeStr(m[2]);
        }
        if (result.iosScheme === undefined) {
            const m = /\biosScheme\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(source);
            if (m)
                result.iosScheme = unescapeStr(m[2]);
        }
    }
    return result;
}
const LOCALHOST_RE = /^(https?:\/\/)?(localhost|127\.0\.0\.1|0\.0\.0\.0|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?(\/|$)/i;
export function lintCapacitorConfig(raw, parseError, format, source) {
    const findings = [];
    if (parseError) {
        findings.push({
            severity: "error",
            rule: "invalid_config",
            advice: `Could not parse capacitor.config: ${parseError}`,
        });
        return findings;
    }
    if (!raw) {
        findings.push({
            severity: "info",
            rule: "empty_config",
            advice: "No capacitor.config content provided (empty input).",
        });
        return findings;
    }
    const keys = Object.keys(raw).filter((k) => !k.startsWith("__"));
    if (keys.length === 0) {
        findings.push({
            severity: "info",
            rule: "empty_config",
            advice: "Parsed Capacitor config object is empty — no fields detected.",
        });
        return findings;
    }
    if (format === "js-heuristic") {
        findings.push({
            severity: "info",
            rule: "js_heuristic_limits",
            advice: "JS/TS capacitor.config was parsed with best-effort string heuristics (no eval). Nested spreads, computed keys, dynamic imports, env branches, and function-returned configs are not fully resolved — verify critical values manually.",
        });
    }
    const meta = extractAppId(raw, source);
    const serverHint = extractServerUrlHint(raw, source);
    const plugins = extractPluginsList(raw, source);
    if (!meta.appId) {
        findings.push({
            severity: "warn",
            rule: "missing_appId",
            advice: 'No "appId" detected — set a reverse-DNS id like com.company.app (required for native projects).',
        });
    }
    else if (!/^[a-zA-Z][\w]*(\.[a-zA-Z][\w]*)+$/.test(meta.appId)) {
        findings.push({
            severity: "info",
            rule: "appId_format",
            advice: `appId "${meta.appId}" looks non-standard — usually reverse-DNS like com.company.app.`,
        });
    }
    if (!meta.webDir) {
        findings.push({
            severity: "warn",
            rule: "missing_webDir",
            advice: 'No "webDir" detected — set webDir to your web build output (e.g. "dist", "www", "build").',
        });
    }
    if (!meta.appName) {
        findings.push({
            severity: "info",
            rule: "missing_appName",
            advice: 'No "appName" detected — optional but recommended for the native display name.',
        });
    }
    if (meta.bundledWebRuntime === true) {
        findings.push({
            severity: "info",
            rule: "bundled_web_runtime_deprecated",
            advice: "bundledWebRuntime: true is legacy — Capacitor 3+ removed the bundled runtime; remove this flag on modern projects.",
        });
    }
    if (serverHint.server?.cleartext === true) {
        findings.push({
            severity: "warn",
            rule: "cleartext_true_tip",
            advice: "server.cleartext is true — allows cleartext HTTP on Android. Fine for local device testing; disable for production / store builds and prefer HTTPS.",
        });
    }
    const serverUrl = serverHint.server?.url;
    if (serverUrl && LOCALHOST_RE.test(serverUrl)) {
        findings.push({
            severity: "warn",
            rule: "localhost_server_prod_smell",
            advice: `server.url "${serverUrl}" points at localhost / private LAN — typical for live-reload during development. Do not ship production binaries with a fixed local server URL; remove or gate it behind env/build flavors.`,
        });
    }
    if (serverHint.server?.allowNavigation &&
        serverHint.server.allowNavigation.some((h) => h === "*" || h === "*.*")) {
        findings.push({
            severity: "info",
            rule: "allow_navigation_wide",
            advice: 'server.allowNavigation includes a very broad pattern ("*") — narrow allowlists reduce surprise navigation out of the WebView.',
        });
    }
    if (plugins.count === 0 &&
        meta.appId &&
        meta.webDir &&
        !serverHint.server) {
        findings.push({
            severity: "info",
            rule: "no_plugins_or_server",
            advice: "No plugins{} or server{} block detected — fine for a minimal Capacitor shell; add plugin config as native features are enabled.",
        });
    }
    return findings;
}
