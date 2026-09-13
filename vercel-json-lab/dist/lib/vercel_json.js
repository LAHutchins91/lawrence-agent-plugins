/**
 * Shared vercel.json text helpers.
 * JSON / JSONC best-effort heuristics. No vercel CLI, no network, no filesystem follow.
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
function stringOrUndef(v) {
    if (typeof v === "string") {
        const t = v.trim();
        return t || undefined;
    }
    return undefined;
}
function boolOrUndef(v) {
    if (typeof v === "boolean")
        return v;
    return undefined;
}
function numberOrUndef(v) {
    if (typeof v === "number" && Number.isFinite(v))
        return v;
    return undefined;
}
export function parseVercelJsonText(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed) {
        return { raw: null, format: "empty", source: text ?? "" };
    }
    const stripped = stripJsonComments(trimmed);
    try {
        const parsed = JSON.parse(stripped);
        const map0 = asMap(parsed);
        if (map0) {
            return { raw: map0, format: "jsonc", source: trimmed };
        }
        return {
            raw: null,
            format: "jsonc",
            parseError: "vercel.json root must be a JSON object",
            source: trimmed,
        };
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return {
            raw: null,
            format: "unknown",
            parseError: `Invalid vercel.json JSON: ${msg}`,
            source: trimmed,
        };
    }
}
export function extractRewrites(raw) {
    if (!raw || !Array.isArray(raw.rewrites)) {
        return { rewrites: [], count: 0 };
    }
    const rewrites = [];
    for (const item of raw.rewrites) {
        const map = asMap(item);
        if (!map)
            continue;
        const entry = {};
        const source = stringOrUndef(map.source);
        const destination = stringOrUndef(map.destination);
        if (source !== undefined)
            entry.source = source;
        if (destination !== undefined)
            entry.destination = destination;
        if (map.has !== undefined)
            entry.has = map.has;
        if (entry.source !== undefined ||
            entry.destination !== undefined ||
            entry.has !== undefined) {
            rewrites.push(entry);
        }
    }
    return { rewrites, count: rewrites.length };
}
export function extractRedirects(raw) {
    if (!raw || !Array.isArray(raw.redirects)) {
        return { redirects: [], count: 0 };
    }
    const redirects = [];
    for (const item of raw.redirects) {
        const map = asMap(item);
        if (!map)
            continue;
        const entry = {};
        const source = stringOrUndef(map.source);
        const destination = stringOrUndef(map.destination);
        const permanent = boolOrUndef(map.permanent);
        const statusCode = numberOrUndef(map.statusCode);
        if (source !== undefined)
            entry.source = source;
        if (destination !== undefined)
            entry.destination = destination;
        if (permanent !== undefined)
            entry.permanent = permanent;
        if (statusCode !== undefined)
            entry.statusCode = statusCode;
        if (entry.source !== undefined ||
            entry.destination !== undefined ||
            entry.permanent !== undefined ||
            entry.statusCode !== undefined) {
            redirects.push(entry);
        }
    }
    return { redirects, count: redirects.length };
}
export function extractHeadersHint(raw) {
    if (!raw || !Array.isArray(raw.headers)) {
        return { headers: [], count: 0, keys: [] };
    }
    const headers = [];
    const keySet = new Set();
    for (const item of raw.headers) {
        const map = asMap(item);
        if (!map)
            continue;
        const rule = { headers: [] };
        const source = stringOrUndef(map.source);
        if (source !== undefined)
            rule.source = source;
        if (Array.isArray(map.headers)) {
            for (const h of map.headers) {
                const hm = asMap(h);
                if (!hm)
                    continue;
                const key = stringOrUndef(hm.key);
                const value = typeof hm.value === "string" ? hm.value : undefined;
                if (key !== undefined && value !== undefined) {
                    rule.headers.push({ key, value });
                    keySet.add(key);
                }
                else if (key !== undefined) {
                    rule.headers.push({ key, value: value ?? "" });
                    keySet.add(key);
                }
            }
        }
        if (rule.source !== undefined || rule.headers.length > 0) {
            headers.push(rule);
        }
    }
    return {
        headers,
        count: headers.length,
        keys: Array.from(keySet).sort((a, b) => a.localeCompare(b)),
    };
}
const SECURITY_HEADER_KEYS = [
    "content-security-policy",
    "x-content-type-options",
    "x-frame-options",
    "strict-transport-security",
    "referrer-policy",
    "permissions-policy",
];
function isCatchAllSource(source) {
    if (!source)
        return false;
    const s = source.trim();
    return (s === "/(.*)" ||
        s === "/:path*" ||
        s === "/(.*)*" ||
        s === "/:path(.*)" ||
        /^\/\(\.\*\)$/.test(s) ||
        /^\/:\w+\*$/.test(s) ||
        s === "/*" ||
        s === "/(.*)");
}
export function extractTopLevelSummary(raw) {
    const summary = {
        hasBuilds: false,
        buildsCount: 0,
        hasFunctions: false,
        functionKeys: [],
        hasRoutes: false,
        routesCount: 0,
    };
    if (!raw)
        return summary;
    if (typeof raw.version === "number" || typeof raw.version === "string") {
        summary.version = raw.version;
    }
    if (Array.isArray(raw.builds)) {
        summary.hasBuilds = true;
        summary.buildsCount = raw.builds.length;
    }
    const fn = asMap(raw.functions);
    if (fn) {
        summary.hasFunctions = true;
        summary.functionKeys = Object.keys(fn);
    }
    const cu = boolOrUndef(raw.cleanUrls);
    if (cu !== undefined)
        summary.cleanUrls = cu;
    const ts = boolOrUndef(raw.trailingSlash);
    if (ts !== undefined)
        summary.trailingSlash = ts;
    if (Array.isArray(raw.routes)) {
        summary.hasRoutes = true;
        summary.routesCount = raw.routes.length;
    }
    return summary;
}
export function lintVercelJson(raw, parseError, format) {
    const findings = [];
    if (parseError) {
        findings.push({
            severity: "error",
            rule: "invalid_config",
            advice: `Could not parse vercel.json: ${parseError}`,
        });
        return findings;
    }
    if (!raw || format === "empty") {
        findings.push({
            severity: "info",
            rule: "empty_config",
            advice: "No vercel.json content provided (empty input).",
        });
        return findings;
    }
    const keys = Object.keys(raw);
    if (keys.length === 0) {
        findings.push({
            severity: "info",
            rule: "empty_config",
            advice: "Parsed vercel.json object is empty — no fields detected.",
        });
        return findings;
    }
    const top = extractTopLevelSummary(raw);
    const rewrites = extractRewrites(raw);
    const redirects = extractRedirects(raw);
    const headersHint = extractHeadersHint(raw);
    if (top.trailingSlash === undefined) {
        findings.push({
            severity: "info",
            rule: "trailing_slash_unset",
            advice: 'trailingSlash is unset — Vercel defaults vary by framework. Set "trailingSlash": true|false explicitly to avoid mixed URL canonicalization.',
        });
    }
    else {
        findings.push({
            severity: "info",
            rule: "trailing_slash_set",
            advice: `trailingSlash is ${top.trailingSlash} — ensure redirects/rewrites and framework routing agree on slash style.`,
        });
    }
    if (top.cleanUrls !== undefined) {
        findings.push({
            severity: "info",
            rule: "clean_urls_set",
            advice: `cleanUrls is ${top.cleanUrls} — confirm this matches how your static/HTML paths are linked.`,
        });
    }
    const catchAllRewrites = rewrites.rewrites.filter((r) => isCatchAllSource(r.source));
    if (catchAllRewrites.length > 0) {
        findings.push({
            severity: "warn",
            rule: "catchall_rewrite_smell",
            advice: `Catch-all rewrite source(s) detected (${catchAllRewrites
                .map((r) => r.source)
                .join(", ")}) → ${catchAllRewrites
                .map((r) => r.destination ?? "?")
                .join(", ")}. Broad rewrites can shadow API/static routes — place specific rules first and verify order.`,
        });
    }
    const lowerKeys = new Set(headersHint.keys.map((k) => k.toLowerCase()));
    const missingSec = SECURITY_HEADER_KEYS.filter((k) => !lowerKeys.has(k));
    if (headersHint.count === 0) {
        findings.push({
            severity: "info",
            rule: "missing_security_headers_tip",
            advice: 'No headers[] rules detected — consider adding common security headers (e.g. X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, and CSP where appropriate). Educational tip only.',
        });
    }
    else if (missingSec.length >= 4) {
        findings.push({
            severity: "info",
            rule: "missing_security_headers_tip",
            advice: `headers[] present but several common security header keys were not seen (${missingSec
                .slice(0, 4)
                .join(", ")}${missingSec.length > 4 ? ", …" : ""}). Review whether your CDN/framework already sets them.`,
        });
    }
    if (top.hasBuilds || top.hasFunctions) {
        const parts = [];
        if (top.hasBuilds)
            parts.push(`builds=${top.buildsCount}`);
        if (top.hasFunctions) {
            parts.push(`functions=${top.functionKeys.length ? top.functionKeys.join(",") : "(object)"}`);
        }
        findings.push({
            severity: "info",
            rule: "builds_functions_summary",
            advice: `Legacy/platform fields detected: ${parts.join("; ")}. On modern Vercel projects, builds[] is often unnecessary (framework detection); functions{} still used for runtime/memory overrides.`,
        });
    }
    if (top.hasRoutes) {
        findings.push({
            severity: "warn",
            rule: "routes_deprecated_tip",
            advice: `routes[] is present (${top.routesCount} entr${top.routesCount === 1 ? "y" : "ies"}) — routes is a legacy vercel.json field. Prefer rewrites / redirects / headers / cleanUrls for new configs.`,
        });
    }
    if (rewrites.count === 0 &&
        redirects.count === 0 &&
        headersHint.count === 0 &&
        !top.hasBuilds &&
        !top.hasFunctions &&
        !top.hasRoutes &&
        top.trailingSlash === undefined &&
        top.cleanUrls === undefined &&
        top.version === undefined) {
        findings.push({
            severity: "info",
            rule: "minimal_config",
            advice: "No rewrites/redirects/headers/builds/functions/routes detected — fine for a minimal vercel.json; add rules as routing needs grow.",
        });
    }
    if (top.version !== undefined && top.version !== 2 && top.version !== "2") {
        findings.push({
            severity: "info",
            rule: "version_note",
            advice: `version is ${JSON.stringify(top.version)} — current vercel.json docs typically use version 2.`,
        });
    }
    return findings;
}
