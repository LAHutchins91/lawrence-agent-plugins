/**
 * Shared Cypress config text helpers.
 * Prefer robust JSONC; JS/TS configs via best-effort regex + defineConfig unwrap (no eval).
 * No cypress binary, no network, no filesystem follow.
 */
/** Common Cypress option keys we care about for extraction / lint. */
export const CYPRESS_TOP_KEYS = [
    "e2e",
    "component",
    "env",
    "projectId",
    "baseUrl",
    "chromeWebSecurity",
    "video",
    "videosFolder",
    "screenshotOnRunFailure",
    "screenshotsFolder",
    "viewportWidth",
    "viewportHeight",
    "defaultCommandTimeout",
    "requestTimeout",
    "responseTimeout",
    "pageLoadTimeout",
    "retries",
    "watchForFileChanges",
    "trashAssetsBeforeRuns",
    "numTestsKeptInMemory",
    "experimentalStudio",
    "fixturesFolder",
    "downloadsFolder",
    "supportFolder",
    "integrationFolder",
    "testFiles",
    "pluginsFile",
    "ignoreTestFiles",
];
export const E2E_OPTION_KEYS = [
    "baseUrl",
    "specPattern",
    "supportFile",
    "excludeSpecPattern",
    "viewportWidth",
    "viewportHeight",
    "setupNodeEvents",
    "chromeWebSecurity",
    "video",
    "videosFolder",
    "screenshotOnRunFailure",
    "screenshotsFolder",
    "defaultCommandTimeout",
    "requestTimeout",
    "responseTimeout",
    "pageLoadTimeout",
    "retries",
    "env",
    "experimentalRunAllSpecs",
    "experimentalStudio",
    "testIsolation",
];
export const COMPONENT_OPTION_KEYS = [
    "devServer",
    "specPattern",
    "supportFile",
    "excludeSpecPattern",
    "indexHtmlFile",
    "viewportWidth",
    "viewportHeight",
    "setupNodeEvents",
    "env",
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
        /\bimport\s+/.test(t) ||
        /\bdefineConfig\s*\(/.test(t)) {
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
                const strs = stringsFromArrayLiteral(bal);
                if (strs.length) {
                    out[key] = strs;
                }
                else {
                    // Try nested objects inside array (e.g. retries objects rarely)
                    const objs = [];
                    const arrInner = bal.slice(1, -1);
                    let j = 0;
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
                        else {
                            const sm = /^(["'`])((?:\\.|(?!\1).)*)\1/.exec(arrInner.slice(j));
                            if (sm) {
                                objs.push(sm[2].replace(/\\(.)/g, "$1"));
                                j += sm[0].length;
                            }
                            else {
                                j++;
                            }
                        }
                    }
                    out[key] = objs.length ? objs : strs;
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
        // Skip function / identifier values (setupNodeEvents, webpackConfig, etc.)
        const ident = /^[A-Za-z_$][\w$]*/.exec(inner.slice(i));
        if (ident) {
            // Keep a placeholder string so the key is listed
            out[key] = `<${ident[0]}>`;
            i += ident[0].length;
            // Skip optional call args: setupNodeEvents(on, config) { ... }
            while (i < inner.length && /\s/.test(inner[i]))
                i++;
            if (inner[i] === "(") {
                const paren = extractBalancedParen(inner, i);
                if (paren)
                    i += paren.length;
            }
            while (i < inner.length && /\s/.test(inner[i]))
                i++;
            if (inner[i] === "{") {
                const fnBody = extractBalanced(inner, i);
                if (fnBody)
                    i += fnBody.length;
            }
            else if (inner[i] === "=" && inner[i + 1] === ">") {
                i += 2;
                while (i < inner.length && /\s/.test(inner[i]))
                    i++;
                if (inner[i] === "{") {
                    const fnBody = extractBalanced(inner, i);
                    if (fnBody)
                        i += fnBody.length;
                }
            }
            continue;
        }
        i++;
    }
    return out;
}
function extractBalancedParen(src, start) {
    if (src[start] !== "(")
        return null;
    let depth = 0;
    let inStr = null;
    let escape = false;
    for (let i = start; i < src.length; i++) {
        const ch = src[i];
        if (inStr) {
            if (escape)
                escape = false;
            else if (ch === "\\")
                escape = true;
            else if (ch === inStr)
                inStr = null;
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
/**
 * Find the primary config object from defineConfig(...) / module.exports / export default.
 */
function findRootObjectLiteral(src) {
    // defineConfig({ ... }) — most common Cypress pattern
    const def = /\bdefineConfig\s*\(\s*\{/.exec(src);
    if (def) {
        const start = def.index + def[0].lastIndexOf("{");
        const bal = extractBalanced(src, start);
        if (bal)
            return bal;
    }
    // module.exports = { ... } / export default { ... }
    const mObj = /(?:module\.exports\s*=\s*|export\s+default\s*|exports\.default\s*=\s*)\{/.exec(src);
    if (mObj) {
        const start = mObj.index + mObj[0].lastIndexOf("{");
        const bal = extractBalanced(src, start);
        if (bal)
            return bal;
    }
    // module.exports = defineConfig({...}) already covered by defineConfig
    return null;
}
/**
 * Heuristic JS/TS extraction for cypress.config.js / .ts.
 * Limits: no eval, no require resolution, no spread/computed keys.
 */
export function heuristicExtractJs(text) {
    const src = text ?? "";
    let out = {};
    const root = findRootObjectLiteral(src);
    if (root) {
        out = { ...out, ...heuristicObjectLiteral(root) };
    }
    // Fallback: pull top-level e2e / component / env blocks if missed
    for (const key of ["e2e", "component", "env"]) {
        if (out[key] !== undefined)
            continue;
        const m = new RegExp(`\\b${key}\\s*:\\s*\\{`).exec(src);
        if (m) {
            const bal = extractBalanced(src, m.index + m[0].indexOf("{"));
            if (bal)
                out[key] = heuristicObjectLiteral(bal);
        }
    }
    // Top-level scalar Cypress options sometimes outside nested blocks (legacy)
    for (const key of [
        "baseUrl",
        "chromeWebSecurity",
        "video",
        "videosFolder",
        "screenshotOnRunFailure",
        "screenshotsFolder",
        "viewportWidth",
        "viewportHeight",
        "projectId",
        "fixturesFolder",
        "integrationFolder",
        "testFiles",
        "pluginsFile",
        "supportFile",
    ]) {
        if (out[key] !== undefined)
            continue;
        // Prefer not to steal from nested e2e/component — only match at rough top level
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
    return out;
}
export function parseCypressConfigText(text) {
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
                return { raw: map, format: "jsonc" };
            }
            return {
                raw: null,
                format: "jsonc",
                parseError: "Cypress config root must be a JSON object",
            };
        }
        catch {
            // fall through
        }
    }
    // 2) JS/TS heuristics (defineConfig / module.exports)
    if (looksLikeJs(trimmed) ||
        /\be2e\s*:/.test(trimmed) ||
        /\bcomponent\s*:/.test(trimmed) ||
        /\bbaseUrl\s*:/.test(trimmed) ||
        /\bspecPattern\s*:/.test(trimmed) ||
        /\bintegrationFolder\s*:/.test(trimmed)) {
        const extracted = heuristicExtractJs(trimmed);
        if (Object.keys(extracted).length > 0) {
            return { raw: extracted, format: "js-heuristic", heuristic: true };
        }
        return {
            raw: null,
            format: "js-heuristic",
            parseError: "JS/TS config heuristics found no Cypress options (limits: no eval; regex extraction only)",
            heuristic: true,
        };
    }
    return {
        raw: null,
        format: "unknown",
        parseError: "Unrecognized Cypress config text",
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
function pickKnown(map, keys) {
    if (!map)
        return {};
    const out = {};
    for (const k of keys) {
        if (map[k] !== undefined)
            out[k] = map[k];
    }
    // Also keep any other own keys so callers see extras via keys[]
    for (const k of Object.keys(map)) {
        if (out[k] === undefined)
            out[k] = map[k];
    }
    return out;
}
export function extractE2e(raw) {
    if (!raw)
        return { keys: [] };
    const block = asMap(raw.e2e);
    if (block) {
        const e2e = pickKnown(block, E2E_OPTION_KEYS);
        // Normalize common list fields
        if (e2e.specPattern !== undefined) {
            const list = normalizeStringList(e2e.specPattern);
            if (list.length === 1)
                e2e.specPattern = list[0];
            else if (list.length > 1)
                e2e.specPattern = list;
        }
        if (e2e.excludeSpecPattern !== undefined) {
            const list = normalizeStringList(e2e.excludeSpecPattern);
            if (list.length)
                e2e.excludeSpecPattern = list.length === 1 ? list[0] : list;
        }
        return { e2e, keys: Object.keys(e2e).sort() };
    }
    // Legacy flat configs sometimes put baseUrl / supportFile at top level
    const legacy = {};
    for (const k of [
        "baseUrl",
        "supportFile",
        "viewportWidth",
        "viewportHeight",
        "chromeWebSecurity",
        "video",
        "integrationFolder",
        "testFiles",
    ]) {
        if (raw[k] !== undefined)
            legacy[k] = raw[k];
    }
    if (Object.keys(legacy).length) {
        return { e2e: legacy, keys: Object.keys(legacy).sort() };
    }
    return { keys: [] };
}
export function extractComponent(raw) {
    if (!raw)
        return { keys: [] };
    const block = asMap(raw.component);
    if (!block)
        return { keys: [] };
    const component = pickKnown(block, COMPONENT_OPTION_KEYS);
    if (component.specPattern !== undefined) {
        const list = normalizeStringList(component.specPattern);
        if (list.length === 1)
            component.specPattern = list[0];
        else if (list.length > 1)
            component.specPattern = list;
    }
    // Normalize devServer to a shallow object if present
    const ds = asMap(component.devServer);
    if (ds) {
        component.devServer = { ...ds };
    }
    return { component, keys: Object.keys(component).sort() };
}
const SECRET_KEY_RE = /pass(word|wd)?|secret|token|api[_-]?key|auth|credential|private[_-]?key|access[_-]?key|client[_-]?secret/i;
function looksSecretKey(key) {
    return SECRET_KEY_RE.test(key);
}
function looksSecretValue(value) {
    if (typeof value !== "string")
        return false;
    const v = value.trim();
    if (v.length < 8)
        return false;
    // Obvious secret-ish shapes (not exhaustive)
    if (/^(sk|pk|rk|ghp|gho|xox[baprs]|AKIA)[A-Za-z0-9_\-]{8,}$/.test(v))
        return true;
    if (/^[A-Za-z0-9_\-+/=]{24,}$/.test(v) && /[0-9]/.test(v) && /[A-Za-z]/.test(v))
        return true;
    return false;
}
/**
 * Merge top-level env with nested e2e.env / component.env.
 * Optionally redact obvious secret-looking values; keys always listed.
 */
export function extractEnv(raw, redact = true) {
    const env = {};
    if (!raw)
        return { env, keys: [], count: 0 };
    const merge = (src) => {
        const map = asMap(src);
        if (!map)
            return;
        for (const [k, v] of Object.entries(map)) {
            env[k] = v;
        }
    };
    merge(raw.env);
    const e2e = asMap(raw.e2e);
    if (e2e)
        merge(e2e.env);
    const component = asMap(raw.component);
    if (component)
        merge(component.env);
    if (redact) {
        for (const [k, v] of Object.entries(env)) {
            if (looksSecretKey(k) || looksSecretValue(v)) {
                env[k] = "[REDACTED]";
            }
        }
    }
    const keys = Object.keys(env).sort();
    return { env, keys, count: keys.length };
}
const DEPRECATED_KEYS = [
    {
        key: "integrationFolder",
        advice: "integrationFolder is deprecated (Cypress 10+) — use e2e.specPattern instead.",
    },
    {
        key: "testFiles",
        advice: "testFiles is deprecated (Cypress 10+) — use e2e.specPattern / component.specPattern.",
    },
    {
        key: "ignoreTestFiles",
        advice: "ignoreTestFiles is deprecated — use e2e.excludeSpecPattern / component.excludeSpecPattern.",
    },
    {
        key: "pluginsFile",
        advice: "pluginsFile is deprecated — migrate plugin logic into setupNodeEvents inside e2e/component.",
    },
    {
        key: "supportFolder",
        advice: "supportFolder is uncommon/legacy — prefer e2e.supportFile / component.supportFile paths.",
    },
];
function hasDeprecatedAnywhere(raw, key) {
    if (raw[key] !== undefined)
        return true;
    const e2e = asMap(raw.e2e);
    if (e2e && e2e[key] !== undefined)
        return true;
    const component = asMap(raw.component);
    if (component && component[key] !== undefined)
        return true;
    return false;
}
export function lintCypressConfig(raw, parseError, format) {
    const findings = [];
    if (parseError) {
        findings.push({
            severity: "error",
            rule: "invalid_config",
            advice: `Could not parse Cypress config: ${parseError}`,
        });
        return findings;
    }
    if (!raw) {
        findings.push({
            severity: "info",
            rule: "empty_config",
            advice: "No Cypress config content provided (empty input).",
        });
        return findings;
    }
    const keys = Object.keys(raw);
    if (keys.length === 0) {
        findings.push({
            severity: "info",
            rule: "empty_config",
            advice: "Parsed config object is empty — no Cypress options detected.",
        });
        return findings;
    }
    if (format === "js-heuristic") {
        findings.push({
            severity: "info",
            rule: "js_heuristic_limits",
            advice: "JS/TS config was parsed with best-effort string heuristics (no eval). defineConfig unwrap is supported, but spreads, computed keys, dynamic requires, and function bodies (setupNodeEvents) are not resolved — verify critical values manually. Prefer JSON/JSONC when possible for unambiguous parse.",
        });
    }
    const hasE2e = asMap(raw.e2e) !== null;
    const hasComponent = asMap(raw.component) !== null;
    const legacyFlat = raw.baseUrl !== undefined ||
        raw.integrationFolder !== undefined ||
        raw.testFiles !== undefined ||
        raw.supportFile !== undefined;
    if (!hasE2e && !hasComponent && !legacyFlat) {
        findings.push({
            severity: "warn",
            rule: "missing_e2e_and_component",
            advice: "No e2e or component block detected. Cypress 10+ configs usually define at least one of e2e / component via defineConfig({ e2e: {...} }).",
        });
    }
    // chromeWebSecurity: false tip
    const chromeFalse = raw.chromeWebSecurity === false ||
        asMap(raw.e2e)?.chromeWebSecurity === false ||
        asMap(raw.component)?.chromeWebSecurity === false;
    if (chromeFalse) {
        findings.push({
            severity: "warn",
            rule: "chrome_web_security_disabled",
            advice: "chromeWebSecurity is false — this disables same-origin checks in Chromium and can hide real CORS/auth issues. Prefer fixing origin problems or using cy.origin() when possible; keep false only when intentionally testing cross-origin flows.",
        });
    }
    // video / screenshot defaults
    const video = raw.video !== undefined
        ? raw.video
        : asMap(raw.e2e)?.video !== undefined
            ? asMap(raw.e2e)?.video
            : undefined;
    if (video === true) {
        findings.push({
            severity: "info",
            rule: "video_enabled",
            advice: "video is true — recordings can consume significant CI disk/time. Cypress defaults have shifted over versions; confirm you still want videos in CI and prune videosFolder artifacts.",
        });
    }
    else if (video === false) {
        findings.push({
            severity: "info",
            rule: "video_disabled",
            advice: "video is false — fine for faster CI; keep screenshotOnRunFailure enabled if you still want failure artifacts.",
        });
    }
    const shot = raw.screenshotOnRunFailure !== undefined
        ? raw.screenshotOnRunFailure
        : asMap(raw.e2e)?.screenshotOnRunFailure;
    if (shot === false) {
        findings.push({
            severity: "info",
            rule: "screenshots_on_failure_disabled",
            advice: "screenshotOnRunFailure is false — failure diagnosis in CI is harder without screenshots. Consider leaving the Cypress default (true) unless storage is constrained.",
        });
    }
    // Hardcoded secrets in env
    const envSummary = extractEnv(raw, false);
    for (const [k, v] of Object.entries(envSummary.env)) {
        if (looksSecretKey(k) || looksSecretValue(v)) {
            findings.push({
                severity: "warn",
                rule: "hardcoded_secret_in_env",
                advice: `env key "${k}" looks like a secret hardcoded in config text — prefer Cypress.env / CI secrets / dotenv loaded outside source control; do not commit real credentials.`,
            });
            break; // one finding is enough
        }
    }
    // Deprecated keys
    for (const d of DEPRECATED_KEYS) {
        if (hasDeprecatedAnywhere(raw, d.key)) {
            findings.push({
                severity: "warn",
                rule: `deprecated_${d.key}`,
                advice: d.advice,
            });
        }
    }
    // baseUrl tips
    const e2e = asMap(raw.e2e);
    const baseUrl = (e2e && typeof e2e.baseUrl === "string" && e2e.baseUrl) ||
        (typeof raw.baseUrl === "string" && raw.baseUrl) ||
        undefined;
    if (baseUrl && /localhost|127\.0\.0\.1/.test(baseUrl)) {
        findings.push({
            severity: "info",
            rule: "baseurl_localhost",
            advice: "baseUrl points at localhost — ensure CI starts the app (or use Cypress web/dev server patterns) before e2e runs.",
        });
    }
    // Missing specPattern when e2e present (informational — Cypress has defaults)
    if (e2e && e2e.specPattern === undefined && raw.integrationFolder === undefined) {
        findings.push({
            severity: "info",
            rule: "e2e_default_spec_pattern",
            advice: "e2e block has no specPattern — Cypress defaults (e.g. cypress/e2e/**/*.cy.{js,jsx,ts,tsx}) usually apply; set explicitly in monorepos.",
        });
    }
    // component without devServer
    const component = asMap(raw.component);
    if (component && component.devServer === undefined) {
        findings.push({
            severity: "warn",
            rule: "component_missing_devServer",
            advice: "component block has no devServer — component testing typically needs devServer (framework/bundler) configured.",
        });
    }
    return findings;
}
