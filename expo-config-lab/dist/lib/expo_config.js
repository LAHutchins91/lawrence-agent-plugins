/**
 * Shared Expo app.json / app.config text helpers.
 * Root or nested expo: {} — best-effort heuristics (no eval).
 * No expo binary, no network, no filesystem follow.
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
        /\bsatisfies\b/.test(t) ||
        /\bExpoConfig\b/.test(t) ||
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
        // process.env.FOO or process.env["FOO"]
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
const EXPO_SCALAR_FIELDS = [
    "name",
    "slug",
    "version",
    "orientation",
    "sdkVersion",
    "owner",
    "scheme",
    "userInterfaceStyle",
    "icon",
    "splash",
];
const EXPO_ARRAY_FIELDS = ["plugins", "schemes"];
const EXPO_OBJECT_FIELDS = [
    "ios",
    "android",
    "web",
    "extra",
    "splash",
    "androidStatusBar",
];
function pullExpoFields(out, src) {
    for (const f of EXPO_SCALAR_FIELDS)
        pullScalarField(out, src, f);
    for (const f of EXPO_ARRAY_FIELDS)
        pullArrayField(out, src, f);
    for (const f of EXPO_OBJECT_FIELDS)
        pullObjectField(out, src, f);
    // scheme as array
    if (out.scheme === undefined) {
        const re = /\bscheme\s*:\s*\[/;
        const m = re.exec(src);
        if (m) {
            const bal = extractBalanced(src, m.index + m[0].indexOf("["));
            if (bal)
                out.scheme = heuristicArrayLiteral(bal);
        }
    }
}
function isExpoish(map) {
    return (map.name !== undefined ||
        map.slug !== undefined ||
        map.sdkVersion !== undefined ||
        map.plugins !== undefined ||
        map.scheme !== undefined ||
        map.orientation !== undefined ||
        map.ios !== undefined ||
        map.android !== undefined ||
        map.extra !== undefined ||
        map.owner !== undefined ||
        map.expo !== undefined);
}
export function unwrapExpo(raw) {
    if (!raw)
        return null;
    const nested = asMap(raw.expo);
    if (nested && isExpoish(nested)) {
        return nested;
    }
    if (isExpoish(raw) && raw.expo === undefined) {
        return raw;
    }
    if (nested)
        return nested;
    return raw;
}
export function heuristicExtractJs(text) {
    const src = text ?? "";
    let out = {};
    const exported = findExportObject(src);
    if (exported && exported.startsWith("{")) {
        out = { ...heuristicObjectLiteral(exported) };
    }
    // Prefer nested expo: { … } when present
    const expoNested = asMap(out.expo);
    if (expoNested) {
        pullExpoFields(expoNested, exported ?? src);
        out = { ...out, expo: expoNested };
    }
    else {
        // Look for expo: { … } in source
        const m = /\bexpo\s*:\s*\{/.exec(src);
        if (m) {
            const bal = extractBalanced(src, m.index + m[0].indexOf("{"));
            if (bal) {
                const expoObj = heuristicObjectLiteral(bal);
                pullExpoFields(expoObj, bal);
                out = { ...out, expo: expoObj };
            }
        }
    }
    pullExpoFields(out, src);
    return out;
}
export function parseExpoConfigText(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed) {
        return { raw: null, expo: null, format: "empty", source: text ?? "" };
    }
    {
        const stripped = stripJsonComments(trimmed);
        try {
            const parsed = JSON.parse(stripped);
            const map0 = asMap(parsed);
            if (map0) {
                return {
                    raw: map0,
                    expo: unwrapExpo(map0),
                    format: "jsonc",
                    source: trimmed,
                };
            }
            return {
                raw: null,
                expo: null,
                format: "jsonc",
                parseError: "Expo config root must be a JSON object",
                source: trimmed,
            };
        }
        catch {
            // fall through
        }
    }
    if (looksLikeJs(trimmed) ||
        /\bslug\s*:/.test(trimmed) ||
        /\bplugins\s*:/.test(trimmed) ||
        /\bscheme\s*:/.test(trimmed) ||
        /\bexpo\s*:/.test(trimmed) ||
        /\bbundleIdentifier\s*:/.test(trimmed)) {
        const extracted = heuristicExtractJs(trimmed);
        if (extracted && (isExpoish(extracted) || Object.keys(extracted).length > 0)) {
            return {
                raw: extracted,
                expo: unwrapExpo(extracted),
                format: "js-heuristic",
                heuristic: true,
                source: trimmed,
            };
        }
        return {
            raw: null,
            expo: null,
            format: "js-heuristic",
            parseError: "JS app.config heuristics found no Expo options (limits: no eval; regex extraction only)",
            heuristic: true,
            source: trimmed,
        };
    }
    return {
        raw: null,
        expo: null,
        format: "unknown",
        parseError: "Unrecognized Expo app.json / app.config text",
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
export function extractSlugName(expo, source) {
    const result = {};
    if (expo) {
        const name = stringOrUndef(expo.name);
        if (name)
            result.name = name;
        const slug = stringOrUndef(expo.slug);
        if (slug)
            result.slug = slug;
        const version = stringOrUndef(expo.version);
        if (version)
            result.version = version;
        const orientation = stringOrUndef(expo.orientation);
        if (orientation)
            result.orientation = orientation;
        const sdkVersion = stringOrUndef(expo.sdkVersion);
        if (sdkVersion)
            result.sdkVersion = sdkVersion;
        const owner = stringOrUndef(expo.owner);
        if (owner)
            result.owner = owner;
    }
    if (source) {
        for (const field of [
            "name",
            "slug",
            "version",
            "orientation",
            "sdkVersion",
            "owner",
        ]) {
            if (result[field] === undefined) {
                const re = new RegExp(`\\b${field}\\s*:\\s*(["'\`])((?:\\\\.|(?!\\1).)*)\\1`);
                const m = re.exec(source);
                if (m)
                    result[field] = unescapeStr(m[2]);
            }
        }
    }
    return result;
}
function pluginName(item) {
    if (typeof item === "string" && item.trim())
        return item.trim();
    if (Array.isArray(item) && item.length > 0) {
        if (typeof item[0] === "string" && item[0].trim())
            return item[0].trim();
    }
    const map = asMap(item);
    if (map) {
        if (typeof map[0] === "string")
            return map[0]; // unlikely
        const n = stringOrUndef(map.name) ||
            stringOrUndef(map.plugin) ||
            (typeof map.__call === "string" ? map.__call : undefined);
        if (n)
            return n;
    }
    return undefined;
}
function normalizePluginEntry(item) {
    if (typeof item === "string")
        return item;
    if (Array.isArray(item)) {
        // Expo tuple form ["expo-camera", { … }]
        if (item.length >= 1 && typeof item[0] === "string") {
            if (item.length === 1)
                return item[0];
            return { name: item[0], config: item[1] ?? null };
        }
        return { tuple: item };
    }
    const map = asMap(item);
    if (map)
        return map;
    return { value: item };
}
export function extractPluginsList(expo, source) {
    let pluginsRaw = expo?.plugins;
    if (!Array.isArray(pluginsRaw) && source) {
        const m = /\bplugins\s*:\s*\[/.exec(source);
        if (m) {
            const bal = extractBalanced(source, m.index + m[0].indexOf("["));
            if (bal)
                pluginsRaw = heuristicArrayLiteral(bal);
        }
    }
    const plugins = [];
    const names = [];
    if (Array.isArray(pluginsRaw)) {
        for (const item of pluginsRaw) {
            plugins.push(normalizePluginEntry(item));
            const n = pluginName(item);
            if (n)
                names.push(n);
            else if (Array.isArray(item) && typeof item[0] === "string") {
                names.push(item[0]);
            }
        }
    }
    return { plugins, names, count: plugins.length };
}
export function extractSchemeList(expo, source) {
    const schemes = [];
    let schemeField;
    let iosBundleId;
    let androidPackage;
    if (expo) {
        if (typeof expo.scheme === "string" && expo.scheme.trim()) {
            schemeField = expo.scheme.trim();
            schemes.push(expo.scheme.trim());
        }
        else if (Array.isArray(expo.scheme)) {
            const arr = asStringArray(expo.scheme);
            if (arr.length) {
                schemeField = arr.length === 1 ? arr[0] : arr;
                schemes.push(...arr);
            }
        }
        // some configs use schemes (plural)
        for (const s of asStringArray(expo.schemes)) {
            if (!schemes.includes(s))
                schemes.push(s);
        }
        const ios = asMap(expo.ios);
        if (ios) {
            iosBundleId = stringOrUndef(ios.bundleIdentifier);
        }
        const android = asMap(expo.android);
        if (android) {
            androidPackage = stringOrUndef(android.package);
        }
    }
    if (source) {
        if (schemes.length === 0) {
            const strM = /\bscheme\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(source);
            if (strM) {
                const s = unescapeStr(strM[2]);
                schemeField = s;
                schemes.push(s);
            }
            else {
                const arrM = /\bscheme\s*:\s*\[/.exec(source);
                if (arrM) {
                    const bal = extractBalanced(source, arrM.index + arrM[0].indexOf("["));
                    if (bal) {
                        const arr = asStringArray(heuristicArrayLiteral(bal));
                        if (arr.length) {
                            schemeField = arr.length === 1 ? arr[0] : arr;
                            schemes.push(...arr);
                        }
                    }
                }
            }
        }
        if (!iosBundleId) {
            const m = /\bbundleIdentifier\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(source);
            if (m)
                iosBundleId = unescapeStr(m[2]);
        }
        if (!androidPackage) {
            // prefer android.package — look near android block first
            const andM = /\bandroid\s*:\s*\{/.exec(source);
            if (andM) {
                const bal = extractBalanced(source, andM.index + andM[0].indexOf("{"));
                if (bal) {
                    const pm = /\bpackage\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(bal);
                    if (pm)
                        androidPackage = unescapeStr(pm[2]);
                }
            }
            if (!androidPackage) {
                const pm = /\bpackage\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(source);
                if (pm)
                    androidPackage = unescapeStr(pm[2]);
            }
        }
    }
    const result = { schemes };
    if (schemeField !== undefined)
        result.scheme = schemeField;
    if (iosBundleId)
        result.iosBundleId = iosBundleId;
    if (androidPackage)
        result.androidPackage = androidPackage;
    return result;
}
const SECRET_KEY_RE = /(?:api[_-]?key|secret|password|token|private[_-]?key|auth[_-]?token|access[_-]?key|client[_-]?secret|aws[_-]?secret)/i;
function walkExtraSecrets(node, path, hits) {
    if (!node || typeof node !== "object")
        return;
    if (Array.isArray(node)) {
        node.forEach((v, i) => walkExtraSecrets(v, `${path}[${i}]`, hits));
        return;
    }
    for (const [k, v] of Object.entries(node)) {
        const p = path ? `${path}.${k}` : k;
        if (SECRET_KEY_RE.test(k)) {
            if (typeof v === "string" && v.trim() && !/^\$\{/.test(v) && !/^process\.env/.test(v)) {
                hits.push(p);
            }
            else if (typeof v === "string" && v.trim()) {
                hits.push(p);
            }
            else if (v != null && typeof v !== "object") {
                hits.push(p);
            }
        }
        if (v && typeof v === "object")
            walkExtraSecrets(v, p, hits);
    }
}
export function lintExpoConfig(expo, parseError, format, source) {
    const findings = [];
    if (parseError) {
        findings.push({
            severity: "error",
            rule: "invalid_config",
            advice: `Could not parse Expo config: ${parseError}`,
        });
        return findings;
    }
    if (!expo) {
        findings.push({
            severity: "info",
            rule: "empty_config",
            advice: "No Expo app.json / app.config content provided (empty input).",
        });
        return findings;
    }
    const keys = Object.keys(expo).filter((k) => !k.startsWith("__"));
    if (keys.length === 0) {
        findings.push({
            severity: "info",
            rule: "empty_config",
            advice: "Parsed Expo config object is empty — no fields detected.",
        });
        return findings;
    }
    if (format === "js-heuristic") {
        findings.push({
            severity: "info",
            rule: "js_heuristic_limits",
            advice: "JS/TS app.config was parsed with best-effort string heuristics (no eval). Nested spreads, computed keys, dynamic imports, env branches, and function-returned configs are not fully resolved — verify critical values manually.",
        });
    }
    const meta = extractSlugName(expo, source);
    const schemes = extractSchemeList(expo, source);
    const plugins = extractPluginsList(expo, source);
    const src = source ?? "";
    if (!meta.name) {
        findings.push({
            severity: "warn",
            rule: "missing_name",
            advice: 'No "name" detected — set expo.name (display name shown on home screen / stores).',
        });
    }
    if (!meta.slug) {
        findings.push({
            severity: "warn",
            rule: "missing_slug",
            advice: 'No "slug" detected — set expo.slug (URL-safe project id for Expo / EAS). Prefer lowercase kebab-case.',
        });
    }
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.slug)) {
        findings.push({
            severity: "info",
            rule: "slug_format",
            advice: `slug "${meta.slug}" is unusual — Expo slugs are typically lowercase alphanumeric with hyphens.`,
        });
    }
    // Privacy / permissions tips
    const hasInfoPlist = /\binfoPlist\b/.test(src) ||
        (asMap(expo.ios) && asMap(asMap(expo.ios).infoPlist));
    const hasAndroidPerms = /\bpermissions\b/.test(src) ||
        (asMap(expo.android) && Array.isArray(asMap(expo.android).permissions));
    const cameraPlugin = plugins.names.some((n) => /camera|image-picker|av|location|contacts|calendar|media-library|notifications/i.test(n));
    if (cameraPlugin && !hasInfoPlist && !hasAndroidPerms) {
        findings.push({
            severity: "info",
            rule: "privacy_permissions_tip",
            advice: "Plugins that touch camera/photos/location/contacts are present, but no ios.infoPlist / android.permissions strings were detected. Confirm permission purpose strings are set (plugin config or native manifests) before store review.",
        });
    }
    else if (/\bNSCameraUsageDescription\b|\bNSPhotoLibraryUsageDescription\b|\bACCESS_FINE_LOCATION\b/.test(src)) {
        findings.push({
            severity: "info",
            rule: "privacy_permissions_tip",
            advice: "Privacy / permission strings detected — keep purpose text accurate and user-facing; store review rejects vague or missing usage descriptions.",
        });
    }
    // expo.extra secrets smell
    const extra = asMap(expo.extra);
    if (extra) {
        const hits = [];
        walkExtraSecrets(extra, "extra", hits);
        if (hits.length) {
            findings.push({
                severity: "warn",
                rule: "extra_secrets_smell",
                advice: `Possible secrets in expo.extra (${hits.slice(0, 5).join(", ")}${hits.length > 5 ? ", …" : ""}). Prefer EAS secrets / env vars; do not commit live API keys in app.json.`,
            });
        }
    }
    else if (/\bextra\s*:\s*\{[\s\S]{0,800}(?:api[_-]?key|secret|password|token|private[_-]?key)/i.test(src)) {
        findings.push({
            severity: "warn",
            rule: "extra_secrets_smell",
            advice: "Possible secrets near expo.extra in source text. Prefer EAS secrets / env vars; do not commit live API keys in app config.",
        });
    }
    if (schemes.schemes.length === 0 &&
        !schemes.iosBundleId &&
        !schemes.androidPackage &&
        plugins.count === 0 &&
        meta.name &&
        meta.slug) {
        findings.push({
            severity: "info",
            rule: "no_scheme_or_ids",
            advice: "No scheme / ios.bundleIdentifier / android.package detected — fine for early prototypes; set them before deep linking or native builds.",
        });
    }
    if (schemes.iosBundleId && !/^[a-zA-Z][\w.-]*\.[a-zA-Z][\w.-]+/.test(schemes.iosBundleId)) {
        findings.push({
            severity: "info",
            rule: "ios_bundle_id_format",
            advice: `ios.bundleIdentifier "${schemes.iosBundleId}" looks non-standard — usually reverse-DNS like com.company.app.`,
        });
    }
    if (schemes.androidPackage &&
        !/^[a-zA-Z][\w]*(\.[a-zA-Z][\w]*)+$/.test(schemes.androidPackage)) {
        findings.push({
            severity: "info",
            rule: "android_package_format",
            advice: `android.package "${schemes.androidPackage}" looks non-standard — usually reverse-DNS like com.company.app.`,
        });
    }
    return findings;
}
