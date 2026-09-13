/**
 * Shared Jest config text helpers.
 * Prefer robust JSONC; JS configs via best-effort regex (no eval).
 * Unwrap package.json "jest" key. No jest binary, no network, no filesystem follow.
 */
/** Known Jest option keys we care about for extraction / lint. */
export const JEST_OPTION_KEYS = [
    "testMatch",
    "testRegex",
    "testPathIgnorePatterns",
    "roots",
    "rootDir",
    "collectCoverage",
    "coverageDirectory",
    "coverageThreshold",
    "collectCoverageFrom",
    "coverageReporters",
    "coveragePathIgnorePatterns",
    "projects",
    "transform",
    "transformIgnorePatterns",
    "moduleNameMapper",
    "moduleFileExtensions",
    "setupFiles",
    "setupFilesAfterEnv",
    "testEnvironment",
    "testEnvironmentOptions",
    "testURL",
    "timers",
    "fakeTimers",
    "browser",
    "mapCoverage",
    "setupTestFrameworkScriptFile",
    "scriptPreprocessor",
    "preprocessorIgnorePatterns",
    "testPathDirs",
    "globals",
    "preset",
    "displayName",
    "verbose",
    "bail",
    "maxWorkers",
    "testTimeout",
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
 * Handles string/number/boolean values and nested shallow objects/arrays.
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
                // Prefer string arrays; for projects also try object entries
                if (key === "projects") {
                    out[key] = heuristicProjectsArray(bal);
                }
                else {
                    const strs = stringsFromArrayLiteral(bal);
                    // If no strings but looks like nested objects, leave as raw parsed objects
                    if (strs.length) {
                        out[key] = strs;
                    }
                    else {
                        // Try to extract objects inside array (e.g. empty projects objects)
                        const objs = [];
                        let j = 1; // skip [
                        const arrInner = bal.slice(1, -1);
                        j = 0;
                        while (j < arrInner.length) {
                            while (j < arrInner.length && /[\s,]/.test(arrInner[j]))
                                j++;
                            if (j >= arrInner.length)
                                break;
                            if (arrInner[j] === "{") {
                                const ob = extractBalanced(arrInner, j);
                                if (!ob)
                                    break;
                                objs.push(heuristicObjectLiteral(ob));
                                j += ob.length;
                            }
                            else if (arrInner[j] === "[" || arrInner[j] === '"' || arrInner[j] === "'" || arrInner[j] === "`") {
                                // skip non-object
                                if (arrInner[j] === "[") {
                                    const nested = extractBalanced(arrInner, j);
                                    if (!nested)
                                        break;
                                    j += nested.length;
                                }
                                else {
                                    const sm = /^(["'`])((?:\\.|(?!\1).)*)\1/.exec(arrInner.slice(j));
                                    if (!sm) {
                                        j++;
                                        continue;
                                    }
                                    objs.push(sm[2].replace(/\\(.)/g, "$1"));
                                    j += sm[0].length;
                                }
                            }
                            else {
                                j++;
                            }
                        }
                        out[key] = objs.length ? objs : strs;
                    }
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
        if (/^null\b/.test(inner.slice(i))) {
            out[key] = null;
            i += 4;
            continue;
        }
        // regex literal e.g. testRegex: /foo/
        const reLit = /^\/(?:\\\/|[^/])+\/[gimsuy]*/.exec(inner.slice(i));
        if (reLit) {
            out[key] = reLit[0];
            i += reLit[0].length;
            continue;
        }
        i++;
    }
    return out;
}
function heuristicProjectsArray(arrSrc) {
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
        const strM = /^(["'`])((?:\\.|(?!\1).)*)\1/.exec(inner.slice(i));
        if (strM) {
            out.push(strM[2].replace(/\\(.)/g, "$1"));
            i += strM[0].length;
            continue;
        }
        i++;
    }
    return out;
}
/**
 * Heuristic JS extraction for jest.config.js / babel-style module.exports.
 * Limits: no eval, no require resolution, no spread/computed keys.
 */
export function heuristicExtractJs(text) {
    const src = text ?? "";
    let out = {};
    const mObj = /(?:module\.exports\s*=\s*|export\s+default\s*|exports\.default\s*=\s*)\{/.exec(src);
    if (mObj) {
        const start = mObj.index + mObj[0].lastIndexOf("{");
        const bal = extractBalanced(src, start);
        if (bal) {
            out = { ...out, ...heuristicObjectLiteral(bal) };
        }
    }
    // Top-level key: value fallbacks for common Jest keys
    const stringOrArrayKeys = [
        "testMatch",
        "testPathIgnorePatterns",
        "roots",
        "collectCoverageFrom",
        "coverageReporters",
        "coveragePathIgnorePatterns",
        "setupFiles",
        "setupFilesAfterEnv",
        "moduleFileExtensions",
        "transformIgnorePatterns",
    ];
    for (const key of stringOrArrayKeys) {
        if (out[key] !== undefined)
            continue;
        const mArr = new RegExp(`\\b${key}\\s*:\\s*\\[`).exec(src);
        if (mArr) {
            const bal = extractBalanced(src, mArr.index + mArr[0].indexOf("["));
            if (bal) {
                const list = stringsFromArrayLiteral(bal);
                if (list.length)
                    out[key] = list;
            }
            continue;
        }
        const mStr = new RegExp(`\\b${key}\\s*:\\s*(["'\`])((?:\\\\.|(?!\\1).)*)\\1`).exec(src);
        if (mStr) {
            out[key] = mStr[2].replace(/\\(.)/g, "$1");
        }
    }
    // testRegex can be string, array, or regex literal
    if (out.testRegex === undefined) {
        const mArr = /\btestRegex\s*:\s*\[/.exec(src);
        if (mArr) {
            const bal = extractBalanced(src, mArr.index + mArr[0].indexOf("["));
            if (bal) {
                const list = stringsFromArrayLiteral(bal);
                if (list.length)
                    out.testRegex = list;
            }
        }
        else {
            const mStr = /\btestRegex\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(src) ||
                /\btestRegex\s*:\s*(\/(?:\\\/|[^/])+\/[gimsuy]*)/.exec(src);
            if (mStr) {
                out.testRegex = mStr[2] ?? mStr[1];
            }
        }
    }
    // booleans / strings
    for (const key of [
        "collectCoverage",
        "coverageDirectory",
        "testEnvironment",
        "testURL",
        "preset",
        "rootDir",
        "verbose",
    ]) {
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
    // coverageThreshold: { ... }
    if (out.coverageThreshold === undefined) {
        const m = /\bcoverageThreshold\s*:\s*\{/.exec(src);
        if (m) {
            const bal = extractBalanced(src, m.index + m[0].indexOf("{"));
            if (bal)
                out.coverageThreshold = heuristicObjectLiteral(bal);
        }
    }
    // projects: [...]
    if (out.projects === undefined) {
        const mArr = /\bprojects\s*:\s*\[/.exec(src);
        if (mArr) {
            const bal = extractBalanced(src, mArr.index + mArr[0].indexOf("["));
            if (bal) {
                const projects = heuristicProjectsArray(bal);
                if (projects.length)
                    out.projects = projects;
            }
        }
    }
    // transform: { ... }
    if (out.transform === undefined) {
        const m = /\btransform\s*:\s*\{/.exec(src);
        if (m) {
            const bal = extractBalanced(src, m.index + m[0].indexOf("{"));
            if (bal)
                out.transform = heuristicObjectLiteral(bal);
        }
    }
    return out;
}
/**
 * If text is a package.json with a "jest" key, unwrap it.
 */
function unwrapPackageJsonJest(map) {
    if (map.jest !== undefined && asMap(map.jest)) {
        const hasPkgHints = map.name !== undefined ||
            map.dependencies !== undefined ||
            map.devDependencies !== undefined ||
            map.scripts !== undefined ||
            map.version !== undefined;
        if (hasPkgHints) {
            return { map: asMap(map.jest) ?? map, fromPackageJson: true };
        }
    }
    return { map, fromPackageJson: false };
}
export function parseJestConfigText(text) {
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
                const unwrapped = unwrapPackageJsonJest(map);
                return {
                    raw: unwrapped.map,
                    format: "jsonc",
                    fromPackageJson: unwrapped.fromPackageJson,
                };
            }
            return {
                raw: null,
                format: "jsonc",
                parseError: "Jest config root must be a JSON object",
            };
        }
        catch {
            // fall through
        }
    }
    // 2) JS heuristics
    if (looksLikeJs(trimmed) ||
        /\btestMatch\s*:/.test(trimmed) ||
        /\btestRegex\s*:/.test(trimmed) ||
        /\bcollectCoverage\s*:/.test(trimmed) ||
        /\bprojects\s*:/.test(trimmed) ||
        /\bcoverageThreshold\s*:/.test(trimmed)) {
        const extracted = heuristicExtractJs(trimmed);
        if (Object.keys(extracted).length > 0) {
            return { raw: extracted, format: "js-heuristic", heuristic: true };
        }
        return {
            raw: null,
            format: "js-heuristic",
            parseError: "JS config heuristics found no Jest options (limits: no eval; regex extraction only)",
            heuristic: true,
        };
    }
    return {
        raw: null,
        format: "unknown",
        parseError: "Unrecognized Jest config text",
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
export function normalizeStringOrStringList(value) {
    if (value === undefined || value === null)
        return undefined;
    if (typeof value === "string")
        return value;
    if (typeof value === "number")
        return String(value);
    if (Array.isArray(value)) {
        const list = normalizeStringList(value);
        return list.length ? list : undefined;
    }
    return undefined;
}
export function extractTestMatch(raw) {
    if (!raw)
        return {};
    const out = {};
    const tm = normalizeStringList(raw.testMatch);
    if (tm.length)
        out.testMatch = tm;
    const tr = normalizeStringOrStringList(raw.testRegex);
    if (tr !== undefined)
        out.testRegex = tr;
    const tip = normalizeStringList(raw.testPathIgnorePatterns);
    if (tip.length)
        out.testPathIgnorePatterns = tip;
    const roots = normalizeStringList(raw.roots);
    if (roots.length)
        out.roots = roots;
    // legacy alias
    if (!out.roots) {
        const dirs = normalizeStringList(raw.testPathDirs);
        if (dirs.length)
            out.roots = dirs;
    }
    return out;
}
export function extractCoverage(raw) {
    if (!raw)
        return {};
    const out = {};
    if (typeof raw.collectCoverage === "boolean") {
        out.collectCoverage = raw.collectCoverage;
    }
    if (typeof raw.coverageDirectory === "string") {
        out.coverageDirectory = raw.coverageDirectory;
    }
    else if (typeof raw.coverageDirectory === "number") {
        out.coverageDirectory = String(raw.coverageDirectory);
    }
    if (raw.coverageThreshold !== undefined) {
        out.coverageThreshold = raw.coverageThreshold;
    }
    const from = normalizeStringList(raw.collectCoverageFrom);
    if (from.length)
        out.collectCoverageFrom = from;
    const reps = normalizeStringList(raw.coverageReporters);
    if (reps.length)
        out.coverageReporters = reps;
    return out;
}
export function extractProjects(raw) {
    if (!raw)
        return { projects: [], count: 0 };
    const p = raw.projects;
    if (!Array.isArray(p))
        return { projects: [], count: 0 };
    const projects = [];
    for (const item of p) {
        if (typeof item === "string" || typeof item === "number") {
            projects.push(String(item));
            continue;
        }
        const map = asMap(item);
        if (map) {
            // Prefer keeping displayName + useful subset
            const entry = {};
            if (map.displayName !== undefined)
                entry.displayName = map.displayName;
            if (map.rootDir !== undefined)
                entry.rootDir = map.rootDir;
            if (map.testMatch !== undefined)
                entry.testMatch = map.testMatch;
            if (map.testRegex !== undefined)
                entry.testRegex = map.testRegex;
            // Keep full object if we got more keys, else the slim entry (or whole map)
            const keys = Object.keys(map);
            if (keys.length <= 6) {
                projects.push({ ...map });
            }
            else if (Object.keys(entry).length) {
                projects.push({ ...map });
            }
            else {
                projects.push(map);
            }
            continue;
        }
        projects.push(item);
    }
    return { projects, count: projects.length };
}
const DEPRECATED_KEYS = [
    {
        key: "testURL",
        advice: 'testURL is deprecated — prefer testEnvironmentOptions: { url: "..." }.',
    },
    {
        key: "timers",
        advice: 'timers is deprecated — prefer fakeTimers: { enableGlobally: true } (or legacyFakeTimers).',
    },
    {
        key: "browser",
        advice: "browser option was removed from Jest — remove it from the config.",
    },
    {
        key: "mapCoverage",
        advice: "mapCoverage is deprecated/removed — coverage mapping is automatic.",
    },
    {
        key: "setupTestFrameworkScriptFile",
        advice: "setupTestFrameworkScriptFile is deprecated — use setupFilesAfterEnv (array).",
    },
    {
        key: "scriptPreprocessor",
        advice: "scriptPreprocessor is deprecated — use transform.",
    },
    {
        key: "preprocessorIgnorePatterns",
        advice: "preprocessorIgnorePatterns is deprecated — use transformIgnorePatterns.",
    },
    {
        key: "testPathDirs",
        advice: "testPathDirs is deprecated — use roots.",
    },
];
export function lintJestConfig(raw, parseError, format, fromPackageJson) {
    const findings = [];
    if (parseError) {
        findings.push({
            severity: "error",
            rule: "invalid_config",
            advice: `Could not parse Jest config: ${parseError}`,
        });
        return findings;
    }
    if (!raw) {
        findings.push({
            severity: "info",
            rule: "empty_config",
            advice: "No Jest config content provided (empty input).",
        });
        return findings;
    }
    const keys = Object.keys(raw);
    if (keys.length === 0) {
        findings.push({
            severity: "info",
            rule: "empty_config",
            advice: "Parsed config object is empty — no Jest options detected.",
        });
        return findings;
    }
    if (fromPackageJson) {
        findings.push({
            severity: "info",
            rule: "package_json_jest_key",
            advice: 'Config was unwrapped from package.json "jest" key — fine for small setups; large configs often move to jest.config.* for clarity.',
        });
    }
    if (format === "js-heuristic") {
        findings.push({
            severity: "info",
            rule: "js_heuristic_limits",
            advice: "JS config was parsed with best-effort string heuristics (no eval). Nested spreads, computed keys, dynamic requires, and function-returned configs are not resolved — verify critical values manually. Prefer JSON/JSONC when possible for unambiguous parse.",
        });
    }
    const tm = extractTestMatch(raw);
    const hasMatch = (tm.testMatch && tm.testMatch.length > 0) ||
        tm.testRegex !== undefined;
    const hasProjects = Array.isArray(raw.projects) && raw.projects.length > 0;
    // Missing testMatch/testRegex (projects configs often omit root-level matchers)
    if (!hasMatch && !hasProjects) {
        findings.push({
            severity: "warn",
            rule: "missing_test_match_or_regex",
            advice: "No testMatch or testRegex set (and no projects). Jest defaults usually work, but explicit patterns make discovery clearer — especially in monorepos.",
        });
    }
    // Both testMatch and testRegex — Jest allows only one effectively (testRegex ignored if testMatch set in some versions; clarify)
    if (tm.testMatch &&
        tm.testMatch.length > 0 &&
        tm.testRegex !== undefined) {
        findings.push({
            severity: "info",
            rule: "both_test_match_and_regex",
            advice: "Both testMatch and testRegex are set — Jest prefers testMatch when both exist; remove one to avoid confusion.",
        });
    }
    const cov = extractCoverage(raw);
    if (cov.coverageThreshold !== undefined &&
        cov.collectCoverage !== true) {
        findings.push({
            severity: "warn",
            rule: "coverage_threshold_without_collect",
            advice: "coverageThreshold is set but collectCoverage is not true — thresholds only apply when coverage collection runs (CLI --coverage or collectCoverage: true).",
        });
    }
    if (cov.collectCoverageFrom &&
        cov.collectCoverageFrom.length > 0 &&
        cov.collectCoverage !== true) {
        findings.push({
            severity: "info",
            rule: "collect_coverage_from_without_flag",
            advice: "collectCoverageFrom is set without collectCoverage: true — patterns apply when coverage is enabled via config or --coverage.",
        });
    }
    // Deprecated keys
    for (const d of DEPRECATED_KEYS) {
        if (raw[d.key] !== undefined) {
            findings.push({
                severity: "warn",
                rule: `deprecated_${d.key}`,
                advice: d.advice,
            });
        }
    }
    // transformIgnorePatterns tips
    if (raw.transformIgnorePatterns !== undefined) {
        const tip = normalizeStringList(raw.transformIgnorePatterns);
        const joined = tip.join(" ");
        if (tip.length === 0) {
            findings.push({
                severity: "info",
                rule: "transform_ignore_patterns_empty",
                advice: "transformIgnorePatterns is empty — Jest will attempt to transform everything under node_modules, which is usually slow; prefer ignoring node_modules with selective allow-lists for ESM packages.",
            });
        }
        else if (/node_modules/.test(joined) &&
            !/\(\?!/.test(joined)) {
            findings.push({
                severity: "info",
                rule: "transform_ignore_patterns_tip",
                advice: "transformIgnorePatterns includes node_modules. To transform a specific ESM dependency, use a negative lookahead allow-list (e.g. /node_modules/(?!(package-a|package-b)/)) rather than removing the ignore entirely.",
            });
        }
    }
    // Ambiguous / sparse projects
    if (hasProjects) {
        const { projects } = extractProjects(raw);
        const nameless = projects.filter((p) => {
            if (typeof p === "string")
                return false;
            const m = asMap(p);
            return m && m.displayName === undefined;
        });
        if (nameless.length > 0) {
            findings.push({
                severity: "info",
                rule: "projects_missing_display_name",
                advice: `${nameless.length} project object(s) lack displayName — setting displayName improves multi-project reporter output.`,
            });
        }
    }
    // testEnvironment jsdom tip (informational)
    if (raw.testEnvironment === "jsdom") {
        findings.push({
            severity: "info",
            rule: "test_environment_jsdom",
            advice: 'testEnvironment "jsdom" requires the jest-environment-jsdom package on modern Jest — ensure it is installed separately.',
        });
    }
    return findings;
}
