/**
 * Shared rollup config text helpers.
 * Prefer robust JSONC; JS/TS configs via best-effort regex (no eval).
 * No rollup binary, no network, no filesystem follow.
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
        const ident = /^([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)/.exec(inner.slice(i));
        if (ident) {
            let j = i + ident[0].length;
            while (j < inner.length && /\s/.test(inner[j]))
                j++;
            if (inner[j] === "(") {
                const par = extractBalancedParen(inner, j);
                if (par) {
                    const callish = ident[0] + par;
                    // Treat plugin factories as named callables
                    if (key === "plugins" ||
                        /plugin/i.test(ident[0]) ||
                        /^[a-z][\w$]*$/.test(ident[0])) {
                        out[key] = { __call: ident[0], __args: par };
                    }
                    else {
                        const v = valueFromCallish(callish);
                        out[key] = v !== undefined ? v : callish;
                    }
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
        /(?:module\.exports\s*=\s*|export\s+default\s*|exports\.default\s*=\s*)(?:defineConfig\s*\(\s*)?\{/,
        /(?:module\.exports\s*=\s*|export\s+default\s*)\([^)]*\)\s*=>\s*\(\s*\{/,
        /(?:module\.exports\s*=\s*|export\s+default\s*)\([^)]*\)\s*=>\s*\{/,
        /(?:module\.exports\s*=\s*|export\s+default\s*)function\s*\([^)]*\)\s*\{/,
        /(?:module\.exports\s*=\s*|export\s+default\s*)defineConfig\s*\(\s*\{/,
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
    const arrM = /(?:module\.exports\s*=\s*|export\s+default\s*)\[/.exec(src);
    if (arrM) {
        const bal = extractBalanced(src, arrM.index + arrM[0].indexOf("["));
        if (bal)
            return bal;
    }
    return null;
}
export function heuristicExtractJs(text) {
    const src = text ?? "";
    let out = {};
    const exported = findExportObject(src);
    if (exported) {
        if (exported.startsWith("[")) {
            const arr = heuristicArrayLiteral(exported);
            const maps = arr
                .map(asMap)
                .filter((x) => !!x);
            if (maps.length) {
                out = { ...maps[0] };
                out.__multi = maps;
            }
        }
        else {
            out = { ...heuristicObjectLiteral(exported) };
        }
    }
    if (out.input === undefined) {
        const mArr = /\binput\s*:\s*\[/.exec(src);
        const mObj = /\binput\s*:\s*\{/.exec(src);
        const mStr = /\binput\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(src);
        if (mArr) {
            const bal = extractBalanced(src, mArr.index + mArr[0].indexOf("["));
            if (bal)
                out.input = heuristicArrayLiteral(bal);
        }
        else if (mObj) {
            const bal = extractBalanced(src, mObj.index + mObj[0].indexOf("{"));
            if (bal)
                out.input = heuristicObjectLiteral(bal);
        }
        else if (mStr) {
            out.input = unescapeStr(mStr[2]);
        }
    }
    if (out.output === undefined) {
        const mArr = /\boutput\s*:\s*\[/.exec(src);
        const mObj = /\boutput\s*:\s*\{/.exec(src);
        if (mArr) {
            const bal = extractBalanced(src, mArr.index + mArr[0].indexOf("["));
            if (bal)
                out.output = heuristicArrayLiteral(bal);
        }
        else if (mObj) {
            const bal = extractBalanced(src, mObj.index + mObj[0].indexOf("{"));
            if (bal)
                out.output = heuristicObjectLiteral(bal);
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
    if (out.external === undefined) {
        const mArr = /\bexternal\s*:\s*\[/.exec(src);
        const mStr = /\bexternal\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(src);
        if (mArr) {
            const bal = extractBalanced(src, mArr.index + mArr[0].indexOf("["));
            if (bal)
                out.external = heuristicArrayLiteral(bal);
        }
        else if (mStr) {
            out.external = unescapeStr(mStr[2]);
        }
        else if (/\bexternal\s*:\s*(?:function|\()/.test(src)) {
            out.external = "__function__";
        }
    }
    if (out.sourcemap === undefined) {
        const m = /\bsourcemap\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(src);
        if (m)
            out.sourcemap = unescapeStr(m[2]);
        else if (/\bsourcemap\s*:\s*true\b/.test(src))
            out.sourcemap = true;
        else if (/\bsourcemap\s*:\s*false\b/.test(src))
            out.sourcemap = false;
        else if (/\bsourcemap\s*:\s*(["'`])inline\1/.test(src))
            out.sourcemap = "inline";
        else if (/\bsourcemap\s*:\s*(["'`])hidden\1/.test(src))
            out.sourcemap = "hidden";
    }
    return out;
}
function coalesceConfigs(raw) {
    if (Array.isArray(raw)) {
        const maps = raw
            .map(asMap)
            .filter((x) => !!x);
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
export function parseRollupConfigText(text) {
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
                    multiConfig: multi,
                    source: trimmed,
                };
            }
            return {
                raw: null,
                format: "jsonc",
                parseError: "rollup config root must be a JSON object or array of objects",
                source: trimmed,
            };
        }
        catch {
            // fall through
        }
    }
    if (looksLikeJs(trimmed) ||
        /\binput\s*:/.test(trimmed) ||
        /\boutput\s*:/.test(trimmed) ||
        /\bplugins\s*:\s*\[/.test(trimmed) ||
        /\bexternal\s*:/.test(trimmed)) {
        const extracted = heuristicExtractJs(trimmed);
        const { map, multi } = coalesceConfigs(extracted);
        if (map && Object.keys(map).filter((k) => k !== "__multi").length > 0) {
            return {
                raw: map,
                format: "js-heuristic",
                heuristic: true,
                multiConfig: multi,
                source: trimmed,
            };
        }
        return {
            raw: null,
            format: "js-heuristic",
            parseError: "JS config heuristics found no rollup options (limits: no eval; regex extraction only)",
            heuristic: true,
            source: trimmed,
        };
    }
    return {
        raw: null,
        format: "unknown",
        parseError: "Unrecognized rollup config text",
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
    return undefined;
}
function inputsFromValue(value, name) {
    if (value === undefined || value === null)
        return [];
    if (typeof value === "string" || typeof value === "number") {
        const s = String(value);
        return name ? [`${name}:${s}`] : [s];
    }
    if (Array.isArray(value)) {
        const out = [];
        for (const v of value) {
            out.push(...inputsFromValue(v, name));
        }
        return out;
    }
    const map = asMap(value);
    if (!map)
        return [];
    const out = [];
    for (const [k, v] of Object.entries(map)) {
        if (k.startsWith("__"))
            continue;
        if (typeof v === "string" || typeof v === "number") {
            out.push(`${k}:${String(v)}`);
        }
        else {
            out.push(...inputsFromValue(v, k));
        }
    }
    return out;
}
export function extractInputs(raw) {
    if (!raw)
        return { input: undefined, inputs: [], count: 0 };
    const sources = Array.isArray(raw.__multi)
        ? raw.__multi
            .map(asMap)
            .filter((x) => !!x)
        : [raw];
    const inputs = [];
    let firstInput = raw.input;
    for (const cfg of sources) {
        if (firstInput === undefined && cfg.input !== undefined)
            firstInput = cfg.input;
        inputs.push(...inputsFromValue(cfg.input));
    }
    // de-dupe preserving order
    const seen = new Set();
    const unique = [];
    for (const s of inputs) {
        if (seen.has(s))
            continue;
        seen.add(s);
        unique.push(s);
    }
    return { input: firstInput, inputs: unique, count: unique.length };
}
function normalizeFormat(fmt) {
    if (typeof fmt !== "string")
        return undefined;
    const f = fmt.trim().toLowerCase();
    if (f === "esm" || f === "module")
        return "es";
    if (f === "commonjs")
        return "cjs";
    return f || undefined;
}
function outputFromMap(map) {
    const item = {};
    const file = stringifyPathish(map.file);
    const dir = stringifyPathish(map.dir);
    const format = normalizeFormat(map.format);
    const name = stringifyPathish(map.name) ?? stringifyPathish(map.moduleName);
    const exports_ = stringifyPathish(map.exports);
    if (file)
        item.file = file;
    if (dir)
        item.dir = dir;
    if (format)
        item.format = format;
    if (name)
        item.name = name;
    if (exports_)
        item.exports = exports_;
    return item;
}
export function extractOutputs(raw) {
    if (!raw)
        return { outputs: [], formats: [], count: 0 };
    const sources = Array.isArray(raw.__multi)
        ? raw.__multi
            .map(asMap)
            .filter((x) => !!x)
        : [raw];
    const outputs = [];
    for (const cfg of sources) {
        const outVal = cfg.output;
        if (outVal === undefined || outVal === null)
            continue;
        if (Array.isArray(outVal)) {
            for (const item of outVal) {
                const m = asMap(item);
                if (m)
                    outputs.push(outputFromMap(m));
            }
            continue;
        }
        const m = asMap(outVal);
        if (m)
            outputs.push(outputFromMap(m));
    }
    const formats = [];
    const seen = new Set();
    for (const o of outputs) {
        if (!o.format)
            continue;
        if (seen.has(o.format))
            continue;
        seen.add(o.format);
        formats.push(o.format);
    }
    return { outputs, formats, count: outputs.length };
}
function pluginNameFromItem(item) {
    if (typeof item === "string") {
        const s = item.trim();
        return s || undefined;
    }
    const map = asMap(item);
    if (!map)
        return undefined;
    if (typeof map.__new === "string")
        return map.__new;
    if (typeof map.__call === "string")
        return map.__call;
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
                const callRe = /\b([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*\(/g;
                while ((nm = callRe.exec(bal)) !== null) {
                    const name = nm[1];
                    if (name === "require" ||
                        name === "new" ||
                        name === "if" ||
                        name === "function" ||
                        name === "Boolean" ||
                        name === "Array" ||
                        name === "Object" ||
                        name === "String" ||
                        name === "Number") {
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
    }
    return { plugins: names, count: names.length };
}
const DEPRECATED_OPTIONS = [
    {
        test: (blob, raw) => /\bmoduleName\b/.test(blob) || raw.moduleName !== undefined,
        rule: "deprecated_moduleName",
        advice: "output.moduleName is deprecated — use output.name for UMD/IIFE global name.",
    },
    {
        test: (blob, raw) => raw.legacy === true || /["']?legacy["']?\s*:\s*true\b/.test(blob),
        rule: "deprecated_legacy",
        advice: "legacy: true is a Rollup 0.x / early-1.x option — remove it; modern Rollup does not use legacy mode.",
    },
    {
        test: (blob) => /\bindent\s*:\s*(?:true|false|['"`])/.test(blob),
        rule: "deprecated_indent",
        advice: "output.indent as a top-level style toggle is rarely needed — prefer format defaults unless you have a measured formatting reason.",
    },
    {
        test: (blob, raw) => /\bpreferConst\b/.test(blob) || raw.preferConst !== undefined,
        rule: "deprecated_preferConst",
        advice: "preferConst moved under output — set output.generatedCode.constBindings (or generatedCode: 'es2015') instead of top-level preferConst.",
    },
    {
        test: (blob, raw) => (raw.freeze !== undefined && !asMap(raw.output)) ||
            /\bfreeze\s*:/.test(blob),
        rule: "deprecated_freeze",
        advice: "top-level freeze is deprecated — use output.freeze / output.generatedCode.objectShorthand guidance in current Rollup docs.",
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
function hasExternal(raw) {
    return raw.external !== undefined && raw.external !== null;
}
export function lintRollupConfig(raw, parseError, format, source, multiConfig) {
    const findings = [];
    if (parseError) {
        findings.push({
            severity: "error",
            rule: "invalid_config",
            advice: `Could not parse rollup config: ${parseError}`,
        });
        return findings;
    }
    if (!raw) {
        findings.push({
            severity: "info",
            rule: "empty_config",
            advice: "No rollup config content provided (empty input).",
        });
        return findings;
    }
    const keys = Object.keys(raw).filter((k) => k !== "__multi");
    if (keys.length === 0) {
        findings.push({
            severity: "info",
            rule: "empty_config",
            advice: "Parsed config object is empty — no rollup options detected.",
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
    if (multiConfig) {
        findings.push({
            severity: "info",
            rule: "multi_config",
            advice: "Config exports an array of rollup configs. Input/plugin/output extraction is flattened best-effort across objects.",
        });
    }
    const inputs = extractInputs(raw);
    if (inputs.count === 0 && raw.input === undefined) {
        findings.push({
            severity: "warn",
            rule: "missing_input",
            advice: "No input is set. Rollup requires input (string, array, or { name: path } map) — set it explicitly so the graph entry is obvious.",
        });
    }
    const outs = extractOutputs(raw);
    if (outs.count === 0 && raw.output === undefined) {
        findings.push({
            severity: "warn",
            rule: "missing_output",
            advice: "No output is set. Provide output (object or array) with at least file or dir, and usually format (es/cjs/umd/iife/amd/system).",
        });
    }
    for (const o of outs.outputs) {
        const fmt = o.format;
        if ((fmt === "umd" || fmt === "iife") &&
            (!o.name || !String(o.name).trim())) {
            findings.push({
                severity: "warn",
                rule: "umd_iife_without_name",
                advice: `output.format "${fmt}" needs output.name (global variable). Without it Rollup fails or emits an unnamed IIFE/UMD wrapper.`,
            });
        }
        if (o.file && o.dir) {
            findings.push({
                severity: "warn",
                rule: "file_and_dir_conflict",
                advice: "output.file and output.dir should not both be set on the same output — use file for single-file builds or dir for code-splitting / multiple chunks.",
            });
        }
        if (!o.file && !o.dir && outs.count > 0) {
            findings.push({
                severity: "info",
                rule: "sparse_output",
                advice: "An output entry has neither file nor dir — confirm the emit path is intentional (or set one).",
            });
        }
        if (!fmt) {
            findings.push({
                severity: "info",
                rule: "missing_format",
                advice: "An output entry has no format — Rollup defaults to 'es'. Set format explicitly when shipping CJS/UMD/IIFE consumers.",
            });
        }
    }
    // external tip: browser-ish formats without external may pull node builtins
    const browserFormats = outs.formats.filter((f) => ["umd", "iife", "amd"].includes(f));
    if (browserFormats.length && !hasExternal(raw)) {
        findings.push({
            severity: "info",
            rule: "external_tip",
            advice: "Browser-oriented formats (umd/iife/amd) without external: [...] may bundle Node built-ins or peer deps unintentionally. Mark runtime peers (react, lodash, …) as external when consumers provide them.",
        });
    }
    // sourcemap tips — check top-level and per-output
    const blob = `${source ?? ""}\n${stringifyUnknown(raw)}`;
    const smInline = /\bsourcemap\s*:\s*(['"`])inline\1/.test(blob) ||
        raw.sourcemap === "inline";
    const smTrue = /\bsourcemap\s*:\s*true\b/.test(blob) || raw.sourcemap === true;
    if (smInline) {
        findings.push({
            severity: "info",
            rule: "inline_sourcemap",
            advice: "sourcemap: 'inline' embeds maps in the bundle — fine for debugging, but grows publish size. Prefer sourcemap: true (external .map) for libraries, or false for minimal shipping artifacts.",
        });
    }
    else if (smTrue) {
        findings.push({
            severity: "info",
            rule: "sourcemap_tip",
            advice: "sourcemap: true emits companion .map files — publish them only if consumers/debuggers need them; otherwise set false or use hidden maps via tooling.",
        });
    }
    for (const d of DEPRECATED_OPTIONS) {
        if (d.test(blob, raw)) {
            findings.push({
                severity: "warn",
                rule: d.rule,
                advice: d.advice,
            });
        }
    }
    if (outs.count === 0 && raw.plugins !== undefined && inputs.count > 0) {
        // already covered missing_output
    }
    return findings;
}
