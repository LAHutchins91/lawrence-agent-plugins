/**
 * Shared Prettier config text helpers.
 * Prefer robust JSONC; YAML via yaml package; JS configs via best-effort regex.
 * No prettier binary, no network, no filesystem config follow.
 */
import { parse as parseYaml } from "yaml";
/** Core Prettier option keys (excluding plugins/overrides meta). */
export const CORE_OPTION_KEYS = [
    "printWidth",
    "tabWidth",
    "useTabs",
    "semi",
    "singleQuote",
    "quoteProps",
    "jsxSingleQuote",
    "trailingComma",
    "bracketSpacing",
    "bracketSameLine",
    "jsxBracketSameLine",
    "arrowParens",
    "rangeStart",
    "rangeEnd",
    "parser",
    "filepath",
    "requirePragma",
    "insertPragma",
    "proseWrap",
    "htmlWhitespaceSensitivity",
    "vueIndentScriptAndStyle",
    "endOfLine",
    "embeddedLanguageFormatting",
    "singleAttributePerLine",
];
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
function looksLikeYaml(text) {
    const t = text.trim();
    if (t.startsWith("{") || t.startsWith("["))
        return false;
    if (/^(printWidth|tabWidth|useTabs|semi|singleQuote|trailingComma|plugins|overrides|arrowParens|endOfLine|bracketSpacing)\s*:/m.test(t)) {
        return true;
    }
    if (t.includes("---") && /:\s/.test(t))
        return true;
    return false;
}
function looksLikeJs(text) {
    const t = text.trim();
    if (/\bmodule\.exports\b/.test(t) ||
        /\bexport\s+default\b/.test(t) ||
        /\bexports\./.test(t) ||
        /\brequire\s*\(/.test(t) ||
        /\bimport\s+/.test(t)) {
        return true;
    }
    return false;
}
/**
 * Extract a balanced [...] or {...} starting at index (must be [ or {).
 * String-aware; best-effort for JS source.
 */
function extractBalanced(src, start) {
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
/**
 * Heuristic: parse a shallow JS object literal into Record via regex.
 * Handles string/number/boolean values and nested shallow objects/arrays of strings.
 */
function heuristicObjectLiteral(objSrc) {
    const out = {};
    const body = objSrc.trim();
    if (!body.startsWith("{") || !body.endsWith("}"))
        return out;
    const inner = body.slice(1, -1);
    // Scan for key: value patterns; skip nested by using extractBalanced when value is { or [
    let i = 0;
    while (i < inner.length) {
        // skip whitespace and commas
        while (i < inner.length && /[\s,]/.test(inner[i]))
            i++;
        if (i >= inner.length)
            break;
        // key: "key" | 'key' | `key` | bare
        let key = "";
        const keyStr = /^(["'`])((?:\\.|(?!\1).)*)\1/.exec(inner.slice(i));
        if (keyStr) {
            key = keyStr[2].replace(/\\(.)/g, "$1");
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
        i++; // :
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
                if (key === "overrides") {
                    out[key] = heuristicOverridesArray(bal);
                }
                else {
                    // string array (plugins etc.)
                    out[key] = stringsFromArrayLiteral(bal);
                }
            }
            else {
                out[key] = heuristicObjectLiteral(bal);
            }
            i += bal.length;
            continue;
        }
        const strM = /^(["'`])((?:\\.|(?!\1).)*)\1/.exec(inner.slice(i));
        if (strM) {
            out[key] = strM[2].replace(/\\(.)/g, "$1");
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
        // null
        if (/^null\b/.test(inner.slice(i))) {
            out[key] = null;
            i += 4;
            continue;
        }
        i++;
    }
    return out;
}
/**
 * Heuristic JS extraction for prettier.config.js / .prettierrc.js style text.
 * Limits: no eval, no require resolution, no spread/computed keys.
 */
export function heuristicExtractJs(text) {
    const src = text ?? "";
    let out = {};
    // module.exports = { ... } or export default { ... }
    const mObj = /(?:module\.exports\s*=\s*|export\s+default\s*|exports\.default\s*=\s*)\{/.exec(src);
    if (mObj) {
        const start = mObj.index + mObj[0].lastIndexOf("{");
        const bal = extractBalanced(src, start);
        if (bal) {
            out = { ...out, ...heuristicObjectLiteral(bal) };
        }
    }
    // Also pull top-level option assignments if object extract missed some
    for (const key of CORE_OPTION_KEYS) {
        if (out[key] !== undefined)
            continue;
        const re = new RegExp(`\\b${key}\\s*:\\s*(?:(["'\`])((?:\\\\.|(?!\\1).)*)\\1|(true|false)|(-?\\d+(?:\\.\\d+)?))`);
        const m = re.exec(src);
        if (!m)
            continue;
        if (m[2] !== undefined)
            out[key] = m[2].replace(/\\(.)/g, "$1");
        else if (m[3] !== undefined)
            out[key] = m[3] === "true";
        else if (m[4] !== undefined)
            out[key] = Number(m[4]);
    }
    // plugins: [...]
    if (out.plugins === undefined) {
        const mArr = /\bplugins\s*:\s*\[/.exec(src);
        if (mArr) {
            const bal = extractBalanced(src, mArr.index + mArr[0].indexOf("["));
            if (bal) {
                const list = stringsFromArrayLiteral(bal);
                if (list.length)
                    out.plugins = list;
            }
        }
    }
    // overrides: [ { files, options }, ... ] — always prefer structured extract
    {
        const mArr = /\boverrides\s*:\s*\[/.exec(src);
        if (mArr) {
            const bal = extractBalanced(src, mArr.index + mArr[0].indexOf("["));
            if (bal) {
                const overrides = heuristicOverridesArray(bal);
                if (overrides.length)
                    out.overrides = overrides;
            }
        }
    }
    return out;
}
function heuristicOverridesArray(arrSrc) {
    const body = arrSrc.trim();
    if (!body.startsWith("[") || !body.endsWith("]"))
        return [];
    const inner = body.slice(1, -1);
    const overrides = [];
    let i = 0;
    while (i < inner.length) {
        while (i < inner.length && /[\s,]/.test(inner[i]))
            i++;
        if (i >= inner.length)
            break;
        if (inner[i] !== "{") {
            i++;
            continue;
        }
        const bal = extractBalanced(inner, i);
        if (!bal)
            break;
        const obj = heuristicObjectLiteral(bal);
        const entry = {};
        if (typeof obj.files === "string")
            entry.files = obj.files;
        else if (Array.isArray(obj.files)) {
            entry.files = obj.files.filter((x) => typeof x === "string");
        }
        if (typeof obj.excludeFiles === "string")
            entry.excludeFiles = obj.excludeFiles;
        else if (Array.isArray(obj.excludeFiles)) {
            entry.excludeFiles = obj.excludeFiles.filter((x) => typeof x === "string");
        }
        const opts = asMap(obj.options);
        if (opts)
            entry.options = opts;
        // Some configs put options at the same level as files
        const sameLevel = {};
        for (const [k, v] of Object.entries(obj)) {
            if (k === "files" || k === "excludeFiles" || k === "options")
                continue;
            sameLevel[k] = v;
        }
        if (!entry.options && Object.keys(sameLevel).length) {
            entry.options = sameLevel;
        }
        else if (entry.options && Object.keys(sameLevel).length) {
            entry.options = { ...sameLevel, ...entry.options };
        }
        overrides.push(entry);
        i += bal.length;
    }
    return overrides;
}
/**
 * If text is a package.json with a "prettier" key, unwrap it.
 */
function unwrapPackageJsonPrettier(map) {
    if (map.prettier !== undefined && asMap(map.prettier)) {
        // Looks like package.json
        const hasPkgHints = map.name !== undefined ||
            map.dependencies !== undefined ||
            map.devDependencies !== undefined ||
            map.scripts !== undefined;
        if (hasPkgHints) {
            return asMap(map.prettier) ?? map;
        }
    }
    return map;
}
export function parsePrettierConfigText(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed) {
        return { raw: null, format: "empty" };
    }
    // 1) Prefer JSONC
    {
        const stripped = stripJsonComments(trimmed);
        try {
            const raw = JSON.parse(stripped);
            const map = asMap(raw);
            if (map) {
                return { raw: unwrapPackageJsonPrettier(map), format: "jsonc" };
            }
            return {
                raw: null,
                format: "jsonc",
                parseError: "Prettier config root must be a JSON object",
            };
        }
        catch {
            // fall through
        }
    }
    // 2) YAML
    if (looksLikeYaml(trimmed) ||
        (!looksLikeJs(trimmed) && /:\s*\S/.test(trimmed))) {
        try {
            const raw = parseYaml(trimmed);
            const map = asMap(raw);
            if (map)
                return { raw: unwrapPackageJsonPrettier(map), format: "yaml" };
            return {
                raw: null,
                format: "yaml",
                parseError: "YAML root must be a mapping",
            };
        }
        catch (err) {
            if (looksLikeYaml(trimmed) && !looksLikeJs(trimmed)) {
                const msg = err instanceof Error ? err.message : String(err);
                return { raw: null, format: "yaml", parseError: msg };
            }
        }
    }
    // 3) JS heuristics
    if (looksLikeJs(trimmed) ||
        /\bprintWidth\s*:/.test(trimmed) ||
        /\bplugins\s*:/.test(trimmed) ||
        /\boverrides\s*:/.test(trimmed)) {
        const extracted = heuristicExtractJs(trimmed);
        if (Object.keys(extracted).length > 0) {
            return { raw: extracted, format: "js-heuristic", heuristic: true };
        }
        return {
            raw: null,
            format: "js-heuristic",
            parseError: "JS config heuristics found no Prettier options/plugins/overrides (limits: no eval; regex extraction only)",
            heuristic: true,
        };
    }
    // Last try: YAML anyway
    try {
        const raw = parseYaml(trimmed);
        const map = asMap(raw);
        if (map)
            return { raw: unwrapPackageJsonPrettier(map), format: "yaml" };
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { raw: null, format: "unknown", parseError: msg };
    }
    return {
        raw: null,
        format: "unknown",
        parseError: "Unrecognized Prettier config text",
    };
}
export function normalizeStringList(value) {
    if (value === undefined || value === null)
        return [];
    if (typeof value === "string") {
        const s = value.trim();
        return s ? [s] : [];
    }
    if (Array.isArray(value)) {
        return value
            .filter((x) => typeof x === "string" || typeof x === "number")
            .map((x) => String(x).trim())
            .filter((x) => x !== "");
    }
    return [];
}
export function extractCoreOptions(raw) {
    if (!raw)
        return {};
    const options = {};
    for (const key of CORE_OPTION_KEYS) {
        if (raw[key] !== undefined) {
            options[key] = raw[key];
        }
    }
    // Also include any other non-meta keys that look like options (unknown but present)
    const meta = new Set(["plugins", "overrides", "prettier"]);
    for (const [k, v] of Object.entries(raw)) {
        if (meta.has(k))
            continue;
        if (options[k] !== undefined)
            continue;
        // skip package.json noise if somehow present
        if (["name", "version", "dependencies", "devDependencies", "scripts", "type"].includes(k)) {
            continue;
        }
        options[k] = v;
    }
    return options;
}
export function extractPlugins(raw) {
    if (!raw)
        return [];
    return normalizeStringList(raw.plugins);
}
export function extractOverrides(raw) {
    if (!raw)
        return [];
    const ov = raw.overrides;
    if (!Array.isArray(ov))
        return [];
    const out = [];
    for (const item of ov) {
        const map = asMap(item);
        if (!map)
            continue;
        const entry = {};
        if (typeof map.files === "string")
            entry.files = map.files;
        else if (Array.isArray(map.files)) {
            entry.files = map.files
                .filter((x) => typeof x === "string" || typeof x === "number")
                .map(String);
        }
        if (typeof map.excludeFiles === "string")
            entry.excludeFiles = map.excludeFiles;
        else if (Array.isArray(map.excludeFiles)) {
            entry.excludeFiles = map.excludeFiles
                .filter((x) => typeof x === "string" || typeof x === "number")
                .map(String);
        }
        const opts = asMap(map.options);
        if (opts) {
            entry.options = opts;
        }
        else {
            // same-level options besides files/excludeFiles
            const same = {};
            for (const [k, v] of Object.entries(map)) {
                if (k === "files" || k === "excludeFiles" || k === "options")
                    continue;
                same[k] = v;
            }
            if (Object.keys(same).length)
                entry.options = same;
        }
        out.push(entry);
    }
    return out;
}
export function lintPrettierConfig(raw, parseError, format) {
    const findings = [];
    if (parseError) {
        findings.push({
            severity: "error",
            rule: "invalid_config",
            advice: `Could not parse Prettier config: ${parseError}`,
        });
        return findings;
    }
    if (!raw) {
        findings.push({
            severity: "info",
            rule: "empty_config",
            advice: "No Prettier config content provided (empty input).",
        });
        return findings;
    }
    const keys = Object.keys(raw);
    if (keys.length === 0) {
        findings.push({
            severity: "info",
            rule: "empty_config",
            advice: "Parsed config object is empty — no options, plugins, or overrides.",
        });
        return findings;
    }
    if (format === "js-heuristic") {
        findings.push({
            severity: "info",
            rule: "js_heuristic_limits",
            advice: "JS config was parsed with best-effort string heuristics (no eval). Nested spreads, computed keys, and dynamic requires are not resolved — verify critical values manually.",
        });
    }
    const options = extractCoreOptions(raw);
    const plugins = extractPlugins(raw);
    const overrides = extractOverrides(raw);
    const useTabs = options.useTabs;
    const tabWidth = options.tabWidth;
    // useTabs + tabWidth notes
    if (useTabs === true && tabWidth !== undefined) {
        findings.push({
            severity: "info",
            rule: "use_tabs_with_tab_width",
            advice: `useTabs is true and tabWidth is ${JSON.stringify(tabWidth)} — tabWidth still affects alignment/wrapping math when tabs are used; confirm intentional.`,
        });
    }
    if (useTabs === false && typeof tabWidth === "number" && tabWidth === 0) {
        findings.push({
            severity: "warn",
            rule: "tab_width_zero",
            advice: "tabWidth is 0 with useTabs false — unusual; Prettier may behave oddly for indentation.",
        });
    }
    if (typeof tabWidth === "number" && (tabWidth < 0 || tabWidth > 16)) {
        findings.push({
            severity: "warn",
            rule: "tab_width_extreme",
            advice: `tabWidth=${tabWidth} is outside the common 1–8 (or up to 16) range — double-check.`,
        });
    }
    // printWidth extremes
    if (typeof options.printWidth === "number") {
        const pw = options.printWidth;
        if (pw < 40) {
            findings.push({
                severity: "warn",
                rule: "print_width_very_narrow",
                advice: `printWidth=${pw} is very narrow (<40) — may cause excessive wrapping.`,
            });
        }
        else if (pw > 200) {
            findings.push({
                severity: "warn",
                rule: "print_width_very_wide",
                advice: `printWidth=${pw} is very wide (>200) — may defeat line-length discipline.`,
            });
        }
        else if (pw > 120) {
            findings.push({
                severity: "info",
                rule: "print_width_wide",
                advice: `printWidth=${pw} is wider than the common 80–100 default — confirm team preference.`,
            });
        }
    }
    // trailingComma none with es5 / module smells
    const trailing = options.trailingComma;
    if (trailing === "none") {
        findings.push({
            severity: "info",
            rule: "trailing_comma_none",
            advice: 'trailingComma is "none" — modern ES modules / TypeScript often prefer "all" or "es5" for cleaner diffs; confirm intentional.',
        });
    }
    if (trailing === "es5") {
        // mild note when also setting parser that implies modern modules
        const parser = options.parser;
        if (typeof parser === "string" &&
            /typescript|babel|espree|meriyah/.test(parser)) {
            findings.push({
                severity: "info",
                rule: "trailing_comma_es5_with_modern_parser",
                advice: `trailingComma is "es5" with parser "${parser}" — function params / type params may omit trailing commas; "all" is often preferred for modern toolchains.`,
            });
        }
    }
    // deprecated jsxBracketSameLine
    if (options.jsxBracketSameLine !== undefined) {
        findings.push({
            severity: "warn",
            rule: "deprecated_jsx_bracket_same_line",
            advice: "jsxBracketSameLine is deprecated — prefer bracketSameLine (covers JSX and more).",
        });
    }
    // conflicting bracketSameLine + jsxBracketSameLine
    if (options.bracketSameLine !== undefined &&
        options.jsxBracketSameLine !== undefined &&
        options.bracketSameLine !== options.jsxBracketSameLine) {
        findings.push({
            severity: "warn",
            rule: "bracket_same_line_conflict",
            advice: "bracketSameLine and jsxBracketSameLine disagree — remove the deprecated jsxBracketSameLine key.",
        });
    }
    // empty-ish: only plugins or only overrides without base options
    const optionKeys = Object.keys(options);
    if (optionKeys.length === 0 && plugins.length === 0 && overrides.length === 0) {
        findings.push({
            severity: "info",
            rule: "sparse_config",
            advice: "No core options, plugins, or overrides detected — unusual empty-ish Prettier config.",
        });
    }
    // plugins without recognizable prettier-plugin names
    if (plugins.length > 0) {
        const odd = plugins.filter((p) => !/prettier|@/.test(p) && !p.includes("plugin"));
        if (odd.length) {
            findings.push({
                severity: "info",
                rule: "plugins_name_hint",
                advice: `plugins entries may be non-standard package names: ${odd.join(", ")} — Prettier plugins are usually prettier-plugin-* or scoped packages.`,
            });
        }
    }
    // overrides without files
    const missingFiles = overrides.filter((o) => o.files === undefined ||
        (Array.isArray(o.files) && o.files.length === 0) ||
        (typeof o.files === "string" && !o.files.trim()));
    if (missingFiles.length > 0) {
        findings.push({
            severity: "warn",
            rule: "override_missing_files",
            advice: `${missingFiles.length} override(s) lack a files glob — Prettier overrides should specify files.`,
        });
    }
    // requirePragma without insertPragma note
    if (options.requirePragma === true && options.insertPragma !== true) {
        findings.push({
            severity: "info",
            rule: "require_pragma_only",
            advice: "requirePragma is true without insertPragma — Prettier will only format files that already contain the @prettier pragma.",
        });
    }
    // semi false + singleQuote false — just fine, no finding
    // endOfLine auto vs lf
    if (options.endOfLine === "auto") {
        findings.push({
            severity: "info",
            rule: "end_of_line_auto",
            advice: 'endOfLine "auto" keeps existing line endings — for cross-platform repos, "lf" is often preferred with .gitattributes.',
        });
    }
    return findings;
}
