/**
 * Shared Pulumi.yaml / program text helpers.
 * Pure YAML/string/regex heuristics — no Pulumi CLI, cloud, network, filesystem follow, or eval.
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
function runtimeName(raw) {
    if (typeof raw === "string") {
        const s = raw.trim();
        return s || undefined;
    }
    const map = asMap(raw);
    if (!map)
        return undefined;
    return strField(map, "name") ?? strField(map, "runtime");
}
function backendUrl(raw) {
    if (typeof raw === "string") {
        const s = raw.trim();
        return s || undefined;
    }
    const map = asMap(raw);
    if (!map)
        return undefined;
    return strField(map, "url") ?? strField(map, "path");
}
function looksLikePulumiProject(map) {
    if (map.name !== undefined || map.runtime !== undefined || map.main !== undefined) {
        return true;
    }
    if (map.backend !== undefined || map.description !== undefined)
        return true;
    if (map.config !== undefined && (map.name !== undefined || map.runtime !== undefined)) {
        return true;
    }
    // Stack config files often have only config: / secretsprovider / encryptedkey
    if (map.config !== undefined || map.secretsprovider !== undefined)
        return true;
    return false;
}
/** Extract project/stack hints from Pulumi.yaml-ish YAML or loose text. */
export function extractStacks(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed)
        return [];
    const stacks = [];
    const docs = parseYamlDocs(trimmed);
    for (const doc of docs) {
        const map = asMap(doc);
        if (!map || !looksLikePulumiProject(map))
            continue;
        const info = {};
        const name = strField(map, "name");
        const runtime = runtimeName(map.runtime);
        const description = strField(map, "description");
        const main = strField(map, "main");
        const backend = backendUrl(map.backend);
        if (name)
            info.name = name;
        if (runtime)
            info.runtime = runtime;
        if (description)
            info.description = description;
        if (main)
            info.main = main;
        if (backend)
            info.backend = backend;
        // Stack config named via template comment / filename hint in text is out of scope;
        // still emit if we got any field.
        if (Object.keys(info).length > 0)
            stacks.push(info);
    }
    // Regex fallback when YAML parse fails or text is partial
    if (stacks.length === 0) {
        const info = {};
        const nameM = trimmed.match(/^\s*name:\s*["']?([^\s"'#]+)/im);
        const runtimeM = trimmed.match(/^\s*runtime:\s*["']?([A-Za-z0-9_-]+)\s*$/im) ||
            trimmed.match(/^\s*runtime:\s*\n\s+name:\s*["']?([A-Za-z0-9_-]+)/im);
        const descM = trimmed.match(/^\s*description:\s*["']?(.+?)["']?\s*$/im);
        const mainM = trimmed.match(/^\s*main:\s*["']?([^\s"'#]+)/im);
        const backendM = trimmed.match(/^\s*backend:\s*\n\s+url:\s*["']?([^\s"'#]+)/im) ||
            trimmed.match(/\burl:\s*["']?(s3:\/\/[^\s"'#]+|gs:\/\/[^\s"'#]+|azblob:\/\/[^\s"'#]+|file:\/\/[^\s"'#]+|https?:\/\/[^\s"'#]+)/im);
        if (nameM)
            info.name = nameM[1];
        if (runtimeM)
            info.runtime = runtimeM[1];
        if (descM)
            info.description = descM[1].replace(/^["']|["']$/g, "").trim();
        if (mainM)
            info.main = mainM[1];
        if (backendM)
            info.backend = backendM[1];
        if (Object.keys(info).length > 0)
            stacks.push(info);
    }
    return stacks;
}
/** Heuristic resource constructors from TS/Py/Go/YAML-ish program text. */
export function extractResources(text) {
    const src = text ?? "";
    if (!src.trim())
        return [];
    const resources = [];
    const seen = new Set();
    const push = (type, name) => {
        const key = `${type ?? ""}|${name ?? ""}`;
        if (seen.has(key))
            return;
        seen.add(key);
        const info = {};
        if (type)
            info.type = type;
        if (name)
            info.name = name;
        if (info.type || info.name)
            resources.push(info);
    };
    // TS/JS: new aws.s3.Bucket("name", ...) / new azure.* / new gcp.* / new kubernetes.*
    // Also kubernetes.core.v1.Namespace, awsx.*, etc.
    const newCtorRe = /\bnew\s+((?:aws|awsx|azure|azuread|azure_native|gcp|google|azuread|kubernetes|k8s|docker|cloudflare|digitalocean|random|tls|command|pulumi)(?:\.[A-Za-z_][\w]*)+)\s*\(\s*(['"`])(.*?)\2/g;
    let m;
    while ((m = newCtorRe.exec(src)) !== null) {
        push(m[1], m[3]);
    }
    // Broader new Provider.Resource("name") for other SDKs (e.g. new datadog.Monitor)
    const broadNewRe = /\bnew\s+([A-Za-z_][\w]*(?:\.[A-Za-z_][\w]*){1,4})\s*\(\s*(['"`])(.*?)\2/g;
    while ((m = broadNewRe.exec(src)) !== null) {
        const type = m[1];
        // Skip non-resource looking constructors
        if (/^(Error|Map|Set|Array|Promise|Date|RegExp|Object|Function|Buffer)$/.test(type.split(".")[0])) {
            continue;
        }
        // Prefer provider-ish (has a dotted path and capital Resource class)
        if (!/\.[A-Z]/.test(type))
            continue;
        push(type, m[3]);
    }
    // pulumi.CustomResource("type", "name", ...)
    const customRe = /\b(?:pulumi\.)?CustomResource\s*\(\s*(['"`])(.*?)\1\s*,\s*(['"`])(.*?)\3/g;
    while ((m = customRe.exec(src)) !== null) {
        push(m[2], m[4]);
    }
    // new ... extends / ComponentResource registrations: new MyComponent("name"
    // Also: super("pkg:index:Type", name, ...) inside ComponentResource
    const componentSuperRe = /\bsuper\s*\(\s*(['"`])([A-Za-z0-9_.:/-]+)\1\s*,\s*(['"`])(.*?)\3/g;
    while ((m = componentSuperRe.exec(src)) !== null) {
        push(m[2], m[4]);
    }
    // class Foo extends pulumi.ComponentResource
    const componentClassRe = /\bclass\s+([A-Za-z_][\w]*)\s+extends\s+(?:pulumi\.)?ComponentResource\b/g;
    while ((m = componentClassRe.exec(src)) !== null) {
        push(`component:${m[1]}`, m[1]);
    }
    // Python: aws.s3.Bucket("name", ...) — assignment or bare call
    const pyRe = /\b((?:aws|awsx|azure|azure_native|gcp|google_native|kubernetes|docker|random|tls|pulumi)(?:\.[A-Za-z_][\w]*)+)\s*\(\s*(['"])(.*?)\2/g;
    while ((m = pyRe.exec(src)) !== null) {
        push(m[1], m[3]);
    }
    // Go-ish: s3.NewBucket(ctx, "name", ...) / ec2.NewInstance(
    const goRe = /\b(?:([A-Za-z_][\w]*)\.)?New([A-Z][A-Za-z0-9_]*)\s*\(\s*[^,]+,\s*(['"])(.*?)\3/g;
    while ((m = goRe.exec(src)) !== null) {
        const pkg = m[1];
        const kind = m[2];
        const type = pkg ? `${pkg}.New${kind}` : `New${kind}`;
        push(type, m[4]);
    }
    // YAML Pulumi program: type: aws:s3:Bucket / type: kubernetes:core/v1:Namespace
    const yamlTypeRe = /^\s*(?:-\s*)?(?:type|Type):\s*['"]?([A-Za-z0-9_.:/-]+)['"]?\s*$/gm;
    while ((m = yamlTypeRe.exec(src)) !== null) {
        const type = m[1];
        // Skip generic k8s apiVersion-looking if not pulumi-ish (has : or /)
        if (!type.includes(":") && !type.includes("/"))
            continue;
        // Look ahead for name: nearby
        const window = src.slice(m.index, m.index + 200);
        const nameM = window.match(/\bname:\s*['"]([^'"]+)['"]/) ||
            window.match(/\bname:\s*([^\s#]+)/);
        push(type, nameM ? nameM[1] : undefined);
    }
    // resources: map style YAML (Pulumi YAML):
    // resources:
    //   bucket:
    //     type: aws:s3:Bucket
    const yamlResBlock = src.match(/\bresources\s*:\s*\n([\s\S]{0,8000})/);
    if (yamlResBlock) {
        const block = yamlResBlock[1];
        const entryRe = /^[ \t]{2,}([A-Za-z_][\w-]*)\s*:\s*\n(?:[ \t]+.*\n)*?[ \t]+type:\s*['"]?([A-Za-z0-9_.:/-]+)/gm;
        let em;
        while ((em = entryRe.exec(block)) !== null) {
            push(em[2], em[1]);
        }
    }
    return resources;
}
function uniq(arr) {
    const out = [];
    const seen = new Set();
    for (const s of arr) {
        const t = s.trim();
        if (!t || seen.has(t))
            continue;
        seen.add(t);
        out.push(t);
    }
    return out;
}
/** Extract config key names and secret key names (names only). */
export function extractConfig(text) {
    const src = text ?? "";
    if (!src.trim())
        return { configKeys: [], secretKeys: [] };
    const configKeys = [];
    const secretKeys = [];
    // YAML config: block under Pulumi.yaml or Pulumi.<stack>.yaml
    const docs = parseYamlDocs(src);
    for (const doc of docs) {
        const map = asMap(doc);
        if (!map)
            continue;
        const cfg = asMap(map.config);
        if (cfg) {
            for (const key of Object.keys(cfg)) {
                // Skip nested marker keys accidentally promoted
                if (/^(secure|secret)$/i.test(key))
                    continue;
                configKeys.push(key);
                const val = cfg[key];
                const vm = asMap(val);
                if (vm && (vm.secure !== undefined || vm.secret !== undefined)) {
                    secretKeys.push(key);
                }
                // Pulumi stack config often stores secrets as nested secure: "..."
                if (vm && Object.keys(vm).some((k) => /^secure$/i.test(k))) {
                    if (!secretKeys.includes(key))
                        secretKeys.push(key);
                }
            }
        }
    }
    // Regex for config: keys when YAML nested weirdly
    const cfgBlock = src.match(/(?:^|\n)config\s*:\s*\n((?:[ \t]+.+\n?)*)/i);
    if (cfgBlock) {
        const lines = cfgBlock[1].split("\n");
        for (const line of lines) {
            const km = line.match(/^[ \t]{2,}([A-Za-z0-9_.:/-]+)\s*:/);
            if (km && !/^(secure|secret)$/i.test(km[1])) {
                configKeys.push(km[1]);
                if (/secure\s*:/i.test(line)) {
                    secretKeys.push(km[1]);
                }
            }
            // nested secure under previous key — handled loosely:
            const secureOnly = line.match(/^[ \t]+secure\s*:/i);
            if (secureOnly) {
                // attach to last config key
                const last = configKeys[configKeys.length - 1];
                if (last)
                    secretKeys.push(last);
            }
        }
    }
    // TS/JS: new pulumi.Config("ns") — namespace is a config prefix, not a key
    // config.require("key") / config.get("key") / config.requireSecret("key") / config.getSecret("key")
    const cfgCallRe = /\b(?:config|cfg)\.(require(?:Secret)?|get(?:Secret)?|requireObject|getObject|requireNumber|getNumber|requireBoolean|getBoolean)\s*\(\s*(['"`])(.*?)\2/g;
    let m;
    while ((m = cfgCallRe.exec(src)) !== null) {
        const method = m[1];
        const key = m[3];
        configKeys.push(key);
        if (/secret/i.test(method))
            secretKeys.push(key);
    }
    // pulumi.Config("project") then .require — already covered by config.require
    // Python: config.require("key") / pulumi.Config().require_secret("key")
    const pyCfgRe = /\b(?:config|cfg)\.(require(?:_secret)?|get(?:_secret)?)\s*\(\s*(['"])(.*?)\2/g;
    while ((m = pyCfgRe.exec(src)) !== null) {
        configKeys.push(m[3]);
        if (/secret/i.test(m[1]))
            secretKeys.push(m[3]);
    }
    // Go: cfg.Require("key") / cfg.RequireSecret("key")
    const goCfgRe = /\b(?:config|cfg)\.(Require(?:Secret)?|Get(?:Secret)?)\s*\(\s*(['"])(.*?)\2/g;
    while ((m = goCfgRe.exec(src)) !== null) {
        configKeys.push(m[3]);
        if (/Secret/i.test(m[1]))
            secretKeys.push(m[3]);
    }
    // Explicit secret markers: secret: key or secrets: [key]
    const secretListRe = /\bsecrets?\s*:\s*\[([^\]]*)\]/gi;
    while ((m = secretListRe.exec(src)) !== null) {
        const parts = m[1].match(/['"`]?([A-Za-z0-9_.:/-]+)['"`]?/g) ?? [];
        for (const p of parts) {
            const k = p.replace(/['"`]/g, "");
            if (k) {
                configKeys.push(k);
                secretKeys.push(k);
            }
        }
    }
    return {
        configKeys: uniq(configKeys),
        secretKeys: uniq(secretKeys),
    };
}
function hasLatestImageTag(text) {
    // image: "repo:latest" or image: '...' or docker image refs with :latest
    if (/:latest\b/i.test(text))
        return true;
    if (/\bimage\s*[:=]\s*['"`][^'"`\s]+['"`]/i.test(text) && /:latest\b/i.test(text)) {
        return true;
    }
    return /['"`][A-Za-z0-9._/-]+:latest['"`]/i.test(text);
}
export function lintPulumi(text) {
    const findings = [];
    const trimmed = (text ?? "").trim();
    if (!trimmed) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Provide non-empty Pulumi.yaml or program text. This tool only analyzes the string you pass — it never reads the filesystem.",
        });
        return findings;
    }
    const stacks = extractStacks(trimmed);
    const looksProject = /^\s*name\s*:/im.test(trimmed) ||
        /^\s*runtime\s*:/im.test(trimmed) ||
        /\bbackend\s*:/im.test(trimmed) ||
        stacks.length > 0;
    if (looksProject) {
        const hasName = stacks.some((s) => s.name) || /^\s*name\s*:/im.test(trimmed);
        const hasRuntime = stacks.some((s) => s.runtime) || /^\s*runtime\s*:/im.test(trimmed);
        if (!hasName) {
            findings.push({
                severity: "warn",
                rule: "missing_name",
                advice: "No project `name` found. Pulumi.yaml should declare `name:` for the project.",
            });
        }
        if (!hasRuntime) {
            findings.push({
                severity: "warn",
                rule: "missing_runtime",
                advice: "No `runtime` found. Pulumi.yaml should declare a runtime (nodejs, python, go, dotnet, yaml, java, …).",
            });
        }
        const hasBackend = stacks.some((s) => s.backend) ||
            /\bbackend\s*:/im.test(trimmed) ||
            /\burl\s*:\s*['"]?(s3|gs|azblob|file|https?):/im.test(trimmed);
        if (!hasBackend) {
            findings.push({
                severity: "info",
                rule: "missing_backend_tip",
                advice: "No `backend.url` hint found. For teams, declare an explicit backend (S3/GCS/Azure/HTTP/local) so stack state location is intentional. This tool never contacts a backend.",
            });
        }
    }
    // Plaintext secret in config (educational)
    // config values that look like plaintext passwords/secrets (not secure: wrappers)
    const plaintextConfig = /(?:^|\n)[ \t]+(?:[A-Za-z0-9_.:/-]*(?:password|secret|api[_-]?key|token|access[_-]?key)[A-Za-z0-9_.:/-]*)\s*:\s*['"]?[^'"\n#]+['"]?\s*$/im.test(trimmed) &&
        !/\bsecure\s*:/im.test(trimmed);
    // Also: password: "value" style in YAML/program
    const plaintextAssign = /\b(?:password|secret|api[_-]?key|access[_-]?key|client[_-]?secret)\b\s*[:=]\s*['"][^'"]+['"]/i.test(trimmed);
    // Detect plaintext under config where value is not nested secure
    let plaintextInConfigBlock = false;
    const cfgBlock = trimmed.match(/(?:^|\n)config\s*:\s*\n((?:[ \t]+.+\n?)*)/i);
    if (cfgBlock) {
        const block = cfgBlock[1];
        if (/:\s*['"]?[^\s'"#]+['"]?\s*$/m.test(block) &&
            !/\bsecure\s*:/i.test(block) &&
            /(?:password|secret|token|api[_-]?key|key)/i.test(block)) {
            // If there are scalar string values (not only nested maps with secure)
            const scalarSecret = block.match(/^[ \t]+([A-Za-z0-9_.:/-]*(?:password|secret|token|api[_-]?key|key)[A-Za-z0-9_.:/-]*)\s*:\s*['"]?([^'"\n#]+)['"]?\s*$/im);
            if (scalarSecret && !/^\s*$/.test(scalarSecret[2]) && !/^\{/.test(scalarSecret[2])) {
                plaintextInConfigBlock = true;
            }
        }
    }
    if (plaintextConfig || plaintextAssign || plaintextInConfigBlock) {
        findings.push({
            severity: "warn",
            rule: "plaintext_secret_tip",
            advice: "Possible plaintext secret/password in config or program text. Prefer `pulumi config set --secret`, `secure:` stack values, or a secret manager — never commit credentials. Educational only, not an exploit guide.",
        });
    }
    if (hasLatestImageTag(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "latest_tag",
            advice: "Image reference uses `:latest` (or similar). Prefer pinned tags/digests for reproducible Pulumi deploys.",
        });
    }
    // Hardcoded AKIA / api key tip (educational — pattern presence only)
    if (/\bAKIA[0-9A-Z]{16}\b/.test(trimmed) ||
        /\b(?:aws_access_key_id|aws_secret_access_key)\b\s*[:=]/i.test(trimmed) ||
        /\bapi[_-]?key\b\s*[:=]\s*['"][A-Za-z0-9_\-]{16,}['"]/i.test(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "hardcoded_akia_api_key_tip",
            advice: "Possible hardcoded AKIA / API key pattern in text. Rotate if real, use Pulumi secrets or a cloud secret store, and avoid committing credentials. Educational heuristic only — not an exploit guide or secret extractor.",
        });
    }
    const seen = new Set();
    const deduped = [];
    for (const f of findings) {
        const key = `${f.rule}|${f.advice}`;
        if (seen.has(key))
            continue;
        seen.add(key);
        deduped.push(f);
    }
    return deduped;
}
