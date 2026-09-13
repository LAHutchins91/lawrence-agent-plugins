/**
 * Shared webpack config text helpers.
 * Prefer robust JSONC; JS/TS configs via best-effort regex (no eval).
 * No webpack binary, no network, no filesystem follow.
 */
export function asMap(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value;
    }
    return null;
}
/**
 * Strip // line comments and block comments from JSONC-ish text,
 * respecting double-quoted strings (escape-aware).
 */
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
    if (/\bmodule\.exports\b/.test(t) ||
        /\bexport\s+default\b/.test(t) ||
        /\bexports\./.test(t) ||
        /\brequire\s*\(/.test(t) ||
        /\bimport\s+/.test(t) ||
        /\bsatisfies\b/.test(t)) {
        return true;
    }
    return false;
}
/**
 * Extract a balanced [...] or {...} starting at index (must be [ or {).
 * String-aware; best-effort for JS source.
 */
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
function stringsFromArrayLiteral(arrSrc) {
    const body = arrSrc.trim();
    if (!body.startsWith("[") || !body.endsWith("]"))
        return [];
    const inner = body.slice(1, -1);
    const out = [];
    const re = /(["'`])((?:\\.|(?!\1).)*)\1/g;
    let m;
    while ((m = re.exec(inner)) !== null) {
        out.push(m[2].replace(/\\(.)/g, "$1"));
    }
    return out;
}
function unescapeStr(s) {
    return s.replace(/\\(.)/g, "$1");
}
function extractRegexLiteral(src, start) {
    if (src[start] !== "/")
        return null;
    let i = start + 1;
    let escape = false;
    while (i < src.length) {
        const ch = src[i];
        if (escape) {
            escape = false;
            i++;
            continue;
        }
        if (ch === "\\") {
            escape = true;
            i++;
            continue;
        }
        if (ch === "/") {
            i++;
            while (i < src.length && /[gimsuy]/.test(src[i]))
                i++;
            return src.slice(start, i);
        }
        if (ch === "\n")
            return null;
        i++;
    }
    return null;
}
function stringsFromCall(callSrc) {
    const out = [];
    const re = /(["'`])((?:\\.|(?!\1).)*)\1/g;
    let m;
    while ((m = re.exec(callSrc)) !== null) {
        out.push(unescapeStr(m[2]));
    }
    return out;
}
function valueFromCallish(raw) {
    const t = raw.trim();
    const strs = stringsFromCall(t);
    if (strs.length === 1)
        return strs[0];
    if (strs.length > 1)
        return strs.join("/");
    return undefined;
}
/**
 * Heuristic: parse a shallow JS object literal into Record via regex.
 * Handles string/number/boolean, regex literals, nested objects/arrays,
 * and path.resolve-style calls (last string args joined).
 */
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
        if (ch === "/") {
            const reLit = extractRegexLiteral(inner, i);
            if (reLit) {
                out[key] = reLit;
                i += reLit.length;
                continue;
            }
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
        // new Foo(...) — store constructor name for plugins-ish values
        const newM = /^new\s+((?:[\w$]+(?:\.[\w$]+)*))/.exec(inner.slice(i));
        if (newM) {
            let j = i + newM[0].length;
            while (j < inner.length && /\s/.test(inner[j]))
                j++;
            if (inner[j] === "(") {
                const par = extractBalancedParen(inner, j);
                if (par)
                    j += par.length;
            }
            out[key] = { __new: newM[1] };
            i = j;
            continue;
        }
        // identifier or call: path.resolve(__dirname, 'dist')
        const ident = /^([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)/.exec(inner.slice(i));
        if (ident) {
            let j = i + ident[0].length;
            while (j < inner.length && /\s/.test(inner[j]))
                j++;
            if (inner[j] === "(") {
                const par = extractBalancedParen(inner, j);
                if (par) {
                    const callish = ident[0] + par;
                    const v = valueFromCallish(callish);
                    out[key] = v !== undefined ? v : callish;
                    i = j + par.length;
                    continue;
                }
            }
            out[key] = ident[0];
            i = j;
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
        if (inner[i] === "/") {
            const reLit = extractRegexLiteral(inner, i);
            if (reLit) {
                out.push(reLit);
                i += reLit.length;
                continue;
            }
        }
        const strM = /^(["'`])((?:\\.|(?!\1).)*)\1/.exec(inner.slice(i));
        if (strM) {
            out.push(unescapeStr(strM[2]));
            i += strM[0].length;
            continue;
        }
        const newM = /^new\s+((?:[\w$]+(?:\.[\w$]+)*))/.exec(inner.slice(i));
        if (newM) {
            let j = i + newM[0].length;
            while (j < inner.length && /\s/.test(inner[j]))
                j++;
            let args = "";
            if (inner[j] === "(") {
                const par = extractBalancedParen(inner, j);
                if (par) {
                    args = par;
                    j += par.length;
                }
            }
            out.push({ __new: newM[1], __args: args });
            i = j;
            continue;
        }
        const reqM = /^(?:require\s*\(\s*(["'`])((?:\\.|(?!\1).)*)\1\s*\)|new\s*\(\s*require\s*\(\s*(["'`])((?:\\.|(?!\3).)*)\3\s*\)\s*\))/.exec(inner.slice(i));
        if (reqM) {
            out.push(unescapeStr(reqM[2] ?? reqM[4] ?? ""));
            i += reqM[0].length;
            continue;
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
        /(?:module\.exports\s*=\s*|export\s+default\s*|exports\.default\s*=\s*)\{/,
        /(?:module\.exports\s*=\s*|export\s+default\s*)\([^)]*\)\s*=>\s*\(\s*\{/,
        /(?:module\.exports\s*=\s*|export\s+default\s*)\([^)]*\)\s*=>\s*\{/,
        /(?:module\.exports\s*=\s*|export\s+default\s*)function\s*\([^)]*\)\s*\{/,
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
        // function body: prefer return { ... }
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
    // export default foo; const foo = { ... }  — skip
    // array of configs: module.exports = [ { ... }, { ... } ]
    const arrM = /(?:module\.exports\s*=\s*|export\s+default\s*)\[/.exec(src);
    if (arrM) {
        const bal = extractBalanced(src, arrM.index + arrM[0].indexOf("["));
        if (bal)
            return bal;
    }
    return null;
}
/**
 * Heuristic JS/TS extraction for webpack.config.js / .ts / .mjs.
 * Limits: no eval, no require resolution, no spread/computed keys.
 */
export function heuristicExtractJs(text) {
    const src = text ?? "";
    let out = {};
    const exported = findExportObject(src);
    if (exported) {
        if (exported.startsWith("[")) {
            const arr = heuristicArrayLiteral(exported);
            const maps = arr.map(asMap).filter((x) => !!x);
            if (maps.length) {
                out = { ...maps[0] };
                out.__multi = maps;
            }
        }
        else {
            out = { ...heuristicObjectLiteral(exported) };
        }
    }
    // Top-level key fallbacks
    if (out.entry === undefined) {
        const mArr = /\bentry\s*:\s*\[/.exec(src);
        const mObj = /\bentry\s*:\s*\{/.exec(src);
        const mStr = /\bentry\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(src);
        if (mArr) {
            const bal = extractBalanced(src, mArr.index + mArr[0].indexOf("["));
            if (bal) {
                const list = stringsFromArrayLiteral(bal);
                if (list.length)
                    out.entry = list;
            }
        }
        else if (mObj) {
            const bal = extractBalanced(src, mObj.index + mObj[0].indexOf("{"));
            if (bal)
                out.entry = heuristicObjectLiteral(bal);
        }
        else if (mStr) {
            out.entry = unescapeStr(mStr[2]);
        }
    }
    if (out.mode === undefined) {
        const m = /\bmode\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(src);
        if (m)
            out.mode = unescapeStr(m[2]);
    }
    if (out.output === undefined) {
        const m = /\boutput\s*:\s*\{/.exec(src);
        if (m) {
            const bal = extractBalanced(src, m.index + m[0].indexOf("{"));
            if (bal)
                out.output = heuristicObjectLiteral(bal);
        }
    }
    if (out.module === undefined) {
        const m = /\bmodule\s*:\s*\{/.exec(src);
        if (m) {
            const bal = extractBalanced(src, m.index + m[0].indexOf("{"));
            if (bal)
                out.module = heuristicObjectLiteral(bal);
        }
    }
    if (out.plugins === undefined) {
        const m = /\bplugins\s*:\s*\[/.exec(src);
        if (m) {
            const bal = extractBalanced(src, m.index + m[0].indexOf("["));
            if (bal)
                out.plugins = heuristicArrayLiteral(bal);
        }
    }
    if (out.devtool === undefined) {
        const m = /\bdevtool\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(src);
        if (m)
            out.devtool = unescapeStr(m[2]);
        else if (/\bdevtool\s*:\s*false\b/.test(src))
            out.devtool = false;
    }
    if (out.optimization === undefined) {
        const m = /\boptimization\s*:\s*\{/.exec(src);
        if (m) {
            const bal = extractBalanced(src, m.index + m[0].indexOf("{"));
            if (bal)
                out.optimization = heuristicObjectLiteral(bal);
        }
    }
    if (out.target === undefined) {
        const m = /\btarget\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(src);
        if (m)
            out.target = unescapeStr(m[2]);
    }
    return out;
}
function coalesceConfigs(raw) {
    if (Array.isArray(raw)) {
        const maps = raw.map(asMap).filter((x) => !!x);
        if (!maps.length)
            return { map: null, multi: true };
        const first = { ...maps[0] };
        if (maps.length > 1)
            first.__multi = maps;
        return { map: first, multi: maps.length > 1 };
    }
    const map = asMap(raw);
    if (map && Array.isArray(map.__multi)) {
        return { map, multi: true };
    }
    return { map, multi: false };
}
export function parseWebpackConfigText(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed) {
        return { raw: null, format: "empty", source: text ?? "" };
    }
    {
        const stripped = stripJsonComments(trimmed);
        try {
            const raw = JSON.parse(stripped);
            const { map, multi } = coalesceConfigs(raw);
            if (map) {
                return {
                    raw: map,
                    format: "jsonc",
                    multiCompiler: multi,
                    source: trimmed,
                };
            }
            return {
                raw: null,
                format: "jsonc",
                parseError: "webpack config root must be a JSON object or array of objects",
                source: trimmed,
            };
        }
        catch {
            // fall through
        }
    }
    if (looksLikeJs(trimmed) ||
        /\bentry\s*:/.test(trimmed) ||
        /\boutput\s*:/.test(trimmed) ||
        /\bmodule\s*:\s*\{/.test(trimmed) ||
        /\bplugins\s*:\s*\[/.test(trimmed) ||
        /\bmode\s*:/.test(trimmed)) {
        const extracted = heuristicExtractJs(trimmed);
        const { map, multi } = coalesceConfigs(extracted);
        if (map && Object.keys(map).filter((k) => k !== "__multi").length > 0) {
            return {
                raw: map,
                format: "js-heuristic",
                heuristic: true,
                multiCompiler: multi,
                source: trimmed,
            };
        }
        return {
            raw: null,
            format: "js-heuristic",
            parseError: "JS config heuristics found no webpack options (limits: no eval; regex extraction only)",
            heuristic: true,
            source: trimmed,
        };
    }
    return {
        raw: null,
        format: "unknown",
        parseError: "Unrecognized webpack config text",
        source: trimmed,
    };
}
function stringifyPathish(value) {
    if (typeof value === "string") {
        const s = value.trim();
        return s || undefined;
    }
    if (typeof value === "number")
        return String(value);
    if (Array.isArray(value)) {
        const parts = value
            .filter((x) => typeof x === "string" || typeof x === "number")
            .map((x) => String(x));
        return parts.length ? parts.join(", ") : undefined;
    }
    const map = asMap(value);
    if (map) {
        if (typeof map.import === "string")
            return map.import;
        if (Array.isArray(map.import)) {
            const parts = map.import.filter((x) => typeof x === "string");
            if (parts.length)
                return parts.join(", ");
        }
    }
    return undefined;
}
function entriesFromValue(value, name) {
    if (value === undefined || value === null)
        return [];
    if (typeof value === "string" || typeof value === "number") {
        const item = { path: String(value) };
        if (name)
            item.name = name;
        return [item];
    }
    if (Array.isArray(value)) {
        const out = [];
        for (const v of value) {
            out.push(...entriesFromValue(v, name));
        }
        return out;
    }
    const map = asMap(value);
    if (!map)
        return [];
    // descriptor: { import: '...' }
    if (map.import !== undefined) {
        const p = stringifyPathish(map);
        const item = {};
        if (name)
            item.name = name;
        if (p)
            item.path = p;
        return Object.keys(item).length ? [item] : [];
    }
    // named entries object
    const out = [];
    for (const [k, v] of Object.entries(map)) {
        if (k.startsWith("__"))
            continue;
        out.push(...entriesFromValue(v, k));
    }
    return out;
}
export function extractEntryPoints(raw) {
    if (!raw)
        return { entry: undefined, entries: [] };
    const multi = Array.isArray(raw.__multi)
        ? raw.__multi
        : null;
    const sources = multi
        ? multi.map(asMap).filter((x) => !!x)
        : [raw];
    const entries = [];
    let firstEntry = raw.entry;
    for (const cfg of sources) {
        if (firstEntry === undefined && cfg.entry !== undefined)
            firstEntry = cfg.entry;
        entries.push(...entriesFromValue(cfg.entry));
    }
    const result = {
        entry: firstEntry,
        entries,
    };
    const mode = raw.mode;
    if (typeof mode === "string")
        result.mode = mode;
    const outputMap = asMap(raw.output);
    if (outputMap) {
        const output = {};
        const p = stringifyPathish(outputMap.path);
        const f = stringifyPathish(outputMap.filename);
        const pub = stringifyPathish(outputMap.publicPath);
        if (p)
            output.path = p;
        if (f)
            output.filename = f;
        if (pub)
            output.publicPath = pub;
        if (Object.keys(output).length)
            result.output = output;
    }
    return result;
}
function asStringish(value) {
    if (typeof value === "string")
        return value;
    if (typeof value === "number")
        return String(value);
    return undefined;
}
function flattenUse(value) {
    if (value === undefined || value === null)
        return undefined;
    if (typeof value === "string" || typeof value === "number")
        return String(value);
    if (Array.isArray(value)) {
        const names = [];
        for (const item of value) {
            if (typeof item === "string" || typeof item === "number") {
                names.push(String(item));
                continue;
            }
            const m = asMap(item);
            if (m && (typeof m.loader === "string" || typeof m.loader === "number")) {
                names.push(String(m.loader));
            }
        }
        if (names.length === 1)
            return names[0];
        if (names.length)
            return names;
        return value;
    }
    const m = asMap(value);
    if (m && (typeof m.loader === "string" || typeof m.loader === "number")) {
        return String(m.loader);
    }
    return value;
}
function ruleFromMap(map) {
    const rule = {};
    const test = asStringish(map.test);
    if (test)
        rule.test = test;
    const loader = asStringish(map.loader);
    if (loader)
        rule.loader = loader;
    const use = flattenUse(map.use);
    if (use !== undefined)
        rule.use = use;
    const exclude = asStringish(map.exclude);
    if (exclude)
        rule.exclude = exclude;
    else if (Array.isArray(map.exclude)) {
        const parts = map.exclude
            .filter((x) => typeof x === "string" || typeof x === "number")
            .map((x) => String(x));
        if (parts.length)
            rule.exclude = parts.join(", ");
    }
    return rule;
}
function collectRules(rulesVal) {
    if (!Array.isArray(rulesVal))
        return [];
    const out = [];
    for (const item of rulesVal) {
        const map = asMap(item);
        if (!map)
            continue;
        if (Array.isArray(map.oneOf)) {
            const nested = collectRules(map.oneOf);
            if (nested.length)
                out.push(...nested);
            else
                out.push(ruleFromMap(map));
            continue;
        }
        if (Array.isArray(map.rules)) {
            out.push(...collectRules(map.rules));
            continue;
        }
        out.push(ruleFromMap(map));
    }
    return out;
}
export function extractLoaders(raw) {
    if (!raw)
        return { rules: [], count: 0 };
    const sources = Array.isArray(raw.__multi)
        ? raw.__multi
            .map(asMap)
            .filter((x) => !!x)
        : [raw];
    const rules = [];
    for (const cfg of sources) {
        const mod = asMap(cfg.module);
        if (!mod)
            continue;
        rules.push(...collectRules(mod.rules));
    }
    return { rules, count: rules.length };
}
function pluginNameFromItem(item) {
    if (typeof item === "string") {
        const s = item.trim();
        return s || undefined;
    }
    const map = asMap(item);
    if (map && typeof map.__new === "string")
        return map.__new;
    return undefined;
}
/**
 * Best-effort plugin names from parsed plugins array plus source regex.
 */
export function extractPlugins(raw, source) {
    const names = [];
    const seen = new Set();
    const push = (n) => {
        if (!n)
            return;
        const t = n.trim();
        if (!t || seen.has(t))
            return;
        seen.add(t);
        names.push(t);
    };
    if (raw) {
        const sources = Array.isArray(raw.__multi)
            ? raw.__multi
                .map(asMap)
                .filter((x) => !!x)
            : [raw];
        for (const cfg of sources) {
            if (!Array.isArray(cfg.plugins))
                continue;
            for (const item of cfg.plugins)
                push(pluginNameFromItem(item));
        }
    }
    if (source) {
        const m = /\bplugins\s*:\s*\[/.exec(source);
        if (m) {
            const bal = extractBalanced(source, m.index + m[0].indexOf("["));
            if (bal) {
                const newRe = /\bnew\s+(?:\(\s*require\s*\(\s*(["'`])((?:\\.|(?!\1).)*)\1\s*\)\s*\)|((?:[\w$]+(?:\.[\w$]+)*)))/g;
                let nm;
                while ((nm = newRe.exec(bal)) !== null) {
                    push(nm[2] ? unescapeStr(nm[2]) : nm[3]);
                }
                const reqRe = /\brequire\s*\(\s*(["'`])((?:\\.|(?!\1).)*)\1\s*\)/g;
                while ((nm = reqRe.exec(bal)) !== null) {
                    push(unescapeStr(nm[2]));
                }
            }
        }
    }
    return { plugins: names, count: names.length };
}
const DEPRECATED_LOADERS = [
    {
        needle: "file-loader",
        advice: "file-loader is deprecated in webpack 5 — prefer asset/resource (or type: 'asset/resource').",
    },
    {
        needle: "url-loader",
        advice: "url-loader is deprecated in webpack 5 — prefer type: 'asset' or 'asset/inline' with parser.dataUrlCondition.",
    },
    {
        needle: "raw-loader",
        advice: "raw-loader is deprecated in webpack 5 — prefer type: 'asset/source'.",
    },
    {
        needle: "json-loader",
        advice: "json-loader is unnecessary in webpack 5 — JSON is handled natively.",
    },
    {
        needle: "null-loader",
        advice: "null-loader is unmaintained — prefer IgnorePlugin or NormalModuleReplacementPlugin.",
    },
    {
        needle: "extract-text-webpack-plugin",
        advice: "extract-text-webpack-plugin is webpack 4 era — prefer mini-css-extract-plugin.",
    },
    {
        needle: "awesome-typescript-loader",
        advice: "awesome-typescript-loader is unmaintained — prefer ts-loader or babel-loader.",
    },
    {
        needle: "uglifyjs-webpack-plugin",
        advice: "uglifyjs-webpack-plugin is deprecated — webpack 5 uses terser-webpack-plugin by default.",
    },
];
const SECRET_KEY_RE = /(?:secret|token|password|passwd|api[_-]?key|private[_-]?key|auth(?:_?token)?|credential|access[_-]?key)/i;
function stringifyUnknown(v) {
    try {
        return JSON.stringify(v) ?? "";
    }
    catch {
        return String(v);
    }
}
function collectLoaderNeedles(rules) {
    const out = [];
    for (const r of rules) {
        if (r.loader)
            out.push(r.loader);
        if (typeof r.use === "string")
            out.push(r.use);
        if (Array.isArray(r.use)) {
            for (const u of r.use)
                if (typeof u === "string")
                    out.push(u);
        }
    }
    return out;
}
function definePluginSecrets(raw, source) {
    const blob = `${source ?? ""}\n${stringifyUnknown(raw)}`;
    if (!/DefinePlugin/.test(blob))
        return false;
    // Look for secret-ish keys with a nearby string literal that is not process.env
    const re = /(["'`])([^"'`]*(?:SECRET|TOKEN|PASSWORD|PASSWD|API[_-]?KEY|PRIVATE[_-]?KEY|AUTH|CREDENTIAL|ACCESS[_-]?KEY)[^"`']*)\1\s*:\s*(?:JSON\.stringify\s*\(\s*(["'`])((?:\\.|(?!\3).)*)\3|((["'`])((?:\\.|(?!\6).)*)\6))/gi;
    let m;
    while ((m = re.exec(blob)) !== null) {
        const val = m[4] ?? m[7] ?? "";
        if (!val)
            continue;
        if (/^process\.env\b/.test(val))
            continue;
        if (SECRET_KEY_RE.test(m[2]) || SECRET_KEY_RE.test(m[0]))
            return true;
    }
    // Simpler fallback: DefinePlugin + hardcoded quoted secret-looking assignment
    if (/DefinePlugin/.test(blob) &&
        SECRET_KEY_RE.test(blob) &&
        /JSON\.stringify\s*\(\s*['"`][^'"`]+['"`]/.test(blob)) {
        return true;
    }
    return false;
}
export function lintWebpackConfig(raw, parseError, format, source, multiCompiler) {
    const findings = [];
    if (parseError) {
        findings.push({
            severity: "error",
            rule: "invalid_config",
            advice: `Could not parse webpack config: ${parseError}`,
        });
        return findings;
    }
    if (!raw) {
        findings.push({
            severity: "info",
            rule: "empty_config",
            advice: "No webpack config content provided (empty input).",
        });
        return findings;
    }
    const keys = Object.keys(raw).filter((k) => k !== "__multi");
    if (keys.length === 0) {
        findings.push({
            severity: "info",
            rule: "empty_config",
            advice: "Parsed config object is empty — no webpack options detected.",
        });
        return findings;
    }
    if (format === "js-heuristic") {
        findings.push({
            severity: "info",
            rule: "js_heuristic_limits",
            advice: "JS/TS config was parsed with best-effort string heuristics (no eval). Nested spreads, computed keys, dynamic requires, and function-returned configs are not fully resolved — verify critical values manually. Prefer JSON/JSONC when possible for unambiguous parse.",
        });
    }
    if (multiCompiler) {
        findings.push({
            severity: "info",
            rule: "multi_compiler",
            advice: "Config exports an array of webpack configs (multi-compiler). Entry/loader/plugin extraction is flattened best-effort across objects.",
        });
    }
    const ep = extractEntryPoints(raw);
    if (ep.entries.length === 0 && raw.entry === undefined) {
        findings.push({
            severity: "warn",
            rule: "missing_entry",
            advice: "No entry is set. webpack 5 defaults to ./src/index.js — set entry explicitly so the bundle graph is obvious.",
        });
    }
    const outMap = asMap(raw.output);
    if (!outMap) {
        findings.push({
            severity: "warn",
            rule: "missing_output",
            advice: "No output object is set. webpack defaults to ./dist/[name].js — set output.path / filename (and publicPath if assets are hosted) explicitly.",
        });
    }
    else {
        if (outMap.path === undefined && outMap.filename === undefined) {
            findings.push({
                severity: "info",
                rule: "sparse_output",
                advice: "output is present but path and filename are missing — confirm webpack defaults match the intended emit layout.",
            });
        }
    }
    const mode = typeof raw.mode === "string" ? raw.mode : undefined;
    if (!mode) {
        findings.push({
            severity: "info",
            rule: "missing_mode",
            advice: "No mode is set. webpack warns without it — set mode: 'development' | 'production' | 'none' (or pass --mode) so defaults for minimize/devtool/DefinePlugin NODE_ENV are predictable.",
        });
    }
    if (mode === "production" && raw.optimization === undefined) {
        findings.push({
            severity: "info",
            rule: "production_without_optimization",
            advice: "mode is 'production' but no optimization block is set. webpack 5 already minifies; consider splitChunks / runtimeChunk / usedExports only when you have a measured reason.",
        });
    }
    const devtool = typeof raw.devtool === "string"
        ? raw.devtool
        : raw.devtool === false
            ? "false"
            : undefined;
    if (mode === "production" && devtool && devtool !== "false") {
        if (/eval/i.test(devtool)) {
            findings.push({
                severity: "warn",
                rule: "eval_source_map_in_production",
                advice: `devtool "${devtool}" uses eval and is set with mode production — this bloats bundles and can leak sources. Prefer false, hidden-source-map, or nosources-source-map for production.`,
            });
        }
        else if (/source-map/i.test(devtool) && !/hidden|nosources/i.test(devtool)) {
            findings.push({
                severity: "info",
                rule: "source_map_in_production",
                advice: `devtool "${devtool}" with mode production publishes full sources. If maps are uploaded to an error tracker, prefer hidden-source-map; otherwise consider nosources-source-map or disable devtool.`,
            });
        }
        if (/cheap-module-eval-source-map/.test(devtool)) {
            findings.push({
                severity: "info",
                rule: "webpack4_devtool_name",
                advice: "cheap-module-eval-source-map is webpack 4 naming — webpack 5 uses eval-cheap-module-source-map.",
            });
        }
    }
    const loaders = extractLoaders(raw);
    const needles = collectLoaderNeedles(loaders.rules).join("\n");
    const pluginBlob = extractPlugins(raw, source).plugins.join("\n");
    const hay = `${needles}\n${pluginBlob}\n${source ?? ""}`;
    for (const d of DEPRECATED_LOADERS) {
        if (hay.toLowerCase().includes(d.needle.toLowerCase())) {
            findings.push({
                severity: "warn",
                rule: `deprecated_${d.needle.replace(/[^a-z0-9]+/gi, "_")}`,
                advice: d.advice,
            });
        }
    }
    if (definePluginSecrets(raw, source)) {
        findings.push({
            severity: "warn",
            rule: "define_plugin_secret",
            advice: "DefinePlugin appears to inline a secret-looking string (API key / token / password). Prefer injecting via process.env at build time and keep secrets out of the repo and the client bundle — this is a smell check, not a secret scanner.",
        });
    }
    if (loaders.count === 0 && raw.module !== undefined) {
        findings.push({
            severity: "info",
            rule: "empty_module_rules",
            advice: "module is set but no rules were extracted — check module.rules (or oneOf) syntax.",
        });
    }
    return findings;
}
