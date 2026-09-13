/**
 * Shared Helm Chart.yaml / values.yaml / templates text helpers.
 * String/YAML + regex analysis only — no Helm CLI, cluster, network, or eval.
 */
import { parse, parseAllDocuments } from "yaml";
export function asMap(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value;
    }
    return null;
}
export function strField(map, key) {
    if (!map)
        return undefined;
    const v = map[key];
    if (v === undefined || v === null)
        return undefined;
    const s = String(v).trim();
    return s === "" ? undefined : s;
}
/** Best-effort YAML parse; returns null on empty/invalid. */
export function parseYamlObject(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed)
        return null;
    try {
        return parse(trimmed);
    }
    catch {
        return null;
    }
}
export function parseYamlDocs(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed)
        return [];
    try {
        const docs = parseAllDocuments(trimmed);
        const out = [];
        for (const doc of docs) {
            if (doc.errors && doc.errors.length > 0)
                continue;
            const raw = doc.toJSON();
            if (raw === null || raw === undefined)
                continue;
            out.push(raw);
        }
        return out;
    }
    catch {
        return [];
    }
}
export function extractChart(raw) {
    const map = asMap(raw);
    if (!map)
        return null;
    const info = {};
    const name = strField(map, "name");
    const version = strField(map, "version");
    const apiVersion = strField(map, "apiVersion");
    const type = strField(map, "type");
    const appVersion = strField(map, "appVersion");
    const description = strField(map, "description");
    if (name)
        info.name = name;
    if (version)
        info.version = version;
    if (apiVersion)
        info.apiVersion = apiVersion;
    if (type)
        info.type = type;
    if (appVersion)
        info.appVersion = appVersion;
    if (description)
        info.description = description;
    if (map.dependencies !== undefined)
        info.dependencies = map.dependencies;
    // Only count as a chart if it looks chart-like (has name or apiVersion or version)
    if (!name && !apiVersion && !version && description === undefined && map.dependencies === undefined) {
        // still return if any chart-ish keys present
        const keys = Object.keys(map);
        if (keys.length === 0)
            return null;
    }
    return info;
}
const HINT_ROOTS = new Set([
    "image",
    "tag",
    "replicaCount",
    "service",
    "ingress",
    "resources",
]);
const SECRET_KEY_RE = /(password|secret|token|passwd|api[_-]?key|private[_-]?key)/i;
function hintKindForKey(key, value) {
    const kl = key.toLowerCase();
    if (kl === "image" || kl.endsWith(".image") || kl === "repository")
        return "image";
    if (kl === "tag")
        return "tag";
    if (kl === "replicacount")
        return "replicaCount";
    if (kl === "service" || kl.startsWith("service."))
        return "service";
    if (kl === "ingress" || kl.startsWith("ingress."))
        return "ingress";
    if (kl === "resources" || kl.startsWith("resources."))
        return "resources";
    if (typeof value === "object" && value !== null && !Array.isArray(value))
        return "object";
    if (Array.isArray(value))
        return "array";
    if (typeof value === "number")
        return "number";
    if (typeof value === "boolean")
        return "boolean";
    return "scalar";
}
/** Walk values tree; collect top-level keys, nested hints, secret key names. */
export function analyzeValues(raw) {
    const map = asMap(raw);
    if (!map) {
        return { keys: [], hints: [], secretKeyNames: [] };
    }
    const keys = Object.keys(map);
    const hints = [];
    const secretKeyNames = [];
    const seenSecrets = new Set();
    const seenHints = new Set();
    function noteSecret(key) {
        if (SECRET_KEY_RE.test(key) && !seenSecrets.has(key)) {
            seenSecrets.add(key);
            secretKeyNames.push(key);
        }
    }
    function walk(node, path, depth) {
        const m = asMap(node);
        if (!m)
            return;
        for (const [k, v] of Object.entries(m)) {
            const p = path ? `${path}.${k}` : k;
            noteSecret(k);
            const root = p.split(".")[0];
            const isInteresting = HINT_ROOTS.has(k) ||
                HINT_ROOTS.has(root) ||
                k.toLowerCase() === "repository" ||
                k.toLowerCase() === "tag";
            if (isInteresting || depth === 0) {
                // At depth 0 we only add hints for interesting nested roots, not every top-level
                if (depth === 0 && !HINT_ROOTS.has(k) && k.toLowerCase() !== "repository") {
                    // skip non-interesting top-level for hints (keys already listed)
                }
                else {
                    const kind = hintKindForKey(k, v);
                    const sig = `${p}|${kind}`;
                    if (!seenHints.has(sig)) {
                        seenHints.add(sig);
                        hints.push({ path: p, kind });
                    }
                }
            }
            // Also hint image.repository / image.tag style nested under image
            if (depth < 4 && asMap(v)) {
                walk(v, p, depth + 1);
            }
            else if (Array.isArray(v)) {
                for (let i = 0; i < v.length; i++) {
                    if (asMap(v[i]))
                        walk(v[i], `${p}[${i}]`, depth + 1);
                }
            }
        }
    }
    walk(map, "", 0);
    // Ensure interesting top-level roots always appear as hints
    for (const k of keys) {
        if (HINT_ROOTS.has(k)) {
            const kind = hintKindForKey(k, map[k]);
            const sig = `${k}|${kind}`;
            if (!seenHints.has(sig)) {
                seenHints.add(sig);
                hints.push({ path: k, kind });
            }
        }
    }
    return { keys, hints, secretKeyNames };
}
/** Extract kind: lines and Go-template bits from template text (may include {{ }}). */
export function analyzeTemplates(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed) {
        return { kinds: [], valuesRefs: [], helpers: [] };
    }
    const kinds = [];
    const kindSeen = new Set();
    // kind: Deployment  OR  kind: {{ .Values.kind }}
    const kindRe = /^\s*kind:\s*(?:["']?)([A-Za-z][A-Za-z0-9]*)/gm;
    let m;
    while ((m = kindRe.exec(trimmed)) !== null) {
        const k = m[1];
        if (!kindSeen.has(k)) {
            kindSeen.add(k);
            kinds.push(k);
        }
    }
    const valuesRefs = [];
    const valSeen = new Set();
    // .Values.foo.bar or $.Values.foo
    const valRe = /\.?\$?\.Values\.([A-Za-z_][A-Za-z0-9_.]*)/g;
    while ((m = valRe.exec(trimmed)) !== null) {
        const ref = `.Values.${m[1]}`.replace(/\.$/, "");
        if (!valSeen.has(ref)) {
            valSeen.add(ref);
            valuesRefs.push(ref);
        }
    }
    // Also catch {{ .Values.foo }} style where path may end at }}
    const valRe2 = /\{\{\s*-?\s*\.?Values\.([A-Za-z_][A-Za-z0-9_.]*)/g;
    while ((m = valRe2.exec(trimmed)) !== null) {
        const ref = `.Values.${m[1]}`.replace(/\.$/, "");
        if (!valSeen.has(ref)) {
            valSeen.add(ref);
            valuesRefs.push(ref);
        }
    }
    const helpers = [];
    const helpSeen = new Set();
    function addHelper(h) {
        if (!helpSeen.has(h)) {
            helpSeen.add(h);
            helpers.push(h);
        }
    }
    // {{- define "name" -}}
    const defineRe = /\{\{\s*-?\s*define\s+["']([^"']+)["']/g;
    while ((m = defineRe.exec(trimmed)) !== null)
        addHelper(`define:${m[1]}`);
    // {{ include "name" . }}
    const includeRe = /\{\{\s*-?\s*include\s+["']([^"']+)["']/g;
    while ((m = includeRe.exec(trimmed)) !== null)
        addHelper(`include:${m[1]}`);
    // {{ tpl .Values.x . }} or {{ tpl (something) }}
    if (/\{\{\s*-?\s*tpl\b/.test(trimmed)) {
        addHelper("tpl");
    }
    return { kinds, valuesRefs, helpers };
}
function hasLatestInValues(text, raw) {
    // :latest in string values
    if (/:\s*["']?latest["']?/.test(text) || /tag:\s*["']?latest["']?/i.test(text)) {
        return true;
    }
    // walk for image strings ending with :latest or bare latest tag
    function walk(node) {
        if (typeof node === "string") {
            const s = node.trim();
            if (/:latest$/i.test(s) || s === "latest")
                return true;
            return false;
        }
        if (Array.isArray(node))
            return node.some(walk);
        const m = asMap(node);
        if (!m)
            return false;
        return Object.values(m).some(walk);
    }
    return walk(raw);
}
export function lintHelm(parts) {
    const findings = [];
    let chartText = (parts.chartText ?? "").trim();
    let valuesText = (parts.valuesText ?? "").trim();
    let templatesText = (parts.templatesText ?? "").trim();
    const combined = (parts.combined ?? "").trim();
    // If only combined text provided, try to segment heuristically
    if (combined && !chartText && !valuesText && !templatesText) {
        // Heuristic: Chart.yaml-like if has apiVersion: v2 and name:/version:
        if (/apiVersion:\s*v2\b/i.test(combined) &&
            /\bname:\s*\S+/i.test(combined) &&
            /\bversion:\s*\S+/i.test(combined) &&
            !/\bkind:\s*\S+/i.test(combined)) {
            chartText = combined;
        }
        else if (/\bkind:\s*\S+/i.test(combined) ||
            /\{\{/.test(combined) ||
            /\.Values\./.test(combined)) {
            templatesText = combined;
        }
        else {
            valuesText = combined;
        }
    }
    const anyText = chartText || valuesText || templatesText || combined;
    if (!anyText) {
        findings.push({
            severity: "warn",
            rule: "empty_source",
            advice: "No chart/values/templates text provided. Pass Chart.yaml, values.yaml, and/or templates as text (or a single combined `text`).",
        });
        return findings;
    }
    // Chart checks
    if (chartText) {
        const raw = parseYamlObject(chartText);
        const chart = extractChart(raw);
        if (!chart || !chart.name) {
            findings.push({
                severity: "error",
                rule: "missing_chart_name",
                advice: "Chart.yaml is missing `name`. Every Helm chart needs a name field.",
            });
        }
        if (!chart || !chart.version) {
            findings.push({
                severity: "error",
                rule: "missing_chart_version",
                advice: "Chart.yaml is missing `version`. Pin a SemVer chart version.",
            });
        }
        if (!chart || !chart.apiVersion) {
            findings.push({
                severity: "warn",
                rule: "missing_chart_apiVersion",
                advice: "Chart.yaml is missing `apiVersion` (typically `v2` for modern charts).",
            });
        }
    }
    else if (!templatesText && valuesText) {
        // values alone is fine; tip only when clearly chart-shaped input missing
    }
    // Values checks
    if (valuesText) {
        const raw = parseYamlObject(valuesText);
        if (hasLatestInValues(valuesText, raw)) {
            findings.push({
                severity: "warn",
                rule: "latest_tag",
                advice: "values.yaml appears to use image tag `:latest` (or tag: latest). Pin an immutable tag or digest for reproducible deploys.",
            });
        }
        const { secretKeyNames } = analyzeValues(raw);
        if (secretKeyNames.length > 0) {
            findings.push({
                severity: "warn",
                rule: "plaintext_password_key_name",
                advice: `values.yaml has key names that look like secrets (${secretKeyNames.slice(0, 8).join(", ")}). Prefer external secrets / sealed values — this tool only flags key *names*, never invents values.`,
            });
        }
    }
    // Templates checks
    if (templatesText) {
        if (/privileged:\s*true\b/i.test(templatesText) ||
            /privileged:\s*\{\{[^}]*\}\}/i.test(templatesText)) {
            // only flag literal true as stronger smell; still tip on privileged presence
            if (/privileged:\s*true\b/i.test(templatesText)) {
                findings.push({
                    severity: "warn",
                    rule: "privileged",
                    advice: "Templates set `privileged: true`. Prefer dropping privileges unless absolutely required.",
                });
            }
        }
        if (/hostNetwork:\s*true\b/i.test(templatesText)) {
            findings.push({
                severity: "warn",
                rule: "host_network",
                advice: "Templates set `hostNetwork: true` — pods share the host network namespace.",
            });
        }
    }
    else if (chartText && !templatesText) {
        findings.push({
            severity: "info",
            rule: "missing_templates_tip",
            advice: "Only Chart.yaml text was provided. Pass templates YAML/Go-template text for kind/`.Values.`/privileged checks.",
        });
    }
    // If combined was treated as chart but no templates
    if (chartText && valuesText && !templatesText) {
        // mild tip
        if (!findings.some((f) => f.rule === "missing_templates_tip")) {
            findings.push({
                severity: "info",
                rule: "missing_templates_tip",
                advice: "No templates text provided. Pass Deployment/Service templates for privileged/hostNetwork and `.Values.` hints.",
            });
        }
    }
    return findings;
}
