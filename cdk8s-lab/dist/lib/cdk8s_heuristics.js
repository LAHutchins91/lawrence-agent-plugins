/**
 * Shared cdk8s app / chart / program text helpers.
 * Pure YAML/string/regex heuristics — no cdk8s CLI, cluster, network, filesystem follow, or eval.
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
function detectLanguageFromText(src) {
    if (/\bfrom\s+['"]cdk8s['"]/.test(src) || /\bimport\s+cdk8s\b/.test(src)) {
        return "python";
    }
    if (/\bimport\s+org\.cdk8s\b/.test(src) ||
        /\bpackage\s+[\w.]+\s*;/.test(src) && /\bcdk8s\b/i.test(src)) {
        return "java";
    }
    if (/\bfrom\s+['"]cdk8s['"]/.test(src) === false &&
        (/\bimport\s+.*\bfrom\s+['"]cdk8s['"]/.test(src) ||
            /\brequire\s*\(\s*['"]cdk8s['"]\s*\)/.test(src) ||
            /\bimport\s+\*\s+as\s+\w+\s+from\s+['"]cdk8s['"]/.test(src) ||
            /\bnew\s+App\s*\(/.test(src) ||
            /\bextends\s+Chart\b/.test(src))) {
        return "typescript";
    }
    if (/\blanguage\s*:\s*typescript\b/i.test(src))
        return "typescript";
    if (/\blanguage\s*:\s*python\b/i.test(src))
        return "python";
    if (/\blanguage\s*:\s*java\b/i.test(src))
        return "java";
    if (/\blanguage\s*:\s*go\b/i.test(src))
        return "go";
    return undefined;
}
function looksLikeCdk8sYaml(map) {
    if (map.language !== undefined || map.app !== undefined)
        return true;
    if (map.imports !== undefined && (map.language !== undefined || map.app !== undefined || map.name !== undefined)) {
        return true;
    }
    // Chart.yaml-ish used by some cdk8s chart packages
    if ((map.apiVersion !== undefined || map.version !== undefined) &&
        map.name !== undefined &&
        (map.description !== undefined ||
            map.type !== undefined ||
            /\bcdk8s\b/i.test(String(map.description ?? "")) ||
            map.appVersion !== undefined)) {
        return true;
    }
    if (map.name !== undefined && map.language !== undefined)
        return true;
    return false;
}
/** Extract chart/app hints from cdk8s.yaml / Chart.yaml-ish / class Chart text. */
export function extractCharts(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed)
        return [];
    const charts = [];
    const docs = parseYamlDocs(trimmed);
    for (const doc of docs) {
        const map = asMap(doc);
        if (!map || !looksLikeCdk8sYaml(map))
            continue;
        const info = {};
        const name = strField(map, "name");
        const apiVersion = strField(map, "apiVersion");
        const language = strField(map, "language");
        const app = strField(map, "app");
        const description = strField(map, "description");
        const version = strField(map, "version");
        if (name)
            info.name = name;
        if (apiVersion)
            info.apiVersion = apiVersion;
        if (language) {
            info.language = language;
            info.runtime = language;
        }
        if (app)
            info.app = app;
        if (description)
            info.description = description;
        if (version)
            info.version = version;
        if (Object.keys(info).length > 0)
            charts.push(info);
    }
    // class Foo extends Chart / new MyChart(app, "id")
    const classRe = /\b(?:export\s+)?class\s+([A-Za-z_][\w]*)\s+extends\s+Chart\b/g;
    let m;
    while ((m = classRe.exec(trimmed)) !== null) {
        const name = m[1];
        const lang = detectLanguageFromText(trimmed) ?? "typescript";
        if (!charts.some((c) => c.name === name)) {
            charts.push({ name, language: lang, runtime: lang });
        }
    }
    // Python: class MyChart(Chart):
    const pyClassRe = /\bclass\s+([A-Za-z_][\w]*)\s*\(\s*Chart\s*\)\s*:/g;
    while ((m = pyClassRe.exec(trimmed)) !== null) {
        const name = m[1];
        if (!charts.some((c) => c.name === name)) {
            charts.push({ name, language: "python", runtime: "python" });
        }
    }
    // Java: class MyChart extends Chart
    const javaClassRe = /\b(?:public\s+)?class\s+([A-Za-z_][\w]*)\s+extends\s+Chart\b/g;
    while ((m = javaClassRe.exec(trimmed)) !== null) {
        const name = m[1];
        if (!charts.some((c) => c.name === name)) {
            charts.push({ name, language: "java", runtime: "java" });
        }
    }
    // new SomeChart(app, "chart-id")
    const newChartRe = /\bnew\s+([A-Z][A-Za-z0-9_]*(?:Chart)?)\s*\(\s*\w+\s*,\s*(['"`])(.*?)\2/g;
    while ((m = newChartRe.exec(trimmed)) !== null) {
        const className = m[1];
        const id = m[3];
        if (/Error|Map|Set|Array|Promise|Date|RegExp|Object|Deployment|Service|ApiObject|Kube/.test(className)) {
            continue;
        }
        if (!/Chart$/i.test(className) && !charts.some((c) => c.name === className || c.name === id)) {
            // only if we already know it's cdk8s-ish
            if (!/\bcdk8s\b|\bChart\b|\bApp\b/.test(trimmed))
                continue;
        }
        if (/Chart$/i.test(className) || /\bextends\s+Chart\b/.test(trimmed)) {
            const lang = detectLanguageFromText(trimmed) ?? "typescript";
            if (!charts.some((c) => c.name === id || c.name === className)) {
                charts.push({ name: id || className, language: lang, runtime: lang });
            }
        }
    }
    // Regex fallback for cdk8s.yaml fragments
    if (charts.length === 0) {
        const info = {};
        const nameM = trimmed.match(/^\s*name:\s*["']?([^\s"'#]+)/im);
        const langM = trimmed.match(/^\s*language:\s*["']?([A-Za-z0-9_-]+)/im);
        const appM = trimmed.match(/^\s*app:\s*["']?(.+?)["']?\s*$/im);
        const apiM = trimmed.match(/^\s*apiVersion:\s*["']?([^\s"'#]+)/im);
        const verM = trimmed.match(/^\s*version:\s*["']?([^\s"'#]+)/im);
        const descM = trimmed.match(/^\s*description:\s*["']?(.+?)["']?\s*$/im);
        if (nameM)
            info.name = nameM[1];
        if (langM) {
            info.language = langM[1];
            info.runtime = langM[1];
        }
        if (appM)
            info.app = appM[1].replace(/^["']|["']$/g, "").trim();
        if (apiM)
            info.apiVersion = apiM[1];
        if (verM)
            info.version = verM[1];
        if (descM)
            info.description = descM[1].replace(/^["']|["']$/g, "").trim();
        // Only emit if it looks cdk8s/chart related
        if (Object.keys(info).length > 0 &&
            (info.language ||
                info.app ||
                info.apiVersion ||
                /\bcdk8s\b/i.test(trimmed) ||
                info.name)) {
            if (!info.language) {
                const guessed = detectLanguageFromText(trimmed);
                if (guessed) {
                    info.language = guessed;
                    info.runtime = guessed;
                }
            }
            charts.push(info);
        }
    }
    // Attach language hint to YAML charts missing it when program text present
    const guessed = detectLanguageFromText(trimmed);
    if (guessed) {
        for (const c of charts) {
            if (!c.language) {
                c.language = guessed;
                c.runtime = guessed;
            }
        }
    }
    return charts;
}
function uniqImports(items) {
    const seen = new Set();
    const out = [];
    for (const it of items) {
        const key = `${it.kind}|${it.module ?? ""}|${it.detail ?? ""}`;
        if (seen.has(key))
            continue;
        seen.add(key);
        out.push(it);
    }
    return out;
}
/** Detect cdk8s / cdk8s-plus / imports/k8s / CRD / ApiObject imports. */
export function extractImports(text) {
    const src = text ?? "";
    if (!src.trim())
        return [];
    const found = [];
    // TS/JS: from 'cdk8s' / from "cdk8s"
    const cdk8sFrom = /\bimport\s+(?:type\s+)?(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+['"]cdk8s['"]/g;
    if (cdk8sFrom.test(src) || /\brequire\s*\(\s*['"]cdk8s['"]\s*\)/.test(src)) {
        found.push({ kind: "cdk8s", module: "cdk8s" });
    }
    // Python: from cdk8s import / import cdk8s
    if (/\bfrom\s+cdk8s\s+import\b/.test(src) || /\bimport\s+cdk8s\b/.test(src)) {
        found.push({ kind: "cdk8s", module: "cdk8s", detail: "python" });
    }
    // Java
    if (/\bimport\s+org\.cdk8s\b/.test(src)) {
        found.push({ kind: "cdk8s", module: "org.cdk8s", detail: "java" });
    }
    // cdk8s-plus-*
    const plusRe = /['"]cdk8s-plus-([0-9]+)['"]|from\s+cdk8s_plus_([0-9]+)\b|import\s+.*cdk8s-plus-([0-9]+)|org\.cdk8s\.plus([0-9]+)/g;
    let m;
    while ((m = plusRe.exec(src)) !== null) {
        const ver = m[1] || m[2] || m[3] || m[4];
        found.push({
            kind: "cdk8s-plus",
            module: `cdk8s-plus-${ver}`,
            detail: ver ? `v${ver}` : undefined,
        });
    }
    // also: import * as kplus from 'cdk8s-plus-28'
    const plusNamed = /\bfrom\s+['"](cdk8s-plus-[0-9]+)['"]|\brequire\s*\(\s*['"](cdk8s-plus-[0-9]+)['"]\s*\)/g;
    while ((m = plusNamed.exec(src)) !== null) {
        const mod = m[1] || m[2];
        found.push({ kind: "cdk8s-plus", module: mod });
    }
    // imports/k8s — generated k8s API
    if (/\bfrom\s+['"]\.\/imports\/k8s['"]/.test(src) ||
        /\bfrom\s+['"]\.\/imports\/k8s\.js['"]/.test(src) ||
        /\bfrom\s+['"]imports\/k8s['"]/.test(src) ||
        /\bimport\s+\*\s+as\s+\w+\s+from\s+['"]\.?\/?imports\/k8s/.test(src) ||
        /\bfrom\s+imports\s+import\s+k8s\b/.test(src) ||
        /\bfrom\s+imports\.k8s\s+import\b/.test(src) ||
        /\bimport\s+imports\.k8s\b/.test(src)) {
        found.push({ kind: "imports/k8s", module: "imports/k8s" });
    }
    // CRD / generated imports under imports/* (excluding k8s)
    const importPathRe = /\bfrom\s+['"]((?:\.\/)?imports\/[A-Za-z0-9_./-]+)['"]/g;
    while ((m = importPathRe.exec(src)) !== null) {
        const mod = m[1];
        if (/^(?:\.\/)?imports\/k8s(?:\.js)?$/i.test(mod))
            continue;
        found.push({ kind: "crd_import", module: mod });
    }
    // Python: from imports.foo import / import imports.foo
    const pyCrdRe = /\bfrom\s+imports\.([A-Za-z_][\w]*)\s+import\b|\bimport\s+imports\.([A-Za-z_][\w]*)\b/g;
    while ((m = pyCrdRe.exec(src)) !== null) {
        const name = m[1] || m[2];
        if (!name || /^k8s$/i.test(name))
            continue;
        found.push({ kind: "crd_import", module: `imports.${name}`, detail: "python" });
    }
    // Explicit *crd* module paths
    const crdNameRe = /\bfrom\s+['"]([^'"]*crd[^'"]*)['"]|\brequire\s*\(\s*['"]([^'"]*crd[^'"]*)['"]\s*\)/gi;
    while ((m = crdNameRe.exec(src)) !== null) {
        const mod = m[1] || m[2];
        if (!mod)
            continue;
        found.push({ kind: "crd_import", module: mod });
    }
    // cdk8s.yaml imports: list
    const yamlImports = src.match(/(?:^|\n)imports\s*:\s*\n((?:[ \t]+.+\n?)*)/i);
    if (yamlImports) {
        const lines = yamlImports[1].split("\n");
        for (const line of lines) {
            const item = line.match(/^\s*-\s*["']?([^\s"'#]+)/);
            if (!item)
                continue;
            const name = item[1];
            if (/^k8s$/i.test(name)) {
                found.push({ kind: "imports/k8s", module: "imports/k8s", detail: "cdk8s.yaml" });
            }
            else {
                found.push({ kind: "crd_import", module: name, detail: "cdk8s.yaml" });
            }
        }
    }
    // ApiObject usage / import
    if (/\bApiObject\b/.test(src) &&
        (/\bimport\b[\s\S]{0,200}\bApiObject\b/.test(src) ||
            /\bfrom\s+cdk8s\s+import\b[\s\S]{0,120}\bApiObject\b/.test(src) ||
            /\bnew\s+ApiObject\b/.test(src) ||
            /\bApiObject\s*\(/.test(src))) {
        found.push({ kind: "ApiObject", module: "cdk8s", detail: "ApiObject" });
    }
    else if (/\bnew\s+ApiObject\b/.test(src) || /\bApiObject\s*\(/.test(src)) {
        found.push({ kind: "ApiObject", detail: "ApiObject" });
    }
    return uniqImports(found);
}
/** Heuristic resource constructors from cdk8s program or synth YAML. */
export function extractResources(text) {
    const src = text ?? "";
    if (!src.trim())
        return [];
    const resources = [];
    const seen = new Set();
    const push = (info) => {
        const key = `${info.type ?? ""}|${info.name ?? ""}|${info.kind ?? ""}|${info.apiVersion ?? ""}`;
        if (seen.has(key))
            return;
        seen.add(key);
        if (info.type || info.name || info.kind || info.apiVersion) {
            resources.push(info);
        }
    };
    // new kplus.Deployment(this, "web", ...)
    // new k8s.KubeService(this, "svc", ...)
    // new ApiObject(this, "x", ...)
    const newCtorRe = /\bnew\s+((?:kplus|k8s|cdk8s|plus)(?:\.[A-Za-z_][\w]*)+|(?:ApiObject)|(?:[A-Za-z_][\w]*\.(?:Kube)?[A-Z][A-Za-z0-9_]*))\s*\(\s*(?:this|scope|chart|self)?\s*,?\s*(['"`])(.*?)\2/g;
    let m;
    while ((m = newCtorRe.exec(src)) !== null) {
        push({ type: m[1], name: m[3] });
    }
    // Broader: new Something.Deployment(this, "name"
    const broadRe = /\bnew\s+([A-Za-z_][\w]*(?:\.[A-Za-z_][\w]*)+)\s*\(\s*(?:this|scope|chart|self)\s*,\s*(['"`])(.*?)\2/g;
    while ((m = broadRe.exec(src)) !== null) {
        const type = m[1];
        if (/^(Error|Map|Set|Array|Promise|Date|RegExp|Object)\b/.test(type))
            continue;
        if (!/\.[A-Z]/.test(type) && !/ApiObject/.test(type))
            continue;
        push({ type, name: m[3] });
    }
    // new ApiObject(this, "id", { apiVersion, kind })
    const apiObjRe = /\bnew\s+ApiObject\s*\(\s*(?:this|scope|chart|self)?\s*,?\s*(['"`])(.*?)\1/g;
    while ((m = apiObjRe.exec(src)) !== null) {
        const window = src.slice(m.index, m.index + 400);
        const kindM = window.match(/\bkind\s*:\s*['"`]([^'"`]+)['"`]/);
        const apiM = window.match(/\bapiVersion\s*:\s*['"`]([^'"`]+)['"`]/);
        push({
            type: "ApiObject",
            name: m[2],
            kind: kindM ? kindM[1] : undefined,
            apiVersion: apiM ? apiM[1] : undefined,
        });
    }
    // Python: kplus.Deployment(self, "web", ...) / k8s.KubeDeployment(...)
    const pyRe = /\b((?:kplus|k8s|cdk8s)(?:\.[A-Za-z_][\w]*)+)\s*\(\s*self\s*,\s*(['"])(.*?)\2/g;
    while ((m = pyRe.exec(src)) !== null) {
        push({ type: m[1], name: m[3] });
    }
    if (/\bApiObject\s*\(\s*self\s*,/.test(src)) {
        const pyApi = /\bApiObject\s*\(\s*self\s*,\s*(['"])(.*?)\1/g;
        while ((m = pyApi.exec(src)) !== null) {
            push({ type: "ApiObject", name: m[2] });
        }
    }
    // Synth YAML paste: kind + apiVersion docs
    const docs = parseYamlDocs(src);
    for (const doc of docs) {
        const map = asMap(doc);
        if (!map)
            continue;
        const kind = strField(map, "kind");
        const apiVersion = strField(map, "apiVersion");
        if (!kind && !apiVersion)
            continue;
        // skip cdk8s.yaml language docs
        if (strField(map, "language") && !kind)
            continue;
        const meta = asMap(map.metadata);
        const name = strField(meta, "name");
        push({
            type: kind && apiVersion ? `${apiVersion}/${kind}` : kind ?? apiVersion,
            name,
            kind: kind,
            apiVersion: apiVersion,
        });
    }
    // Regex YAML fallback when parse fails partially
    const yamlKindRe = /^---?\s*$|^kind:\s*['"]?([A-Za-z][A-Za-z0-9]+)['"]?\s*$/gm;
    // Better: pair kind + apiVersion blocks
    const blockRe = /(?:^|\n)-{3}\s*\n|(?:^|\n)(?:apiVersion:\s*['"]?([^\s"'#]+)['"]?\s*\n(?:[^\n]*\n){0,8}?kind:\s*['"]?([A-Za-z][\w]+)['"]?|kind:\s*['"]?([A-Za-z][\w]+)['"]?\s*\n(?:[^\n]*\n){0,8}?apiVersion:\s*['"]?([^\s"'#]+)['"]?)/g;
    while ((m = blockRe.exec(src)) !== null) {
        const apiVersion = m[1] || m[4];
        const kind = m[2] || m[3];
        if (!kind && !apiVersion)
            continue;
        if (kind === "Chart" && !apiVersion)
            continue;
        const window = src.slice(m.index, m.index + 300);
        const nameM = window.match(/\bname:\s*['"]?([A-Za-z0-9][A-Za-z0-9_.-]*)/);
        // Avoid double-adding if YAML parse already got it
        const already = resources.some((r) => r.kind === kind && r.apiVersion === apiVersion && r.name === (nameM ? nameM[1] : undefined));
        if (!already && (kind || apiVersion)) {
            push({
                type: kind && apiVersion ? `${apiVersion}/${kind}` : kind ?? apiVersion,
                name: nameM ? nameM[1] : undefined,
                kind: kind,
                apiVersion: apiVersion,
            });
        }
    }
    // Silence unused
    void yamlKindRe;
    return resources;
}
function hasLatestImageTag(text) {
    if (/:latest\b/i.test(text))
        return true;
    return /['"`][A-Za-z0-9._/-]+:latest['"`]/i.test(text);
}
function hasPrivilegedOrHostNetwork(text) {
    if (/\bprivileged\s*:\s*true\b/i.test(text))
        return true;
    if (/\bhostNetwork\s*:\s*true\b/i.test(text))
        return true;
    if (/\bprivileged\s*:\s*!?\s*true\b/i.test(text))
        return true;
    // construct props: privileged: true / hostNetwork: true in TS
    if (/\bprivileged\s*:\s*true\b/.test(text))
        return true;
    if (/\bhostNetwork\s*:\s*true\b/.test(text))
        return true;
    return false;
}
function hasPlaintextSecretInConstruct(text) {
    // stringData / data with password-looking or Secret construct with plaintext
    if (/\b(?:password|secret|api[_-]?key|token)\b\s*:\s*['"`][^'"`]+['"`]/i.test(text) &&
        (/\bSecret\b/.test(text) || /\bstringData\b/.test(text) || /\bOpaque\b/.test(text))) {
        return true;
    }
    if (/\bstringData\s*:\s*\{[^}]*:\s*['"`][^'"`]+['"`]/s.test(text))
        return true;
    if (/\bnew\s+\w*\.?Secret\b[\s\S]{0,300}\b(?:password|token|apiKey|api_key)\s*:\s*['"`]/.test(text)) {
        return true;
    }
    // YAML Secret with stringData plaintext
    if (/\bkind\s*:\s*Secret\b/i.test(text) &&
        /\bstringData\s*:/i.test(text) &&
        /:\s*['"]?[^'"\n]{3,}['"]?\s*$/m.test(text)) {
        return true;
    }
    return false;
}
export function lintCdk8s(text) {
    const findings = [];
    const trimmed = (text ?? "").trim();
    if (!trimmed) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Provide non-empty cdk8s app / cdk8s.yaml / chart text. This tool only analyzes the string you pass — it never reads the filesystem.",
        });
        return findings;
    }
    const imports = extractImports(trimmed);
    const hasCdk8sImport = imports.some((i) => i.kind === "cdk8s");
    const looksLikeCdk8sApp = /\bcdk8s\b/i.test(trimmed) ||
        /\bextends\s+Chart\b/.test(trimmed) ||
        /\bclass\s+\w+\s*\(\s*Chart\s*\)/.test(trimmed) ||
        /\bnew\s+App\s*\(/.test(trimmed) ||
        /^\s*language\s*:/im.test(trimmed) ||
        /\bkplus\./.test(trimmed) ||
        /\bKube[A-Z]/.test(trimmed) ||
        /\bApiObject\b/.test(trimmed);
    if (looksLikeCdk8sApp && !hasCdk8sImport && !/^\s*language\s*:/im.test(trimmed)) {
        // synth YAML alone shouldn't require cdk8s import
        const looksSynthOnly = /^\s*apiVersion\s*:/im.test(trimmed) &&
            /^\s*kind\s*:/im.test(trimmed) &&
            !/\bimport\b/.test(trimmed) &&
            !/\bfrom\s+cdk8s\b/.test(trimmed) &&
            !/\bnew\s+App\b/.test(trimmed);
        if (!looksSynthOnly) {
            findings.push({
                severity: "warn",
                rule: "missing_cdk8s_import",
                advice: "No `cdk8s` import detected. TypeScript/Python/Java cdk8s apps usually import `App` / `Chart` / `ApiObject` from `cdk8s`. Educational tip only.",
            });
        }
    }
    if (hasLatestImageTag(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "latest_tag",
            advice: "Image reference uses `:latest`. Prefer pinned tags or digests for reproducible cdk8s synth/deploy.",
        });
    }
    if (hasPrivilegedOrHostNetwork(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "privileged_or_hostnetwork",
            advice: "`privileged: true` and/or `hostNetwork: true` detected. Prefer dropping capabilities and avoiding host networking unless required. Educational tip — not an exploit guide.",
        });
    }
    if (hasPlaintextSecretInConstruct(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "plaintext_secret_tip",
            advice: "Possible plaintext secret/password in a Secret construct or stringData. Prefer external secret managers / sealed secrets / CSI drivers — never commit credentials. Educational heuristic only, not an exploit guide.",
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
