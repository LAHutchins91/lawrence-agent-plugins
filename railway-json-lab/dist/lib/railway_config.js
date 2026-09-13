/**
 * Shared railway.json / railway.toml text helpers.
 * JSON/JSONC + light TOML heuristics. No Railway API, no network, no filesystem follow.
 */
import { tomlParseLite } from "./toml_lite.js";
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
function numberOrUndef(v) {
    if (typeof v === "number" && Number.isFinite(v))
        return v;
    return undefined;
}
function stringArrayOrUndef(v) {
    if (!Array.isArray(v))
        return undefined;
    const out = [];
    for (const item of v) {
        if (typeof item === "string" && item.trim())
            out.push(item.trim());
    }
    return out.length ? out : undefined;
}
function looksLikeJson(text) {
    const t = text.trim();
    if (t.startsWith("{"))
        return true;
    // Distinguish JSON arrays from TOML [table] headers.
    if (t.startsWith("[")) {
        const rest = t.slice(1).trimStart();
        if (!rest)
            return true;
        const c = rest[0];
        if (c === '"' ||
            c === "'" ||
            c === "{" ||
            c === "[" ||
            c === "]" ||
            (c >= "0" && c <= "9") ||
            c === "-") {
            return true;
        }
        return false; // bare key → TOML table
    }
    return false;
}
function looksLikeToml(text) {
    const t = text.trim();
    if (!t || looksLikeJson(t))
        return false;
    if (/^\s*\[/.test(t))
        return true;
    if (/^[A-Za-z0-9_"'][^=\n]*=/m.test(t))
        return true;
    return false;
}
export function parseRailwayConfigText(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed) {
        return { raw: null, format: "empty", source: text ?? "" };
    }
    const preferJson = looksLikeJson(trimmed);
    const preferToml = !preferJson && looksLikeToml(trimmed);
    if (preferJson || (!preferToml && trimmed.includes("{"))) {
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
                parseError: "railway.json root must be a JSON object",
                source: trimmed,
            };
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            if (!looksLikeToml(trimmed)) {
                return {
                    raw: null,
                    format: "unknown",
                    parseError: `Invalid railway.json JSON: ${msg}`,
                    source: trimmed,
                };
            }
            // else fall through to TOML
        }
    }
    const toml = tomlParseLite({ text: trimmed });
    if (toml.ok) {
        return { raw: toml.data, format: "toml", source: trimmed };
    }
    const first = toml.errors[0];
    return {
        raw: null,
        format: "unknown",
        parseError: `Invalid railway.toml TOML${first?.line !== undefined ? ` (line ${first.line})` : ""}: ${first?.message ?? "parse failed"}`,
        source: trimmed,
    };
}
function buildMap(v) {
    const m = asMap(v);
    return m ?? undefined;
}
function serviceFromParts(name, build, deploy) {
    const entry = {};
    if (name !== undefined && name.trim())
        entry.name = name.trim();
    const b = buildMap(build);
    const d = buildMap(deploy);
    if (b)
        entry.build = b;
    if (d)
        entry.deploy = d;
    if (entry.name !== undefined || entry.build || entry.deploy)
        return entry;
    return null;
}
export function extractServices(raw) {
    const services = [];
    if (!raw)
        return { services, count: 0 };
    const svc = raw.services;
    if (Array.isArray(svc)) {
        for (const item of svc) {
            const map = asMap(item);
            if (!map)
                continue;
            const name = stringOrUndef(map.name) ?? stringOrUndef(map.service);
            const entry = serviceFromParts(name, map.build, map.deploy);
            if (entry)
                services.push(entry);
        }
    }
    else {
        const svcMap = asMap(svc);
        if (svcMap) {
            for (const [key, val] of Object.entries(svcMap)) {
                const map = asMap(val);
                if (!map) {
                    // bare service name / placeholder
                    services.push({ name: key });
                    continue;
                }
                const name = stringOrUndef(map.name) ?? key;
                const entry = serviceFromParts(name, map.build ?? (asMap(map) && map.builder !== undefined ? map : undefined), map.deploy);
                // Prefer nested build/deploy; if table itself looks like build fields, treat as build
                if (!entry?.build && !entry?.deploy) {
                    const looksBuild = map.buildCommand !== undefined ||
                        map.builder !== undefined ||
                        map.dockerfilePath !== undefined ||
                        map.watchPatterns !== undefined;
                    const looksDeploy = map.startCommand !== undefined ||
                        map.healthcheckPath !== undefined ||
                        map.numReplicas !== undefined ||
                        map.restartPolicyType !== undefined;
                    const e2 = serviceFromParts(name, looksBuild ? map : map.build, looksDeploy ? map : map.deploy);
                    if (e2)
                        services.push(e2);
                    else
                        services.push({ name });
                }
                else if (entry) {
                    services.push(entry);
                }
            }
        }
    }
    // Top-level single-service railway.json / railway.toml
    if (services.length === 0) {
        const hasBuild = asMap(raw.build) !== null;
        const hasDeploy = asMap(raw.deploy) !== null;
        if (hasBuild || hasDeploy) {
            const entry = serviceFromParts(stringOrUndef(raw.name) ?? stringOrUndef(raw.service), raw.build, raw.deploy);
            if (entry)
                services.push(entry);
        }
    }
    return { services, count: services.length };
}
const SECRET_KEY_RE = /(secret|password|passwd|pwd|token|api[_-]?key|private[_-]?key|access[_-]?key|auth[_-]?key|credential|client[_-]?secret|signing[_-]?key|database[_-]?url|connection[_-]?string)/i;
function looksLikeSecretValue(v) {
    if (typeof v !== "string")
        return false;
    const t = v.trim();
    if (!t)
        return false;
    if (/^(sk-|rk-|AKIA|ghp_|github_pat_|xox[baprs]-|Bearer\s|eyJ)/i.test(t)) {
        return true;
    }
    if (/^(postgres|mysql|mongodb|redis|amqp):\/\//i.test(t) &&
        /[:@]/.test(t)) {
        return true;
    }
    if (t.length >= 24 && /^[A-Za-z0-9/+=._-]{24,}$/.test(t) && /[0-9]/.test(t)) {
        return true;
    }
    return false;
}
function collectEnvKeysFromMap(map, keys, redacted) {
    if (!map)
        return;
    for (const [k, v] of Object.entries(map)) {
        if (!k.trim())
            continue;
        keys.add(k);
        if (SECRET_KEY_RE.test(k) || looksLikeSecretValue(v)) {
            redacted.add(k);
        }
    }
}
function walkEnvContainers(raw, keys, redacted) {
    collectEnvKeysFromMap(asMap(raw.env), keys, redacted);
    collectEnvKeysFromMap(asMap(raw.variables), keys, redacted);
    collectEnvKeysFromMap(asMap(raw.environment), keys, redacted);
    const envs = asMap(raw.environments);
    if (envs) {
        for (const envVal of Object.values(envs)) {
            const em = asMap(envVal);
            if (!em)
                continue;
            collectEnvKeysFromMap(asMap(em.variables), keys, redacted);
            collectEnvKeysFromMap(asMap(em.env), keys, redacted);
            collectEnvKeysFromMap(asMap(em.environment), keys, redacted);
        }
    }
    const services = raw.services;
    const svcMap = asMap(services);
    if (svcMap) {
        for (const val of Object.values(svcMap)) {
            const sm = asMap(val);
            if (!sm)
                continue;
            collectEnvKeysFromMap(asMap(sm.env), keys, redacted);
            collectEnvKeysFromMap(asMap(sm.variables), keys, redacted);
            collectEnvKeysFromMap(asMap(sm.environment), keys, redacted);
        }
    }
    else if (Array.isArray(services)) {
        for (const item of services) {
            const sm = asMap(item);
            if (!sm)
                continue;
            collectEnvKeysFromMap(asMap(sm.env), keys, redacted);
            collectEnvKeysFromMap(asMap(sm.variables), keys, redacted);
        }
    }
}
export function extractEnvKeys(raw) {
    const keys = new Set();
    const redacted = new Set();
    if (raw)
        walkEnvContainers(raw, keys, redacted);
    const keyList = Array.from(keys).sort((a, b) => a.localeCompare(b));
    const redList = Array.from(redacted).sort((a, b) => a.localeCompare(b));
    const out = {
        keys: keyList,
        count: keyList.length,
    };
    if (redList.length)
        out.redacted = redList;
    return out;
}
function pickDeployHintFromMaps(build, deploy) {
    const out = {};
    if (build) {
        const bc = stringOrUndef(build.buildCommand);
        if (bc !== undefined)
            out.buildCommand = bc;
        const wp = stringArrayOrUndef(build.watchPatterns);
        if (wp)
            out.watchPatterns = wp;
    }
    if (deploy) {
        const sc = stringOrUndef(deploy.startCommand);
        if (sc !== undefined)
            out.startCommand = sc;
        const nr = numberOrUndef(deploy.numReplicas);
        if (nr !== undefined)
            out.numReplicas = nr;
        const hp = stringOrUndef(deploy.healthcheckPath);
        if (hp !== undefined)
            out.healthcheckPath = hp;
        const rp = stringOrUndef(deploy.restartPolicyType);
        if (rp !== undefined)
            out.restartPolicyType = rp;
    }
    // Also allow top-level aliases sometimes pasted flat
    return out;
}
export function extractDeployHint(raw) {
    if (!raw)
        return {};
    let hint = pickDeployHintFromMaps(asMap(raw.build), asMap(raw.deploy));
    // Flat top-level fallbacks
    if (hint.buildCommand === undefined) {
        const bc = stringOrUndef(raw.buildCommand);
        if (bc !== undefined)
            hint.buildCommand = bc;
    }
    if (hint.startCommand === undefined) {
        const sc = stringOrUndef(raw.startCommand);
        if (sc !== undefined)
            hint.startCommand = sc;
    }
    if (hint.watchPatterns === undefined) {
        const wp = stringArrayOrUndef(raw.watchPatterns);
        if (wp)
            hint.watchPatterns = wp;
    }
    if (hint.numReplicas === undefined) {
        const nr = numberOrUndef(raw.numReplicas);
        if (nr !== undefined)
            hint.numReplicas = nr;
    }
    if (hint.healthcheckPath === undefined) {
        const hp = stringOrUndef(raw.healthcheckPath);
        if (hp !== undefined)
            hint.healthcheckPath = hp;
    }
    if (hint.restartPolicyType === undefined) {
        const rp = stringOrUndef(raw.restartPolicyType);
        if (rp !== undefined)
            hint.restartPolicyType = rp;
    }
    // First service fallback if still empty
    if (Object.keys(hint).length === 0) {
        const { services } = extractServices(raw);
        for (const s of services) {
            const h2 = pickDeployHintFromMaps(s.build ? asMap(s.build) : null, s.deploy ? asMap(s.deploy) : null);
            if (Object.keys(h2).length) {
                hint = h2;
                break;
            }
        }
    }
    return hint;
}
function builderOf(raw) {
    if (!raw)
        return undefined;
    const build = asMap(raw.build);
    if (build) {
        const b = stringOrUndef(build.builder);
        if (b)
            return b;
        if (stringOrUndef(build.dockerfilePath))
            return "DOCKERFILE";
    }
    return stringOrUndef(raw.builder);
}
export function lintRailwayConfig(raw, parseError, format) {
    const findings = [];
    if (parseError) {
        findings.push({
            severity: "error",
            rule: "invalid_config",
            advice: `Could not parse railway config: ${parseError}`,
        });
        return findings;
    }
    if (!raw || format === "empty") {
        findings.push({
            severity: "info",
            rule: "empty_config",
            advice: "No railway.json / railway.toml content provided (empty input).",
        });
        return findings;
    }
    if (Object.keys(raw).length === 0) {
        findings.push({
            severity: "info",
            rule: "empty_config",
            advice: "Parsed railway config object is empty — no fields detected.",
        });
        return findings;
    }
    const hint = extractDeployHint(raw);
    const env = extractEnvKeys(raw);
    const builder = builderOf(raw);
    const build = asMap(raw.build);
    const deploy = asMap(raw.deploy);
    if (!hint.startCommand && !deploy) {
        findings.push({
            severity: "warn",
            rule: "missing_start_command",
            advice: 'No startCommand detected under deploy{} / [deploy]. Railway may fall back to Nixpacks/Procfile detection — set deploy.startCommand explicitly for predictable deploys.',
        });
    }
    else if (!hint.startCommand && deploy) {
        findings.push({
            severity: "warn",
            rule: "missing_start_command",
            advice: "deploy section is present but startCommand is missing — confirm Railway can detect a start process (Nixpacks/Procfile/Dockerfile CMD).",
        });
    }
    if (!hint.buildCommand && !builder && !build) {
        findings.push({
            severity: "info",
            rule: "missing_build_command",
            advice: "No buildCommand / builder detected — fine for pure Nixpacks auto-detect; set build.buildCommand when the build step is non-default.",
        });
    }
    if (env.redacted && env.redacted.length) {
        findings.push({
            severity: "warn",
            rule: "hardcoded_secrets_in_env",
            advice: `Env/variable key(s) look secret-like or have secret-shaped values: ${env.redacted.join(", ")}. Prefer Railway Variables / secrets UI — do not commit plaintext credentials. Values are not echoed.`,
        });
    }
    const dockerfilePath = build
        ? stringOrUndef(build.dockerfilePath)
        : stringOrUndef(raw.dockerfilePath);
    const builderUpper = (builder ?? "").toUpperCase();
    if (builderUpper === "DOCKERFILE" ||
        (dockerfilePath !== undefined && dockerfilePath.length > 0)) {
        findings.push({
            severity: "info",
            rule: "dockerfile_builder_tip",
            advice: `Dockerfile builder in use${dockerfilePath ? ` (dockerfilePath=${dockerfilePath})` : ""}. Ensure the image sets a CMD/ENTRYPOINT or pair with deploy.startCommand; watchPatterns apply mainly to Nixpacks/watch flows.`,
        });
    }
    else if (builderUpper === "NIXPACKS" || (!builder && (build || hint.buildCommand))) {
        findings.push({
            severity: "info",
            rule: "nixpacks_builder_tip",
            advice: 'Nixpacks-style build detected (or default). Prefer builder = "NIXPACKS" with optional buildCommand; switch to DOCKERFILE + dockerfilePath when you need a custom image.',
        });
    }
    else if (!builder && !build && !deploy && env.count === 0) {
        findings.push({
            severity: "info",
            rule: "minimal_config",
            advice: "Minimal railway config — no build/deploy/env detected. Railway may rely entirely on dashboard settings / auto-detect.",
        });
    }
    if (hint.numReplicas !== undefined && hint.numReplicas < 1) {
        findings.push({
            severity: "warn",
            rule: "num_replicas_low",
            advice: `numReplicas is ${hint.numReplicas} — typically >= 1 for a running service.`,
        });
    }
    if (hint.healthcheckPath &&
        !hint.healthcheckPath.startsWith("/")) {
        findings.push({
            severity: "info",
            rule: "healthcheck_path_tip",
            advice: `healthcheckPath "${hint.healthcheckPath}" does not start with / — Railway healthchecks usually use absolute paths like "/health".`,
        });
    }
    if (format === "toml" || format === "jsonc") {
        findings.push({
            severity: "info",
            rule: "format_detected",
            advice: `Parsed as ${format === "toml" ? "railway.toml (TOML lite)" : "railway.json / JSONC"}. Heuristics only — not the Railway CLI or schema validator.`,
        });
    }
    return findings;
}
