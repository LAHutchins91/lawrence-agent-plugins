/**
 * Shared ESLint config text helpers.
 * Prefer robust JSONC; YAML via yaml package; JS configs via best-effort regex.
 * No eslint binary, no network, no filesystem config follow.
 */
import { parse as parseYaml } from "yaml";
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
    // classic .eslintrc.yml cues
    if (/^(root|extends|env|parser|plugins|rules|parserOptions)\s*:/m.test(t)) {
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
    // flat config eslint.config.js style without export still may have arrays of objects
    if (/\[\s*\{/.test(t) && /\brules\s*:/.test(t))
        return true;
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
function unquote(s) {
    const t = s.trim();
    if ((t.startsWith('"') && t.endsWith('"')) ||
        (t.startsWith("'") && t.endsWith("'")) ||
        (t.startsWith("`") && t.endsWith("`"))) {
        return t.slice(1, -1);
    }
    return t;
}
/**
 * Heuristic: pull string literals from a JS array literal body.
 */
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
 * Heuristic JS extraction for .eslintrc.js / eslint.config.js style text.
 * Limits: no eval, no require resolution, no spread/computed keys, flat-config
 * multi-object merges are best-effort (first matching keys win / concat).
 */
export function heuristicExtractJs(text) {
    const out = {};
    const src = text ?? "";
    // extends: "..." or extends: [...]
    {
        const mArr = /\bextends\s*:\s*\[/.exec(src);
        const mStr = /\bextends\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(src);
        if (mArr) {
            const bal = extractBalanced(src, mArr.index + mArr[0].indexOf("["));
            if (bal) {
                const list = stringsFromArrayLiteral(bal);
                if (list.length)
                    out.extends = list;
            }
        }
        else if (mStr) {
            out.extends = mStr[2].replace(/\\(.)/g, "$1");
        }
    }
    // plugins: [...]
    {
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
    // env: { ... }
    {
        const m = /\benv\s*:\s*\{/.exec(src);
        if (m) {
            const bal = extractBalanced(src, m.index + m[0].indexOf("{"));
            if (bal) {
                const env = {};
                const re = /(["'`]?)([A-Za-z0-9_./-]+)\1\s*:\s*(true|false)/g;
                let em;
                while ((em = re.exec(bal)) !== null) {
                    env[em[2]] = em[3] === "true";
                }
                if (Object.keys(env).length)
                    out.env = env;
            }
        }
    }
    // parser: "..."
    {
        const m = /\bparser\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(src);
        if (m)
            out.parser = m[2].replace(/\\(.)/g, "$1");
    }
    // parserOptions: { ... } — shallow key: value strings/bools/numbers
    {
        const m = /\bparserOptions\s*:\s*\{/.exec(src);
        if (m) {
            const bal = extractBalanced(src, m.index + m[0].indexOf("{"));
            if (bal) {
                const po = {};
                // nested ecmaFeatures etc. as sub-object heuristic
                const nested = /\becmaFeatures\s*:\s*\{/.exec(bal);
                if (nested) {
                    const nestBal = extractBalanced(bal, nested.index + nested[0].indexOf("{"));
                    if (nestBal) {
                        const feat = {};
                        const re = /(["'`]?)([A-Za-z0-9_]+)\1\s*:\s*(true|false)/g;
                        let fm;
                        while ((fm = re.exec(nestBal)) !== null) {
                            feat[fm[2]] = fm[3] === "true";
                        }
                        if (Object.keys(feat).length)
                            po.ecmaFeatures = feat;
                    }
                }
                const kv = /(["'`]?)([A-Za-z0-9_]+)\1\s*:\s*(?:(["'`])((?:\\.|(?!\3).)*)\3|(true|false)|(\d+))/g;
                let km;
                while ((km = kv.exec(bal)) !== null) {
                    const key = km[2];
                    if (key === "ecmaFeatures")
                        continue;
                    if (km[4] !== undefined)
                        po[key] = km[4].replace(/\\(.)/g, "$1");
                    else if (km[5] !== undefined)
                        po[key] = km[5] === "true";
                    else if (km[6] !== undefined)
                        po[key] = Number(km[6]);
                }
                if (Object.keys(po).length)
                    out.parserOptions = po;
            }
        }
    }
    // rules: { ... } — id: severity | [severity, ...]
    {
        const m = /\brules\s*:\s*\{/.exec(src);
        if (m) {
            const bal = extractBalanced(src, m.index + m[0].indexOf("{"));
            if (bal) {
                const rules = {};
                // "rule-id": "off"|"warn"|"error"|0|1|2|[...]
                const re = /(["'`])((?:\\.|(?!\1).)*)\1\s*:\s*(?:(["'`])(off|warn|error)\3|([012])|(\[))/g;
                let rm;
                while ((rm = re.exec(bal)) !== null) {
                    const id = rm[2].replace(/\\(.)/g, "$1");
                    if (rm[4] !== undefined) {
                        rules[id] = rm[4];
                    }
                    else if (rm[5] !== undefined) {
                        rules[id] = Number(rm[5]);
                    }
                    else if (rm[6] !== undefined) {
                        const arrStart = rm.index + rm[0].lastIndexOf("[");
                        const arr = extractBalanced(bal, arrStart);
                        if (arr) {
                            // first element severity
                            const first = /\[\s*(?:(["'`])(off|warn|error)\1|([012]))/.exec(arr);
                            if (first) {
                                rules[id] =
                                    first[2] !== undefined ? first[2] : Number(first[3]);
                            }
                            else {
                                rules[id] = "other";
                            }
                        }
                    }
                }
                if (Object.keys(rules).length)
                    out.rules = rules;
            }
        }
    }
    // Flat-ish: export default [ { ... }, { rules: ... } ] — also scan for
    // extends / plugins arrays anywhere (already covered above).
    return out;
}
export function parseEslintConfigText(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed) {
        return { raw: null, format: "empty" };
    }
    // 1) Prefer JSONC
    {
        const stripped = stripJsonComments(trimmed);
        try {
            const raw = JSON.parse(stripped);
            // flat config often starts as array
            if (Array.isArray(raw)) {
                const merged = mergeFlatArray(raw);
                return { raw: merged, format: "jsonc", heuristic: true };
            }
            const map = asMap(raw);
            if (map)
                return { raw: map, format: "jsonc" };
            return {
                raw: null,
                format: "jsonc",
                parseError: "ESLint config root must be a JSON object or array",
            };
        }
        catch {
            // fall through
        }
    }
    // 2) YAML (.eslintrc.yml / .yaml)
    if (looksLikeYaml(trimmed) || (!looksLikeJs(trimmed) && /:\s*\S/.test(trimmed))) {
        try {
            const raw = parseYaml(trimmed);
            if (Array.isArray(raw)) {
                return {
                    raw: mergeFlatArray(raw),
                    format: "yaml",
                    heuristic: true,
                };
            }
            const map = asMap(raw);
            if (map)
                return { raw: map, format: "yaml" };
            return {
                raw: null,
                format: "yaml",
                parseError: "YAML root must be a mapping or sequence of mappings",
            };
        }
        catch (err) {
            // if it looked like yaml strongly, report; else try JS
            if (looksLikeYaml(trimmed) && !looksLikeJs(trimmed)) {
                const msg = err instanceof Error ? err.message : String(err);
                return { raw: null, format: "yaml", parseError: msg };
            }
        }
    }
    // 3) JS heuristics
    if (looksLikeJs(trimmed) || /extends\s*:/.test(trimmed) || /rules\s*:/.test(trimmed)) {
        const extracted = heuristicExtractJs(trimmed);
        if (Object.keys(extracted).length > 0) {
            return { raw: extracted, format: "js-heuristic", heuristic: true };
        }
        return {
            raw: null,
            format: "js-heuristic",
            parseError: "JS config heuristics found no extends/rules/env/parser/plugins (limits: no eval; regex extraction only)",
            heuristic: true,
        };
    }
    // Last try: YAML anyway
    try {
        const raw = parseYaml(trimmed);
        const map = asMap(raw);
        if (map)
            return { raw: map, format: "yaml" };
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { raw: null, format: "unknown", parseError: msg };
    }
    return {
        raw: null,
        format: "unknown",
        parseError: "Unrecognized ESLint config text",
    };
}
/** Shallow-merge flat-config array of objects (later wins for scalars; arrays concat unique). */
function mergeFlatArray(arr) {
    const out = {};
    for (const item of arr) {
        const map = asMap(item);
        if (!map)
            continue;
        for (const [k, v] of Object.entries(map)) {
            if (k === "extends" || k === "plugins") {
                const prev = normalizeStringList(out[k]);
                const next = normalizeStringList(v);
                out[k] = [...prev, ...next];
            }
            else if (k === "rules" || k === "env" || k === "parserOptions") {
                const prev = asMap(out[k]) ?? {};
                const next = asMap(v) ?? {};
                out[k] = { ...prev, ...next };
            }
            else {
                out[k] = v;
            }
        }
    }
    return out;
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
export function extractExtends(raw) {
    if (!raw)
        return [];
    return normalizeStringList(raw.extends);
}
export function normalizeSeverity(value) {
    if (value === undefined || value === null)
        return "other";
    if (Array.isArray(value)) {
        return normalizeSeverity(value[0]);
    }
    if (typeof value === "number") {
        if (value === 0)
            return "off";
        if (value === 1)
            return "warn";
        if (value === 2)
            return "error";
        return "other";
    }
    if (typeof value === "string") {
        const s = value.toLowerCase().trim();
        if (s === "off" || s === "0")
            return "off";
        if (s === "warn" || s === "warning" || s === "1")
            return "warn";
        if (s === "error" || s === "2")
            return "error";
        return "other";
    }
    return "other";
}
export function extractRules(raw) {
    if (!raw)
        return [];
    const rulesMap = asMap(raw.rules);
    if (!rulesMap)
        return [];
    const entries = [];
    for (const [id, val] of Object.entries(rulesMap)) {
        entries.push({ id, severity: normalizeSeverity(val) });
    }
    entries.sort((a, b) => a.id.localeCompare(b.id));
    return entries;
}
export function extractEnvList(raw) {
    if (!raw)
        return [];
    const env = asMap(raw.env);
    if (!env)
        return [];
    const keys = [];
    for (const [k, v] of Object.entries(env)) {
        if (v === true || v === "true" || v === 1)
            keys.push(k);
        else if (v === false || v === "false" || v === 0) {
            // disabled — skip
        }
        else {
            // present with unknown value — still list
            keys.push(k);
        }
    }
    return keys.sort();
}
export function extractPlugins(raw) {
    if (!raw)
        return [];
    return normalizeStringList(raw.plugins);
}
/**
 * Map plugin: name / from extends string like "plugin:react/recommended"
 * → expected plugin package short name "react"
 */
export function pluginNameFromExtends(ext) {
    const m = /^plugin:([^/]+)\//.exec(ext);
    if (!m)
        return null;
    return m[1];
}
export function lintEslintConfig(raw, parseError, format) {
    const findings = [];
    if (parseError) {
        findings.push({
            severity: "error",
            rule: "invalid_config",
            advice: `Could not parse ESLint config: ${parseError}`,
        });
        return findings;
    }
    if (!raw) {
        findings.push({
            severity: "info",
            rule: "empty_config",
            advice: "No ESLint config content provided (empty input).",
        });
        return findings;
    }
    const keys = Object.keys(raw);
    if (keys.length === 0) {
        findings.push({
            severity: "info",
            rule: "empty_config",
            advice: "Parsed config object is empty — no extends, rules, env, or plugins.",
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
    const extendsList = extractExtends(raw);
    const plugins = extractPlugins(raw);
    const rules = extractRules(raw);
    const envKeys = extractEnvList(raw);
    const parser = typeof raw.parser === "string" ? raw.parser : undefined;
    const parserOptions = asMap(raw.parserOptions);
    // extends referencing plugin:X without plugins including X
    const missingPlugins = [];
    for (const ext of extendsList) {
        const need = pluginNameFromExtends(ext);
        if (!need)
            continue;
        const has = plugins.some((p) => p === need ||
            p === `eslint-plugin-${need}` ||
            p.endsWith(`/${need}`) ||
            p.endsWith(`eslint-plugin-${need}`));
        // Also accept scoped: @foo/bar from plugin:@foo/bar/recommended → need=@foo
        // plugin:@typescript-eslint/recommended → need=@typescript-eslint
        if (!has) {
            // for scoped @typescript-eslint, plugins often list "@typescript-eslint"
            missingPlugins.push(need);
        }
    }
    if (missingPlugins.length > 0) {
        findings.push({
            severity: "warn",
            rule: "extends_needs_plugin",
            advice: `extends references plugin(s) not listed in plugins: ${[...new Set(missingPlugins)].join(", ")} — ensure matching plugins are declared (or provided by a shared config).`,
        });
    }
    // all rules off
    if (rules.length > 0 && rules.every((r) => r.severity === "off")) {
        findings.push({
            severity: "warn",
            rule: "all_rules_off",
            advice: "Every declared rule is severity off — config disables all listed rules (may be intentional overrides).",
        });
    }
    // eslint:recommended alone without other extends / plugins / rules — optional note
    if (extendsList.length === 1 &&
        extendsList[0] === "eslint:recommended" &&
        plugins.length === 0 &&
        rules.length === 0) {
        findings.push({
            severity: "info",
            rule: "recommended_alone",
            advice: "Only `eslint:recommended` is extended with no local rules/plugins — fine as a baseline; consider project-specific rules for stronger coverage.",
        });
    }
    // deprecated / conflicting: eslint:recommended + eslint:all
    if (extendsList.includes("eslint:recommended") &&
        extendsList.includes("eslint:all")) {
        findings.push({
            severity: "warn",
            rule: "recommended_and_all",
            advice: "Both `eslint:recommended` and `eslint:all` appear in extends — `eslint:all` already includes recommended; order/overrides may be confusing.",
        });
    }
    // no extends and no rules — sparse
    if (extendsList.length === 0 &&
        rules.length === 0 &&
        plugins.length === 0 &&
        !parser) {
        findings.push({
            severity: "info",
            rule: "sparse_config",
            advice: "No extends, rules, plugins, or parser — unusual empty-ish ESLint config (env-only or incomplete).",
        });
    }
    // parserOptions.ecmaVersion without parser note when using typescript parser mismatch smells
    if (parser &&
        /typescript|@typescript-eslint/.test(parser) &&
        envKeys.includes("es6") === false &&
        !parserOptions) {
        findings.push({
            severity: "info",
            rule: "ts_parser_no_parser_options",
            advice: "TypeScript parser set without parserOptions — often you want parserOptions.project or ecmaVersion/sourceType.",
        });
    }
    // root: false with extends relative — mild info skipped; keep simple
    // plugins without any extends/rules using them
    if (plugins.length > 0 && extendsList.length === 0 && rules.length === 0) {
        findings.push({
            severity: "info",
            rule: "plugins_unused_hint",
            advice: "plugins are declared but no extends or rules — plugin rules may be inactive unless a shared parent enables them.",
        });
    }
    // numeric-looking obsolete: use of eslint:recommended is fine; flag "eslint:recommended" with root missing? skip
    // env browser + node both true — common, just info
    if (envKeys.includes("browser") && envKeys.includes("node")) {
        findings.push({
            severity: "info",
            rule: "env_browser_and_node",
            advice: "Both `env.browser` and `env.node` are enabled — globals from both environments are available (verify intentional).",
        });
    }
    return findings;
}
