/**
 * Shared babel config text helpers.
 * Prefer robust JSONC; JS/TS configs via best-effort regex (no eval).
 * No babel binary, no network, no filesystem follow.
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
        /\bapi\.cache\b/.test(t));
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
                out[key] = { __call: name, __args: par };
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
        /(?:module\.exports\s*=\s*|export\s+default\s*)(?:function\s*)?\(\s*api\s*\)\s*\{/,
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
        if (/function\s*\(/.test(m[0]) || /=>\s*\{/.test(m[0]) || /\(\s*api\s*\)/.test(m[0])) {
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
export function heuristicExtractJs(text) {
    const src = text ?? "";
    let out = {};
    const exported = findExportObject(src);
    if (exported && exported.startsWith("{")) {
        out = { ...heuristicObjectLiteral(exported) };
    }
    pullArrayField(out, src, "presets");
    pullArrayField(out, src, "plugins");
    pullObjectField(out, src, "env");
    pullObjectField(out, src, "targets");
    pullObjectField(out, src, "overrides");
    pullObjectField(out, src, "assumptions");
    if (out.browserslist === undefined) {
        const mArr = /\bbrowserslist\s*:\s*\[/.exec(src);
        const mStr = /\bbrowserslist\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(src);
        const mObj = /\bbrowserslist\s*:\s*\{/.exec(src);
        if (mArr) {
            const bal = extractBalanced(src, mArr.index + mArr[0].indexOf("["));
            if (bal)
                out.browserslist = heuristicArrayLiteral(bal);
        }
        else if (mObj) {
            const bal = extractBalanced(src, mObj.index + mObj[0].indexOf("{"));
            if (bal)
                out.browserslist = heuristicObjectLiteral(bal);
        }
        else if (mStr) {
            out.browserslist = unescapeStr(mStr[2]);
        }
    }
    if (out.sourceType === undefined) {
        const m = /\bsourceType\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(src);
        if (m)
            out.sourceType = unescapeStr(m[2]);
    }
    return out;
}
function unwrapPackageBabel(map) {
    // Full package.json paste: prefer nested "babel" key
    const looksPkg = map.name !== undefined ||
        map.version !== undefined ||
        map.dependencies !== undefined ||
        map.devDependencies !== undefined ||
        map.scripts !== undefined;
    const babel = asMap(map.babel);
    if (babel && (looksPkg || Object.keys(babel).length > 0)) {
        // If top-level already has presets/plugins, keep as-is unless clearly package.json
        if (looksPkg || (map.presets === undefined && map.plugins === undefined)) {
            return { map: { ...babel }, unwrapped: true };
        }
    }
    return { map, unwrapped: false };
}
function isBabelish(map) {
    return (map.presets !== undefined ||
        map.plugins !== undefined ||
        map.env !== undefined ||
        map.targets !== undefined ||
        map.overrides !== undefined ||
        map.browserslist !== undefined ||
        map.sourceType !== undefined ||
        map.assumptions !== undefined ||
        asMap(map.babel) !== null);
}
export function parseBabelConfigText(text) {
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
                const { map, unwrapped } = unwrapPackageBabel(map0);
                return {
                    raw: map,
                    format: "jsonc",
                    unwrappedPackageBabel: unwrapped || undefined,
                    source: trimmed,
                };
            }
            return {
                raw: null,
                format: "jsonc",
                parseError: "babel config root must be a JSON object",
                source: trimmed,
            };
        }
        catch {
            // fall through
        }
    }
    if (looksLikeJs(trimmed) ||
        /\bpresets\s*:\s*\[/.test(trimmed) ||
        /\bplugins\s*:\s*\[/.test(trimmed) ||
        /\benv\s*:\s*\{/.test(trimmed) ||
        /\btargets\s*:\s*\{/.test(trimmed)) {
        const extracted = heuristicExtractJs(trimmed);
        const { map, unwrapped } = unwrapPackageBabel(extracted);
        if (map && (isBabelish(map) || Object.keys(map).length > 0)) {
            return {
                raw: map,
                format: "js-heuristic",
                heuristic: true,
                unwrappedPackageBabel: unwrapped || undefined,
                source: trimmed,
            };
        }
        return {
            raw: null,
            format: "js-heuristic",
            parseError: "JS config heuristics found no babel options (limits: no eval; regex extraction only)",
            heuristic: true,
            source: trimmed,
        };
    }
    return {
        raw: null,
        format: "unknown",
        parseError: "Unrecognized babel config text",
        source: trimmed,
    };
}
/** Normalize a babel preset/plugin entry to a display name. */
export function entryName(item) {
    if (typeof item === "string") {
        const s = item.trim();
        return s || undefined;
    }
    if (Array.isArray(item) && item.length > 0) {
        const first = item[0];
        if (typeof first === "string") {
            const s = first.trim();
            return s || undefined;
        }
        const m = asMap(first);
        if (m && typeof m.__call === "string")
            return m.__call;
        if (typeof first === "object" && first !== null) {
            // require() already resolved to string above usually
        }
    }
    const map = asMap(item);
    if (!map)
        return undefined;
    if (typeof map.__call === "string")
        return map.__call;
    if (typeof map.name === "string")
        return map.name;
    if (typeof map.request === "string")
        return map.request;
    return undefined;
}
/** Prefer keeping structured entries (string | [name, opts] | object). */
export function normalizeEntry(item) {
    if (typeof item === "string")
        return item;
    if (Array.isArray(item)) {
        const name = entryName(item);
        if (item.length === 1 && name)
            return name;
        if (name) {
            const opts = item.length > 1 ? item[1] : undefined;
            const id = item.length > 2 ? item[2] : undefined;
            if (opts !== undefined || id !== undefined) {
                const arr = [name];
                if (opts !== undefined)
                    arr.push(opts);
                if (id !== undefined)
                    arr.push(id);
                return arr;
            }
            return name;
        }
        return item;
    }
    const map = asMap(item);
    if (map && typeof map.__call === "string") {
        return map.__call;
    }
    if (map)
        return map;
    return String(item);
}
function collectArrayField(raw, field) {
    if (!raw)
        return [];
    const out = [];
    if (Array.isArray(raw[field]))
        out.push(...raw[field]);
    // Also gather from env.* blocks (common pattern)
    const env = asMap(raw.env);
    if (env) {
        for (const v of Object.values(env)) {
            const m = asMap(v);
            if (m && Array.isArray(m[field]))
                out.push(...m[field]);
        }
    }
    return out;
}
export function extractPresets(raw) {
    const items = collectArrayField(raw, "presets");
    // Prefer top-level only for the structured list; env extras still contribute names
    const top = raw && Array.isArray(raw.presets) ? raw.presets : [];
    const presets = top.map(normalizeEntry);
    const names = [];
    const seen = new Set();
    for (const item of items.length ? items : top) {
        const n = entryName(item);
        if (!n || seen.has(n))
            continue;
        seen.add(n);
        names.push(n);
    }
    // If top empty but env had presets, also expose them as structured via items
    const structured = presets.length > 0
        ? presets
        : items.map(normalizeEntry);
    const uniqueStructured = [];
    const seenStruct = new Set();
    for (const p of structured) {
        const key = typeof p === "string" ? p : JSON.stringify(p);
        if (seenStruct.has(key))
            continue;
        seenStruct.add(key);
        uniqueStructured.push(p);
    }
    return {
        presets: uniqueStructured,
        names,
        count: uniqueStructured.length,
    };
}
export function extractPlugins(raw, source) {
    const items = collectArrayField(raw, "plugins");
    const top = raw && Array.isArray(raw.plugins) ? raw.plugins : [];
    const plugins = (top.length ? top : items).map(normalizeEntry);
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
    for (const item of items.length ? items : top)
        push(entryName(item));
    // Extra JS regex pass for callables inside plugins: [...]
    if (source) {
        const m = /\bplugins\s*:\s*\[/.exec(source);
        if (m) {
            const bal = extractBalanced(source, m.index + m[0].indexOf("["));
            if (bal) {
                const callRe = /\b([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*\(/g;
                let nm;
                while ((nm = callRe.exec(bal)) !== null) {
                    const name = nm[1];
                    if (["require", "if", "function", "Boolean", "Array", "Object", "String", "Number"].includes(name)) {
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
    const uniqueStructured = [];
    const seenStruct = new Set();
    for (const p of plugins) {
        const key = typeof p === "string" ? p : JSON.stringify(p);
        if (seenStruct.has(key))
            continue;
        seenStruct.add(key);
        uniqueStructured.push(p);
    }
    return {
        plugins: uniqueStructured,
        names,
        count: uniqueStructured.length,
    };
}
function presetEnvOptions(raw) {
    if (!raw || !Array.isArray(raw.presets))
        return null;
    for (const item of raw.presets) {
        const name = entryName(item);
        if (!name)
            continue;
        const norm = name.replace(/^babel-preset-/, "@babel/preset-");
        if (name === "@babel/preset-env" ||
            name === "env" ||
            norm === "@babel/preset-env" ||
            /preset-env/.test(name)) {
            if (Array.isArray(item) && item.length > 1) {
                return asMap(item[1]);
            }
        }
    }
    return null;
}
export function extractEnvTargets(raw) {
    if (!raw)
        return { envKeys: [] };
    let targets = raw.targets;
    let browserslist = raw.browserslist;
    const envOpts = presetEnvOptions(raw);
    if (envOpts) {
        if (targets === undefined && envOpts.targets !== undefined) {
            targets = envOpts.targets;
        }
        if (browserslist === undefined && envOpts.browserslist !== undefined) {
            browserslist = envOpts.browserslist;
        }
        // common: browserslistQuery / targets via browserslist field in options
    }
    const envMap = asMap(raw.env);
    const env = envMap ? { ...envMap } : undefined;
    const envKeys = env ? Object.keys(env) : [];
    const result = { envKeys };
    if (targets !== undefined)
        result.targets = targets;
    if (browserslist !== undefined)
        result.browserslist = browserslist;
    if (env)
        result.env = env;
    return result;
}
function stringifyUnknown(v) {
    try {
        return JSON.stringify(v) ?? "";
    }
    catch {
        return String(v);
    }
}
function allPluginNames(raw) {
    const items = collectArrayField(raw, "plugins");
    const names = [];
    for (const item of items) {
        const n = entryName(item);
        if (n)
            names.push(n);
    }
    return names;
}
function hasModulesFalse(raw, source) {
    const blob = `${source ?? ""}\n${stringifyUnknown(raw)}`;
    if (/["']?modules["']?\s*:\s*(?:false|['"`]false['"`]|0\b)/.test(blob)) {
        return true;
    }
    const envOpts = presetEnvOptions(raw);
    if (envOpts && envOpts.modules === false)
        return true;
    return false;
}
function hasStage0(raw, source) {
    const names = [
        ...extractPresets(raw).names,
        ...extractPlugins(raw, source).names,
    ];
    const blob = `${source ?? ""}\n${names.join("\n")}`;
    return (/stage-0/.test(blob) ||
        /babel-preset-stage-0/.test(blob) ||
        /@babel\/preset-stage-0/.test(blob));
}
export function lintBabelConfig(raw, parseError, format, source, unwrappedPackageBabel) {
    const findings = [];
    if (parseError) {
        findings.push({
            severity: "error",
            rule: "invalid_config",
            advice: `Could not parse babel config: ${parseError}`,
        });
        return findings;
    }
    if (!raw) {
        findings.push({
            severity: "info",
            rule: "empty_config",
            advice: "No babel config content provided (empty input).",
        });
        return findings;
    }
    const keys = Object.keys(raw);
    if (keys.length === 0) {
        findings.push({
            severity: "info",
            rule: "empty_config",
            advice: "Parsed config object is empty — no babel options detected.",
        });
        return findings;
    }
    if (unwrappedPackageBabel) {
        findings.push({
            severity: "info",
            rule: "package_json_babel_unwrap",
            advice: 'Input looked like package.json — analyzed the nested "babel" key. Prefer a dedicated babel.config.json / .babelrc for clearer tooling.',
        });
    }
    if (format === "js-heuristic") {
        findings.push({
            severity: "info",
            rule: "js_heuristic_limits",
            advice: "JS/TS babel config was parsed with best-effort string heuristics (no eval). Nested spreads, computed keys, dynamic requires, api.env() branches, and function-returned configs are not fully resolved — verify critical values manually. Prefer JSON/JSONC when possible for unambiguous parse.",
        });
    }
    const presets = extractPresets(raw);
    if (presets.count === 0 && raw.presets === undefined) {
        // Missing presets is a smell when there are also no plugins / only targets
        const plugins = extractPlugins(raw, source);
        if (plugins.count === 0) {
            findings.push({
                severity: "warn",
                rule: "missing_presets",
                advice: "No presets (and no plugins) detected. Most projects need at least @babel/preset-env (and often @babel/preset-typescript / @babel/preset-react).",
            });
        }
        else {
            findings.push({
                severity: "info",
                rule: "missing_presets",
                advice: "No presets array — plugins-only configs are valid but uncommon; confirm this is intentional.",
            });
        }
    }
    // Duplicate plugins (exact name repeats)
    {
        const names = allPluginNames(raw);
        const counts = new Map();
        for (const n of names)
            counts.set(n, (counts.get(n) ?? 0) + 1);
        const dups = [...counts.entries()].filter(([, c]) => c > 1).map(([n]) => n);
        if (dups.length) {
            findings.push({
                severity: "warn",
                rule: "duplicate_plugins",
                advice: `Duplicate plugin entries detected: ${dups.join(", ")}. Remove duplicates or use named entries [plugin, opts, "id"] if intentional dual application.`,
            });
        }
    }
    if (hasStage0(raw, source)) {
        findings.push({
            severity: "warn",
            rule: "stage0_legacy",
            advice: "stage-0 / babel-preset-stage-* is legacy (removed from Babel 7+). Replace with explicit proposal plugins or modern @babel/preset-env + shipped proposals.",
        });
    }
    if (hasModulesFalse(raw, source)) {
        findings.push({
            severity: "info",
            rule: "modules_false_tip",
            advice: "modules: false (usually under @babel/preset-env) keeps ES modules for bundlers (webpack/rollup/vite). Correct for app bundles; for Node libraries publishing CJS, prefer modules: 'commonjs' or dual builds.",
        });
    }
    // targets / browserslist tip
    {
        const et = extractEnvTargets(raw);
        const hasPresetEnv = presets.names.some((n) => n === "@babel/preset-env" ||
            n === "env" ||
            /preset-env/.test(n) ||
            n === "babel-preset-env");
        if (hasPresetEnv && et.targets === undefined && et.browserslist === undefined) {
            findings.push({
                severity: "info",
                rule: "missing_targets",
                advice: "@babel/preset-env is present without explicit targets/browserslist in this text — Babel may fall back to browserslist config files on disk (not visible here) or defaults. Set targets explicitly for reproducible builds.",
            });
        }
    }
    // deprecated babel-preset-es2015 era
    {
        const names = presets.names.join("\n");
        if (/babel-preset-es2015|preset-es2015|babel-preset-es2016|babel-preset-es2017/.test(names)) {
            findings.push({
                severity: "warn",
                rule: "legacy_es201x_presets",
                advice: "babel-preset-es2015/es2016/es2017 are obsolete — migrate to @babel/preset-env.",
            });
        }
    }
    return findings;
}
