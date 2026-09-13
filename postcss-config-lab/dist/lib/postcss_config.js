/**
 * Shared postcss config text helpers.
 * Prefer robust JSONC; JS/TS configs via best-effort regex (no eval).
 * No postcss binary, no network, no filesystem follow.
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
            const name = unescapeStr(reqM[2]);
            let j = i + reqM[0].length;
            while (j < inner.length && /\s/.test(inner[j]))
                j++;
            if (inner[j] === "(") {
                const par = extractBalancedParen(inner, j);
                if (par)
                    j += par.length;
            }
            out.push(name);
            i = j;
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
                    out.push(req !== undefined ? req : { __call: name, __args: par });
                }
                else {
                    out.push({ __call: name, __args: par });
                }
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
        /(?:module\.exports\s*=\s*|export\s+default\s*)(?:function\s*)?\(\s*(?:ctx|api|ctx\s*,\s*opts)?\s*\)\s*\{/,
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
        if (/function\s*\(/.test(m[0]) ||
            /=>\s*\{/.test(m[0]) ||
            /\(\s*(?:ctx|api)/.test(m[0])) {
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
        return;
    }
    const reqRe = new RegExp(`\\b${field}\\s*:\\s*require\\s*\\(\\s*(["'\`])((?:\\\\.|(?!\\1).)*)\\1\\s*\\)`);
    const reqM = reqRe.exec(src);
    if (reqM) {
        out[field] = unescapeStr(reqM[2]);
    }
}
export function heuristicExtractJs(text) {
    const src = text ?? "";
    let out = {};
    const exported = findExportObject(src);
    if (exported && exported.startsWith("{")) {
        out = { ...heuristicObjectLiteral(exported) };
    }
    // plugins may be object (common) or array
    if (out.plugins === undefined) {
        const mObj = /\bplugins\s*:\s*\{/.exec(src);
        const mArr = /\bplugins\s*:\s*\[/.exec(src);
        if (mObj && (!mArr || mObj.index < mArr.index)) {
            pullObjectField(out, src, "plugins");
        }
        else if (mArr) {
            pullArrayField(out, src, "plugins");
        }
    }
    pullObjectField(out, src, "map");
    pullScalarField(out, src, "map");
    pullScalarField(out, src, "syntax");
    pullScalarField(out, src, "parser");
    pullScalarField(out, src, "stringifier");
    pullScalarField(out, src, "from");
    pullScalarField(out, src, "to");
    pullObjectField(out, src, "browserslist");
    pullScalarField(out, src, "browserslist");
    if (out.browserslist === undefined) {
        const mArr = /\bbrowserslist\s*:\s*\[/.exec(src);
        if (mArr) {
            const bal = extractBalanced(src, mArr.index + mArr[0].indexOf("["));
            if (bal)
                out.browserslist = heuristicArrayLiteral(bal);
        }
    }
    return out;
}
function unwrapPackagePostcss(map) {
    const looksPkg = map.name !== undefined ||
        map.version !== undefined ||
        map.dependencies !== undefined ||
        map.devDependencies !== undefined ||
        map.scripts !== undefined;
    const postcss = asMap(map.postcss);
    if (postcss && (looksPkg || Object.keys(postcss).length > 0)) {
        if (looksPkg || (map.plugins === undefined && map.syntax === undefined)) {
            return { map: { ...postcss }, unwrapped: true };
        }
    }
    return { map, unwrapped: false };
}
function isPostcssish(map) {
    return (map.plugins !== undefined ||
        map.syntax !== undefined ||
        map.parser !== undefined ||
        map.stringifier !== undefined ||
        map.map !== undefined ||
        map.from !== undefined ||
        map.to !== undefined ||
        asMap(map.postcss) !== null);
}
export function parsePostcssConfigText(text) {
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
                const { map, unwrapped } = unwrapPackagePostcss(map0);
                return {
                    raw: map,
                    format: "jsonc",
                    unwrappedPackagePostcss: unwrapped || undefined,
                    source: trimmed,
                };
            }
            return {
                raw: null,
                format: "jsonc",
                parseError: "postcss config root must be a JSON object",
                source: trimmed,
            };
        }
        catch {
            // fall through
        }
    }
    if (looksLikeJs(trimmed) ||
        /\bplugins\s*:/.test(trimmed) ||
        /\bsyntax\s*:/.test(trimmed) ||
        /\bparser\s*:/.test(trimmed) ||
        /\bstringifier\s*:/.test(trimmed) ||
        /\bmap\s*:/.test(trimmed)) {
        const extracted = heuristicExtractJs(trimmed);
        const { map, unwrapped } = unwrapPackagePostcss(extracted);
        if (map && (isPostcssish(map) || Object.keys(map).length > 0)) {
            return {
                raw: map,
                format: "js-heuristic",
                heuristic: true,
                unwrappedPackagePostcss: unwrapped || undefined,
                source: trimmed,
            };
        }
        return {
            raw: null,
            format: "js-heuristic",
            parseError: "JS config heuristics found no postcss options (limits: no eval; regex extraction only)",
            heuristic: true,
            source: trimmed,
        };
    }
    return {
        raw: null,
        format: "unknown",
        parseError: "Unrecognized postcss config text",
        source: trimmed,
    };
}
function pluginNameFromItem(item) {
    if (typeof item === "string") {
        const s = item.trim();
        return s || undefined;
    }
    if (Array.isArray(item) && item.length > 0) {
        return pluginNameFromItem(item[0]);
    }
    const map = asMap(item);
    if (!map)
        return undefined;
    if (typeof map.__call === "string") {
        if (map.__call === "require" && typeof map.__args === "string") {
            const s = firstStringInParens(map.__args);
            if (s)
                return s;
        }
        return map.__call;
    }
    if (typeof map.postcssPlugin === "string")
        return map.postcssPlugin;
    if (typeof map.name === "string")
        return map.name;
    return undefined;
}
export function extractPlugins(raw, source) {
    const names = [];
    const seen = new Set();
    const push = (n) => {
        if (!n)
            return;
        const t = n.trim();
        if (!t || seen.has(t))
            return;
        if (t.startsWith("__"))
            return;
        seen.add(t);
        names.push(t);
    };
    if (raw) {
        const plugins = raw.plugins;
        if (Array.isArray(plugins)) {
            for (const item of plugins)
                push(pluginNameFromItem(item));
        }
        else {
            const map = asMap(plugins);
            if (map) {
                for (const key of Object.keys(map)) {
                    if (key.startsWith("__"))
                        continue;
                    push(key);
                }
            }
        }
    }
    if (source) {
        const mArr = /\bplugins\s*:\s*\[/.exec(source);
        if (mArr) {
            const bal = extractBalanced(source, mArr.index + mArr[0].indexOf("["));
            if (bal) {
                const callRe = /\b([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*\(/g;
                let nm;
                while ((nm = callRe.exec(bal)) !== null) {
                    const name = nm[1];
                    if ([
                        "require",
                        "if",
                        "function",
                        "Boolean",
                        "Array",
                        "Object",
                        "String",
                        "Number",
                    ].includes(name)) {
                        continue;
                    }
                    push(name);
                }
                const reqRe = /\brequire\s*\(\s*(["'`])((?:\\.|(?!\1).)*)\1\s*\)/g;
                while ((nm = reqRe.exec(bal)) !== null) {
                    push(unescapeStr(nm[2]));
                }
            }
        }
        const mObj = /\bplugins\s*:\s*\{/.exec(source);
        if (mObj && names.length === 0) {
            const bal = extractBalanced(source, mObj.index + mObj[0].indexOf("{"));
            if (bal) {
                const keyRe = /(?:^|[,{])\s*(?:(["'`])((?:\\.|(?!\1).)*)\1|([A-Za-z_$][\w$-]*))\s*:/g;
                let km;
                while ((km = keyRe.exec(bal)) !== null) {
                    const key = km[2] ? unescapeStr(km[2]) : km[3];
                    if (key && key !== "__call" && key !== "__args")
                        push(key);
                }
            }
        }
    }
    return { plugins: names, count: names.length };
}
function moduleRef(value) {
    if (typeof value === "string") {
        const s = value.trim();
        return s || undefined;
    }
    const map = asMap(value);
    if (!map)
        return undefined;
    if (typeof map.__call === "string") {
        if (map.__call === "require" && typeof map.__args === "string") {
            const s = firstStringInParens(map.__args);
            if (s)
                return s;
        }
        return map.__call;
    }
    if (typeof map.name === "string")
        return map.name;
    return undefined;
}
export function extractSyntaxHint(raw, source) {
    const result = {};
    if (raw) {
        const syntax = moduleRef(raw.syntax);
        const parser = moduleRef(raw.parser);
        const stringifier = moduleRef(raw.stringifier);
        if (syntax)
            result.syntax = syntax;
        if (parser)
            result.parser = parser;
        if (stringifier)
            result.stringifier = stringifier;
    }
    if (source) {
        const pull = (field) => {
            if (result[field])
                return;
            const strRe = new RegExp(`\\b${field}\\s*:\\s*(["'\`])((?:\\\\.|(?!\\1).)*)\\1`);
            const strM = strRe.exec(source);
            if (strM) {
                result[field] = unescapeStr(strM[2]);
                return;
            }
            const reqRe = new RegExp(`\\b${field}\\s*:\\s*require\\s*\\(\\s*(["'\`])((?:\\\\.|(?!\\1).)*)\\1\\s*\\)`);
            const reqM = reqRe.exec(source);
            if (reqM)
                result[field] = unescapeStr(reqM[2]);
        };
        pull("syntax");
        pull("parser");
        pull("stringifier");
    }
    return result;
}
function stringifyPathish(value) {
    if (typeof value === "string") {
        const s = value.trim();
        return s || undefined;
    }
    if (typeof value === "number")
        return String(value);
    const map = asMap(value);
    if (map && typeof map.__call === "string") {
        if (typeof map.__args === "string") {
            const s = firstStringInParens(map.__args);
            if (s)
                return s;
        }
    }
    return undefined;
}
export function extractMapOptions(raw, source) {
    const result = {};
    if (raw) {
        if (typeof raw.map === "boolean") {
            result.map = raw.map;
        }
        else {
            const mapObj = asMap(raw.map);
            if (mapObj)
                result.map = { ...mapObj };
        }
        const from = stringifyPathish(raw.from);
        const to = stringifyPathish(raw.to);
        if (from)
            result.from = from;
        if (to)
            result.to = to;
    }
    if (source) {
        if (result.map === undefined) {
            if (/\bmap\s*:\s*true\b/.test(source))
                result.map = true;
            else if (/\bmap\s*:\s*false\b/.test(source))
                result.map = false;
            else {
                const mObj = /\bmap\s*:\s*\{/.exec(source);
                if (mObj) {
                    const bal = extractBalanced(source, mObj.index + mObj[0].indexOf("{"));
                    if (bal)
                        result.map = heuristicObjectLiteral(bal);
                }
            }
        }
        if (result.from === undefined) {
            const m = /\bfrom\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(source);
            if (m)
                result.from = unescapeStr(m[2]);
        }
        if (result.to === undefined) {
            const m = /\bto\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(source);
            if (m)
                result.to = unescapeStr(m[2]);
        }
    }
    return result;
}
const DEPRECATED_PLUGINS = [
    {
        match: /^(?:postcss-)?cssnext$/,
        name: "postcss-cssnext",
        advice: "postcss-cssnext / cssnext is unmaintained — migrate to postcss-preset-env (same features, PostCSS 8+).",
    },
    {
        match: /^precss$/,
        name: "precss",
        advice: "precss is unmaintained — replace with postcss-preset-env and/or postcss-nested + postcss-custom-properties.",
    },
    {
        match: /^autoprefixer-core$/,
        name: "autoprefixer-core",
        advice: "autoprefixer-core is obsolete — use the autoprefixer package.",
    },
    {
        match: /^pixrem$/,
        name: "pixrem",
        advice: "pixrem (rem→px fallback) is legacy — modern browsers support rem; drop it unless you still target ancient IE.",
    },
    {
        match: /^postcss-color-function$/,
        name: "postcss-color-function",
        advice: "postcss-color-function is deprecated — use color-mix() / postcss-preset-env color features instead.",
    },
    {
        match: /^postcss-will-change$/,
        name: "postcss-will-change",
        advice: "postcss-will-change is obsolete — browsers handle will-change without a polyfill plugin.",
    },
    {
        match: /^postcss-filter-plugins$/,
        name: "postcss-filter-plugins",
        advice: "postcss-filter-plugins is unmaintained — remove it and list plugins explicitly.",
    },
    {
        match: /^(?:postcss-)?oldie$/,
        name: "postcss-oldie",
        advice: "oldie / postcss-oldie targets IE 6–8 — drop unless you still ship those browsers.",
    },
];
function stringifyUnknown(v) {
    try {
        return JSON.stringify(v) ?? "";
    }
    catch {
        return String(v);
    }
}
function hasBrowserslistHint(raw, source, plugins) {
    if (raw.browserslist !== undefined)
        return true;
    const blob = `${source ?? ""}\n${stringifyUnknown(raw)}`;
    if (/\bbrowserslist\b/.test(blob) ||
        /\boverrideBrowserslist\b/.test(blob)) {
        return true;
    }
    const plug = raw.plugins;
    const map = asMap(plug);
    if (map) {
        const ap = map.autoprefixer;
        const apMap = asMap(ap);
        if (apMap) {
            if (apMap.overrideBrowserslist !== undefined ||
                apMap.browsers !== undefined ||
                apMap.browserslist !== undefined) {
                return true;
            }
        }
    }
    if (Array.isArray(plug)) {
        for (const item of plug) {
            if (!Array.isArray(item))
                continue;
            const name = pluginNameFromItem(item[0]);
            if (name !== "autoprefixer")
                continue;
            const opts = asMap(item[1]);
            if (opts &&
                (opts.overrideBrowserslist !== undefined ||
                    opts.browsers !== undefined)) {
                return true;
            }
        }
    }
    void plugins;
    return false;
}
function autoprefixerUsesDeprecatedBrowsers(raw, source) {
    const blob = `${source ?? ""}\n${stringifyUnknown(raw)}`;
    if (/\bbrowsers\s*:/.test(blob) && /\bautoprefixer\b/.test(blob)) {
        // crude but useful — also check structured opts
    }
    const plug = raw.plugins;
    const map = asMap(plug);
    if (map) {
        const apMap = asMap(map.autoprefixer);
        if (apMap && apMap.browsers !== undefined)
            return true;
    }
    if (Array.isArray(plug)) {
        for (const item of plug) {
            if (!Array.isArray(item))
                continue;
            if (pluginNameFromItem(item[0]) !== "autoprefixer")
                continue;
            const opts = asMap(item[1]);
            if (opts && opts.browsers !== undefined)
                return true;
        }
    }
    return /\bautoprefixer[\s\S]{0,200}\bbrowsers\s*:/.test(blob);
}
export function lintPostcssConfig(raw, parseError, format, source, unwrappedPackagePostcss) {
    const findings = [];
    if (parseError) {
        findings.push({
            severity: "error",
            rule: "invalid_config",
            advice: `Could not parse postcss config: ${parseError}`,
        });
        return findings;
    }
    if (!raw) {
        findings.push({
            severity: "info",
            rule: "empty_config",
            advice: "No postcss config content provided (empty input).",
        });
        return findings;
    }
    const keys = Object.keys(raw);
    if (keys.length === 0) {
        findings.push({
            severity: "info",
            rule: "empty_config",
            advice: "Parsed config object is empty — no postcss options detected.",
        });
        return findings;
    }
    if (unwrappedPackagePostcss) {
        findings.push({
            severity: "info",
            rule: "package_json_postcss_unwrap",
            advice: 'Input looked like package.json — analyzed the nested "postcss" key. Prefer a dedicated postcss.config.js / .postcssrc.json for clearer tooling.',
        });
    }
    if (format === "js-heuristic") {
        findings.push({
            severity: "info",
            rule: "js_heuristic_limits",
            advice: "JS/TS postcss config was parsed with best-effort string heuristics (no eval). Nested spreads, computed keys, dynamic requires, ctx.env branches, and function-returned configs are not fully resolved — verify critical values manually. Prefer JSON/JSONC when possible for unambiguous parse.",
        });
    }
    const listed = extractPlugins(raw, source);
    if (listed.count === 0 && raw.plugins === undefined) {
        findings.push({
            severity: "warn",
            rule: "missing_plugins",
            advice: "No plugins field detected. A PostCSS config without plugins is a no-op — add at least one plugin (e.g. autoprefixer, postcss-preset-env, tailwindcss) if you intended a pipeline.",
        });
    }
    else if (listed.count === 0) {
        findings.push({
            severity: "warn",
            rule: "missing_plugins",
            advice: "plugins is present but no plugin names were extracted (empty object/array, or unresolved JS). Confirm the pipeline is intentional.",
        });
    }
    const deprecatedHits = [];
    const adviceBits = [];
    for (const p of listed.plugins) {
        const base = p.replace(/^require\s*\(\s*['"]|['"]\s*\)$/g, "");
        for (const d of DEPRECATED_PLUGINS) {
            if (d.match.test(base) || d.match.test(p)) {
                deprecatedHits.push(d.name);
                adviceBits.push(d.advice);
            }
        }
    }
    if (deprecatedHits.length) {
        findings.push({
            severity: "warn",
            rule: "deprecated_plugins",
            advice: `Deprecated / unmaintained plugin(s): ${[...new Set(deprecatedHits)].join(", ")}. ${[...new Set(adviceBits)].join(" ")}`,
        });
    }
    const hasAutoprefixer = listed.plugins.some((n) => n === "autoprefixer" || /(?:^|\/)autoprefixer$/.test(n));
    if (hasAutoprefixer && !hasBrowserslistHint(raw, source, listed.plugins)) {
        findings.push({
            severity: "info",
            rule: "autoprefixer_browserslist_tip",
            advice: "autoprefixer is present without browserslist / overrideBrowserslist in this text — Autoprefixer may fall back to browserslist config files on disk (not visible here) or defaults. Set browserslist (package.json or .browserslistrc) or autoprefixer.overrideBrowserslist for reproducible prefixes.",
        });
    }
    if (hasAutoprefixer && autoprefixerUsesDeprecatedBrowsers(raw, source)) {
        findings.push({
            severity: "info",
            rule: "autoprefixer_browsers_deprecated",
            advice: "autoprefixer `browsers` option is deprecated — use overrideBrowserslist or a project browserslist file.",
        });
    }
    const syntax = extractSyntaxHint(raw, source);
    if (syntax.syntax && (syntax.parser || syntax.stringifier)) {
        findings.push({
            severity: "info",
            rule: "syntax_and_parser",
            advice: "Both `syntax` and `parser`/`stringifier` are set. `syntax` already provides parser+stringifier — the extra fields are usually redundant unless you intentionally mix packages.",
        });
    }
    const maps = extractMapOptions(raw, source);
    if (maps.map === true) {
        findings.push({
            severity: "info",
            rule: "inline_sourcemap",
            advice: "map: true asks PostCSS for annotation+inline-friendly maps depending on runner. For libraries prefer map: { inline: false } (external .map); for tiny debug snippets inline is fine.",
        });
    }
    else if (asMap(maps.map)?.inline === true) {
        findings.push({
            severity: "info",
            rule: "inline_sourcemap",
            advice: "map.inline: true embeds source maps in CSS — fine for debugging, but grows publish size. Prefer inline: false (external .map) for production artifacts.",
        });
    }
    return findings;
}
