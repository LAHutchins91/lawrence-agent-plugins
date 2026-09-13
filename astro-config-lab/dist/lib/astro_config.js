/**
 * Shared astro.config text helpers.
 * defineConfig / export default best-effort heuristics (no eval).
 * No astro binary, no network, no filesystem follow.
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
        if (/function\s*\(/.test(m[0]) ||
            /=>\s*\{/.test(m[0])) {
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
export function heuristicExtractJs(text) {
    const src = text ?? "";
    let out = {};
    const exported = findExportObject(src);
    if (exported && exported.startsWith("{")) {
        out = { ...heuristicObjectLiteral(exported) };
    }
    pullArrayField(out, src, "integrations");
    pullObjectField(out, src, "vite");
    pullObjectField(out, src, "experimental");
    pullObjectField(out, src, "image");
    pullObjectField(out, src, "markdown");
    pullObjectField(out, src, "server");
    pullObjectField(out, src, "build");
    pullScalarField(out, src, "output");
    pullScalarField(out, src, "adapter");
    pullScalarField(out, src, "site");
    pullScalarField(out, src, "base");
    pullScalarField(out, src, "trailingSlash");
    pullScalarField(out, src, "srcDir");
    pullScalarField(out, src, "publicDir");
    pullScalarField(out, src, "outDir");
    return out;
}
function isAstroish(map) {
    return (map.integrations !== undefined ||
        map.output !== undefined ||
        map.adapter !== undefined ||
        map.site !== undefined ||
        map.base !== undefined ||
        map.trailingSlash !== undefined ||
        map.vite !== undefined ||
        map.experimental !== undefined ||
        map.srcDir !== undefined ||
        map.markdown !== undefined);
}
export function parseAstroConfigText(text) {
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
                };
            }
            return {
                raw: null,
                format: "jsonc",
                parseError: "astro config root must be a JSON object",
                source: trimmed,
            };
        }
        catch {
            // fall through
        }
    }
    if (looksLikeJs(trimmed) ||
        /\bintegrations\s*:/.test(trimmed) ||
        /\boutput\s*:/.test(trimmed) ||
        /\badapter\s*:/.test(trimmed) ||
        /\bsite\s*:/.test(trimmed) ||
        /\bvite\s*:/.test(trimmed) ||
        /\bdefineConfig\b/.test(trimmed)) {
        const extracted = heuristicExtractJs(trimmed);
        if (extracted && (isAstroish(extracted) || Object.keys(extracted).length > 0)) {
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
            parseError: "JS config heuristics found no astro options (limits: no eval; regex extraction only)",
            heuristic: true,
            source: trimmed,
        };
    }
    return {
        raw: null,
        format: "unknown",
        parseError: "Unrecognized astro config text",
        source: trimmed,
    };
}
function itemName(item) {
    if (typeof item === "string") {
        const s = item.trim();
        return s || undefined;
    }
    if (Array.isArray(item) && item.length > 0) {
        return itemName(item[0]);
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
    if (typeof map.name === "string")
        return map.name;
    return undefined;
}
const SKIP_CALLS = new Set([
    "require",
    "if",
    "function",
    "Boolean",
    "Array",
    "Object",
    "String",
    "Number",
    "defineConfig",
]);
export function extractIntegrations(raw, source) {
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
        if (SKIP_CALLS.has(t))
            return;
        seen.add(t);
        names.push(t);
    };
    if (raw) {
        const integrations = raw.integrations;
        if (Array.isArray(integrations)) {
            for (const item of integrations)
                push(itemName(item));
        }
    }
    if (source) {
        const mArr = /\bintegrations\s*:\s*\[/.exec(source);
        if (mArr) {
            const bal = extractBalanced(source, mArr.index + mArr[0].indexOf("["));
            if (bal) {
                const callRe = /\b([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*\(/g;
                let nm;
                while ((nm = callRe.exec(bal)) !== null) {
                    push(nm[1]);
                }
                const reqRe = /\brequire\s*\(\s*(["'`])((?:\\.|(?!\1).)*)\1\s*\)/g;
                while ((nm = reqRe.exec(bal)) !== null) {
                    push(unescapeStr(nm[2]));
                }
                const strRe = /(["'`])((?:\\.|(?!\1).)*)\1/g;
                while ((nm = strRe.exec(bal)) !== null) {
                    const s = unescapeStr(nm[2]);
                    if (s.includes("@astrojs/") || s.includes("astro-"))
                        push(s);
                }
            }
        }
    }
    return { integrations: names, count: names.length };
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
export function extractOutputMode(raw, source) {
    const result = {};
    if (raw) {
        if (typeof raw.output === "string")
            result.output = raw.output;
        const adapter = moduleRef(raw.adapter);
        if (adapter)
            result.adapter = adapter;
        if (typeof raw.site === "string")
            result.site = raw.site;
        if (typeof raw.base === "string")
            result.base = raw.base;
        if (typeof raw.trailingSlash === "string") {
            result.trailingSlash = raw.trailingSlash;
        }
    }
    if (source) {
        if (result.output === undefined) {
            const m = /\boutput\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(source);
            if (m)
                result.output = unescapeStr(m[2]);
        }
        if (result.adapter === undefined) {
            const callM = /\badapter\s*:\s*([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*\(/.exec(source);
            if (callM && callM[1] !== "require") {
                result.adapter = callM[1];
            }
            else {
                const reqM = /\badapter\s*:\s*require\s*\(\s*(["'`])((?:\\.|(?!\1).)*)\1\s*\)/.exec(source);
                if (reqM)
                    result.adapter = unescapeStr(reqM[2]);
                else {
                    const strM = /\badapter\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(source);
                    if (strM)
                        result.adapter = unescapeStr(strM[2]);
                }
            }
        }
        if (result.site === undefined) {
            const m = /\bsite\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(source);
            if (m)
                result.site = unescapeStr(m[2]);
        }
        if (result.base === undefined) {
            const m = /\bbase\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(source);
            if (m)
                result.base = unescapeStr(m[2]);
        }
        if (result.trailingSlash === undefined) {
            const m = /\btrailingSlash\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(source);
            if (m)
                result.trailingSlash = unescapeStr(m[2]);
        }
    }
    return result;
}
export function extractViteHint(raw, source) {
    let viteMap = raw ? asMap(raw.vite) : null;
    if (!viteMap && source) {
        const m = /\bvite\s*:\s*\{/.exec(source);
        if (m) {
            const bal = extractBalanced(source, m.index + m[0].indexOf("{"));
            if (bal)
                viteMap = heuristicObjectLiteral(bal);
        }
    }
    if (!viteMap)
        return {};
    const keys = Object.keys(viteMap).filter((k) => !k.startsWith("__"));
    const hint = { keys };
    const pluginsVal = viteMap.plugins;
    if (Array.isArray(pluginsVal)) {
        const plugs = [];
        const seen = new Set();
        for (const item of pluginsVal) {
            const n = itemName(item);
            if (n && !seen.has(n) && !SKIP_CALLS.has(n)) {
                seen.add(n);
                plugs.push(n);
            }
        }
        if (plugs.length)
            hint.plugins = plugs;
    }
    else if (source) {
        // nested vite.plugins inside vite block
        const mVite = /\bvite\s*:\s*\{/.exec(source);
        if (mVite) {
            const viteBal = extractBalanced(source, mVite.index + mVite[0].indexOf("{"));
            if (viteBal) {
                const mPlug = /\bplugins\s*:\s*\[/.exec(viteBal);
                if (mPlug) {
                    const bal = extractBalanced(viteBal, mPlug.index + mPlug[0].indexOf("["));
                    if (bal) {
                        const plugs = [];
                        const seen = new Set();
                        const callRe = /\b([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*\(/g;
                        let nm;
                        while ((nm = callRe.exec(bal)) !== null) {
                            const n = nm[1];
                            if (!SKIP_CALLS.has(n) && !seen.has(n)) {
                                seen.add(n);
                                plugs.push(n);
                            }
                        }
                        if (plugs.length)
                            hint.plugins = plugs;
                    }
                }
            }
        }
    }
    if (viteMap.server !== undefined)
        hint.server = viteMap.server;
    if (viteMap.build !== undefined)
        hint.build = viteMap.build;
    return { vite: hint };
}
function hasSitemapIntegration(integrations, source) {
    if (integrations.some((n) => n === "sitemap" ||
        n === "@astrojs/sitemap" ||
        /sitemap/i.test(n))) {
        return true;
    }
    if (source && /@astrojs\/sitemap|\bsitemap\s*\(/.test(source))
        return true;
    return false;
}
export function lintAstroConfig(raw, parseError, format, source) {
    const findings = [];
    if (parseError) {
        findings.push({
            severity: "error",
            rule: "invalid_config",
            advice: `Could not parse astro config: ${parseError}`,
        });
        return findings;
    }
    if (!raw) {
        findings.push({
            severity: "info",
            rule: "empty_config",
            advice: "No astro config content provided (empty input).",
        });
        return findings;
    }
    const keys = Object.keys(raw);
    if (keys.length === 0) {
        findings.push({
            severity: "info",
            rule: "empty_config",
            advice: "Parsed config object is empty — no astro options detected.",
        });
        return findings;
    }
    if (format === "js-heuristic") {
        findings.push({
            severity: "info",
            rule: "js_heuristic_limits",
            advice: "JS/TS astro.config was parsed with best-effort string heuristics (no eval). Nested spreads, computed keys, dynamic imports, env branches, and function-returned configs are not fully resolved — verify critical values manually.",
        });
    }
    const mode = extractOutputMode(raw, source);
    const listed = extractIntegrations(raw, source);
    const output = mode.output;
    const needsAdapter = output === "server" ||
        output === "hybrid" ||
        (output === undefined &&
            !!mode.adapter === false &&
            /\boutput\s*:\s*['"`]server['"`]/.test(source ?? ""));
    if ((output === "server" || output === "hybrid") &&
        !mode.adapter) {
        findings.push({
            severity: "warn",
            rule: "server_without_adapter",
            advice: `output: "${output}" typically requires an adapter (e.g. @astrojs/node, @astrojs/vercel, @astrojs/netlify, @astrojs/cloudflare). No adapter field was detected in this text.`,
        });
    }
    if (output === "hybrid") {
        findings.push({
            severity: "info",
            rule: "hybrid_output_note",
            advice: 'output: "hybrid" is legacy in newer Astro — prefer output: "server" with per-route prerender. Confirm against your Astro major version docs.',
        });
    }
    if (hasSitemapIntegration(listed.integrations, source) && !mode.site) {
        findings.push({
            severity: "warn",
            rule: "sitemap_missing_site",
            advice: "@astrojs/sitemap (or sitemap()) is present but no site URL was found. Set site: 'https://example.com' so sitemap URLs are absolute.",
        });
    }
    if (raw.experimental !== undefined || /\bexperimental\s*:/.test(source ?? "")) {
        findings.push({
            severity: "info",
            rule: "experimental_flags",
            advice: "experimental: { … } flags are present — they can change or be removed between Astro minors. Pin your Astro version and read release notes before upgrading.",
        });
    }
    if (listed.count === 0 && raw.integrations === undefined) {
        findings.push({
            severity: "info",
            rule: "no_integrations",
            advice: "No integrations field detected. Fine for a minimal Astro site — add framework / MDX / sitemap integrations when needed.",
        });
    }
    if (mode.trailingSlash && !["always", "never", "ignore"].includes(mode.trailingSlash)) {
        findings.push({
            severity: "warn",
            rule: "trailing_slash_value",
            advice: `trailingSlash should be "always" | "never" | "ignore" — got "${mode.trailingSlash}".`,
        });
    }
    if (output && !["static", "server", "hybrid"].includes(output)) {
        findings.push({
            severity: "warn",
            rule: "output_value",
            advice: `Unusual output value "${output}" — expected "static" | "server" | "hybrid".`,
        });
    }
    return findings;
}
