/**
 * Shared DigitalOcean App Spec (.do/app.yaml) text helpers.
 * String/YAML analysis only — no DigitalOcean API, no network.
 */
import { parse as parseYaml } from "yaml";
function asMap(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value;
    }
    return null;
}
function asObjectList(value) {
    if (value === undefined || value === null)
        return [];
    if (Array.isArray(value)) {
        return value.filter((v) => v !== null && typeof v === "object" && !Array.isArray(v));
    }
    if (asMap(value))
        return [value];
    return [];
}
function stringOrUndef(v) {
    if (v === undefined || v === null)
        return undefined;
    const s = String(v).trim();
    return s === "" ? undefined : s;
}
function numberOrUndef(v) {
    if (typeof v === "number" && Number.isFinite(v))
        return v;
    if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) {
        return Number(v);
    }
    return undefined;
}
export function parseAppSpecText(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed) {
        return { raw: null };
    }
    let raw;
    try {
        raw = parseYaml(trimmed);
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { raw: null, parseError: msg };
    }
    if (raw === null || raw === undefined) {
        return { raw: null };
    }
    if (typeof raw !== "object" || Array.isArray(raw)) {
        return {
            raw: null,
            parseError: "Root document must be a YAML mapping",
        };
    }
    const map = raw;
    return {
        raw: map,
        name: stringOrUndef(map.name),
        region: stringOrUndef(map.region),
    };
}
function summarizeService(item) {
    const out = {};
    const name = stringOrUndef(item.name);
    if (name)
        out.name = name;
    const httpPort = numberOrUndef(item.http_port ?? item.httpPort);
    if (httpPort !== undefined)
        out.http_port = httpPort;
    const instanceCount = numberOrUndef(item.instance_count ?? item.instanceCount);
    if (instanceCount !== undefined)
        out.instance_count = instanceCount;
    const size = stringOrUndef(item.instance_size_slug ?? item.instanceSizeSlug);
    if (size)
        out.instance_size_slug = size;
    return out;
}
function summarizeNamed(item) {
    const name = stringOrUndef(item.name);
    return name ? { name } : {};
}
export function listServices(doc) {
    const raw = doc.raw;
    if (!raw) {
        return { services: [], count: 0 };
    }
    const services = asObjectList(raw.services).map(summarizeService);
    const workers = asObjectList(raw.workers).map(summarizeNamed);
    const jobs = asObjectList(raw.jobs).map(summarizeNamed);
    const staticSites = asObjectList(raw.static_sites ?? raw.staticSites).map(summarizeNamed);
    const count = services.length + workers.length + jobs.length + staticSites.length;
    const out = { services, count };
    if (workers.length)
        out.workers = workers;
    if (jobs.length)
        out.jobs = jobs;
    if (staticSites.length)
        out.static_sites = staticSites;
    return out;
}
const SECRET_KEY_RE = /(secret|password|passwd|pwd|token|api[_-]?key|private[_-]?key|access[_-]?key|auth[_-]?key|credential|client[_-]?secret|signing[_-]?key|database[_-]?url|connection[_-]?string)/i;
function looksLikeSecretValue(v) {
    if (typeof v !== "string")
        return false;
    const t = v.trim();
    if (!t)
        return false;
    // DO binding / secret refs — not plaintext
    if (/^\$\{/.test(t))
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
function collectEnvsFromComponent(item, keys, scopes, redacted) {
    const envs = asObjectList(item.envs ?? item.env_vars ?? item.envVars);
    for (const row of envs) {
        const key = stringOrUndef(row.key ?? row.KEY ?? row.name);
        if (!key)
            continue;
        keys.add(key);
        const scope = stringOrUndef(row.scope);
        if (scope)
            scopes.add(scope);
        const type = stringOrUndef(row.type)?.toUpperCase();
        const hasValue = Object.prototype.hasOwnProperty.call(row, "value");
        const value = hasValue ? row.value : undefined;
        if (type === "SECRET" ||
            SECRET_KEY_RE.test(key) ||
            looksLikeSecretValue(value)) {
            redacted.add(key);
        }
    }
    // Also accept map-form environment: { KEY: value }
    const envMap = asMap(item.environment ?? item.env);
    if (envMap) {
        for (const [k, v] of Object.entries(envMap)) {
            if (!k.trim())
                continue;
            keys.add(k);
            if (SECRET_KEY_RE.test(k) || looksLikeSecretValue(v)) {
                redacted.add(k);
            }
        }
    }
}
function walkAllComponents(raw, keys, scopes, redacted) {
    // Top-level envs (rare but possible)
    collectEnvsFromComponent(raw, keys, scopes, redacted);
    for (const listKey of [
        "services",
        "workers",
        "jobs",
        "static_sites",
        "staticSites",
        "functions",
    ]) {
        for (const item of asObjectList(raw[listKey])) {
            collectEnvsFromComponent(item, keys, scopes, redacted);
        }
    }
}
export function extractEnvKeys(doc) {
    const keys = new Set();
    const scopes = new Set();
    const redacted = new Set();
    if (doc.raw)
        walkAllComponents(doc.raw, keys, scopes, redacted);
    const keyList = Array.from(keys).sort((a, b) => a.localeCompare(b));
    const scopeList = Array.from(scopes).sort((a, b) => a.localeCompare(b));
    const redList = Array.from(redacted).sort((a, b) => a.localeCompare(b));
    const out = {
        keys: keyList,
        count: keyList.length,
    };
    if (scopeList.length)
        out.scopes = scopeList;
    if (redList.length)
        out.redacted = redList;
    return out;
}
export function extractRoutesHint(doc) {
    const raw = doc.raw;
    if (!raw) {
        return { routes: [] };
    }
    const routes = [];
    // Per-service routes (classic App Spec)
    for (const svc of asObjectList(raw.services)) {
        for (const r of asObjectList(svc.routes)) {
            const hint = {};
            const path = stringOrUndef(r.path);
            if (path)
                hint.path = path;
            if (typeof r.preserve_path_prefix === "boolean") {
                hint.preserve_path_prefix = r.preserve_path_prefix;
            }
            else if (typeof r.preservePathPrefix === "boolean") {
                hint.preserve_path_prefix = r.preservePathPrefix;
            }
            if (hint.path !== undefined || hint.preserve_path_prefix !== undefined) {
                routes.push(hint);
            }
        }
    }
    // Ingress rules may also carry path prefixes
    const ingress = raw.ingress;
    const ingressMap = asMap(ingress);
    if (ingressMap && Array.isArray(ingressMap.rules)) {
        for (const rule of ingressMap.rules) {
            const rm = asMap(rule);
            if (!rm)
                continue;
            const match = asMap(rm.match);
            const pathNode = match ? asMap(match.path) : null;
            const prefix = pathNode
                ? stringOrUndef(pathNode.prefix ?? pathNode.path)
                : undefined;
            if (prefix) {
                // Avoid duplicating if already listed
                if (!routes.some((x) => x.path === prefix)) {
                    routes.push({ path: prefix });
                }
            }
        }
    }
    const domains = [];
    for (const d of asObjectList(raw.domains)) {
        const domain = stringOrUndef(d.domain ?? d.name);
        if (domain)
            domains.push(domain);
    }
    const alerts = raw.alerts ?? raw.alert_rules ?? raw.alertRules;
    const hasAlerts = (Array.isArray(alerts) && alerts.length > 0) ||
        (asMap(alerts) !== null && Object.keys(asMap(alerts)).length > 0);
    const out = { routes };
    if (ingress !== undefined)
        out.ingress = ingress;
    if (domains.length)
        out.domains = domains;
    if (hasAlerts)
        out.alertrules_hint = true;
    return out;
}
function componentLabel(kind, item, index) {
    const name = stringOrUndef(item.name);
    return name ? `${kind} "${name}"` : `${kind}[${index}]`;
}
export function lintAppSpec(doc) {
    const findings = [];
    if (doc.parseError) {
        findings.push({
            severity: "error",
            rule: "yaml_parse_error",
            advice: `YAML parse failed: ${doc.parseError}`,
        });
        return findings;
    }
    if (!doc.raw) {
        findings.push({
            severity: "error",
            rule: "empty_spec",
            advice: "Empty App Spec — paste a .do/app.yaml document with name, region, and at least one component (services/workers/jobs/static_sites).",
        });
        return findings;
    }
    const raw = doc.raw;
    if (!doc.name) {
        findings.push({
            severity: "error",
            rule: "missing_name",
            advice: "Top-level `name` is missing — DigitalOcean App Spec requires an app name.",
        });
    }
    if (!doc.region) {
        findings.push({
            severity: "warn",
            rule: "missing_region",
            advice: "Top-level `region` is missing — set a region slug (e.g. nyc, sfo, fra) for predictable placement.",
        });
    }
    const services = asObjectList(raw.services);
    const workers = asObjectList(raw.workers);
    const jobs = asObjectList(raw.jobs);
    const staticSites = asObjectList(raw.static_sites ?? raw.staticSites);
    const total = services.length + workers.length + jobs.length + staticSites.length;
    if (total === 0) {
        findings.push({
            severity: "error",
            rule: "no_components",
            advice: "No services/workers/jobs/static_sites found — App Spec needs at least one component.",
        });
    }
    for (let i = 0; i < services.length; i++) {
        const svc = services[i];
        const label = componentLabel("service", svc, i);
        if (!stringOrUndef(svc.name)) {
            findings.push({
                severity: "warn",
                rule: "service_missing_name",
                advice: `${label}: missing name — name each service for stable routing and env binding.`,
            });
        }
        const httpPort = numberOrUndef(svc.http_port ?? svc.httpPort);
        const health = asMap(svc.health_check) ??
            asMap(svc.healthCheck) ??
            asMap(svc.healthcheck);
        if (httpPort !== undefined && !health) {
            findings.push({
                severity: "info",
                rule: "health_check_tip",
                advice: `${label}: has http_port=${httpPort} but no health_check — consider health_check.http_path for rolling deploys.`,
            });
        }
        else if (health && !stringOrUndef(health.http_path ?? health.httpPath)) {
            findings.push({
                severity: "info",
                rule: "health_check_path_tip",
                advice: `${label}: health_check present but http_path missing — set health_check.http_path (e.g. /health).`,
            });
        }
        if (httpPort === undefined &&
            !stringOrUndef(svc.image) &&
            !asMap(svc.github) &&
            !asMap(svc.gitlab) &&
            !asMap(svc.bitbucket) &&
            !stringOrUndef(svc.dockerfile_path ?? svc.dockerfilePath)) {
            findings.push({
                severity: "info",
                rule: "service_source_tip",
                advice: `${label}: no github/gitlab/image/dockerfile_path detected — ensure a build source is configured.`,
            });
        }
    }
    // Plaintext secrets in envs (type not SECRET but secret-looking value)
    const checkPlaintext = (kind, list) => {
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const label = componentLabel(kind, item, i);
            const envs = asObjectList(item.envs ?? item.env_vars ?? item.envVars);
            for (const row of envs) {
                const key = stringOrUndef(row.key ?? row.KEY ?? row.name) ?? "(unnamed)";
                const type = stringOrUndef(row.type)?.toUpperCase();
                const hasValue = Object.prototype.hasOwnProperty.call(row, "value");
                const value = hasValue ? row.value : undefined;
                if (hasValue &&
                    type !== "SECRET" &&
                    looksLikeSecretValue(value)) {
                    findings.push({
                        severity: "warn",
                        rule: "plaintext_secret_in_envs",
                        advice: `${label}: env key "${key}" looks like a plaintext secret — set type: SECRET or use a binding/\${...} reference; never commit live secrets.`,
                    });
                }
                else if (hasValue &&
                    type !== "SECRET" &&
                    SECRET_KEY_RE.test(key) &&
                    typeof value === "string" &&
                    value.trim() &&
                    !/^\$\{/.test(value.trim())) {
                    findings.push({
                        severity: "warn",
                        rule: "plaintext_secret_in_envs",
                        advice: `${label}: env key "${key}" is secret-named with a plaintext value — prefer type: SECRET or a secret/store binding.`,
                    });
                }
            }
        }
    };
    checkPlaintext("service", services);
    checkPlaintext("worker", workers);
    checkPlaintext("job", jobs);
    checkPlaintext("static_site", staticSites);
    // Domains without ingress tip
    const domains = asObjectList(raw.domains);
    if (domains.length && raw.ingress === undefined && services.length > 1) {
        findings.push({
            severity: "info",
            rule: "ingress_domains_tip",
            advice: "domains[] present with multiple services and no ingress — consider ingress.rules for path-based routing.",
        });
    }
    return findings;
}
