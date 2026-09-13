/**
 * Shared CDKTF / cdktf.json / TypeScript program text helpers.
 * Pure JSON/string/regex heuristics — no CDKTF CLI, Terraform apply, network, filesystem follow, or eval.
 */
import { parse as parseYaml, parseAllDocuments } from "yaml";
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
/** Best-effort JSON parse; returns null on empty/invalid. */
export function parseJsonObject(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed)
        return null;
    try {
        return JSON.parse(trimmed);
    }
    catch {
        return null;
    }
}
/** Best-effort YAML parse (for loose / mixed pastes). */
export function parseYamlObject(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed)
        return null;
    try {
        return parseYaml(trimmed);
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
function looksLikeCdktfJson(map) {
    if (map.language !== undefined || map.app !== undefined)
        return true;
    if (map.projectId !== undefined)
        return true;
    if (map.terraformProviders !== undefined || map.terraformModules !== undefined) {
        return true;
    }
    if (map.codeMakerOutput !== undefined || map.context !== undefined)
        return true;
    return false;
}
function providerEntries(raw) {
    const out = [];
    if (!raw)
        return out;
    if (Array.isArray(raw)) {
        for (const item of raw) {
            if (typeof item === "string" && item.trim()) {
                out.push(item.trim());
            }
            else {
                const m = asMap(item);
                if (!m)
                    continue;
                // { "aws": "5.0.0" } style inside array, or name/source fields
                const keys = Object.keys(m);
                if (keys.length === 1 && typeof m[keys[0]] === "string") {
                    out.push(`${keys[0]}@${m[keys[0]]}`);
                }
                else {
                    const name = strField(m, "name") ??
                        strField(m, "source") ??
                        strField(m, "provider");
                    const ver = strField(m, "version");
                    if (name)
                        out.push(ver ? `${name}@${ver}` : name);
                }
            }
        }
        return out;
    }
    const map = asMap(raw);
    if (!map)
        return out;
    for (const [k, v] of Object.entries(map)) {
        if (typeof v === "string") {
            out.push(v.trim() ? `${k}@${v}` : k);
        }
        else if (v && typeof v === "object") {
            const inner = asMap(v);
            const ver = strField(inner, "version") ?? strField(inner, "source");
            out.push(ver ? `${k}@${ver}` : k);
        }
        else {
            out.push(k);
        }
    }
    return out;
}
function moduleEntries(raw) {
    return providerEntries(raw);
}
function detectLanguageFromText(src) {
    const langM = src.match(/["']?language["']?\s*:\s*["']([A-Za-z0-9_+-]+)["']/i);
    if (langM)
        return langM[1];
    if (/\bfrom\s+cdktf\s+import\b/.test(src) || /\bimport\s+cdktf\b/.test(src)) {
        return "python";
    }
    if (/\bimport\s+com\.hashicorp\.cdktf\b/.test(src))
        return "java";
    if (/\bfrom\s+['"]cdktf['"]/.test(src) ||
        /\bimport\s+.*\bfrom\s+['"]cdktf['"]/.test(src) ||
        /\brequire\s*\(\s*['"]cdktf['"]\s*\)/.test(src) ||
        /\bimport\s+\*\s+as\s+\w+\s+from\s+['"]cdktf['"]/.test(src) ||
        /\bnew\s+App\s*\(/.test(src) ||
        /\bextends\s+TerraformStack\b/.test(src) ||
        /\b@cdktf\//.test(src)) {
        return "typescript";
    }
    if (/\blanguage\s*:\s*typescript\b/i.test(src))
        return "typescript";
    if (/\blanguage\s*:\s*python\b/i.test(src))
        return "python";
    if (/\blanguage\s*:\s*java\b/i.test(src))
        return "java";
    if (/\blanguage\s*:\s*csharp\b/i.test(src))
        return "csharp";
    if (/\blanguage\s*:\s*go\b/i.test(src))
        return "go";
    return undefined;
}
/** Parse cdktf.json-ish JSON (or JSON-ish fragment) for project metadata. */
export function extractCdktfMeta(text) {
    const trimmed = (text ?? "").trim();
    const meta = { providers: [], modules: [] };
    if (!trimmed)
        return meta;
    let map = null;
    const json = parseJsonObject(trimmed);
    map = asMap(json);
    if (!map || !looksLikeCdktfJson(map)) {
        // Try extracting a JSON object substring
        const brace = trimmed.match(/\{[\s\S]*\}/);
        if (brace) {
            const inner = parseJsonObject(brace[0]);
            const innerMap = asMap(inner);
            if (innerMap && looksLikeCdktfJson(innerMap))
                map = innerMap;
        }
    }
    if (!map) {
        // YAML fallback for pasted cdktf-ish config
        const y = parseYamlObject(trimmed);
        const ym = asMap(y);
        if (ym && looksLikeCdktfJson(ym))
            map = ym;
    }
    if (map && looksLikeCdktfJson(map)) {
        const language = strField(map, "language");
        const app = strField(map, "app");
        const projectId = strField(map, "projectId");
        if (language)
            meta.language = language;
        if (app)
            meta.app = app;
        if (projectId)
            meta.projectId = projectId;
        meta.providers = providerEntries(map.terraformProviders);
        meta.modules = moduleEntries(map.terraformModules);
    }
    // Regex fallback for fragments
    if (!meta.language) {
        const langM = trimmed.match(/["']language["']\s*:\s*["']([^"']+)["']/);
        if (langM)
            meta.language = langM[1];
    }
    if (!meta.app) {
        const appM = trimmed.match(/["']app["']\s*:\s*["']([^"']+)["']/);
        if (appM)
            meta.app = appM[1];
    }
    if (!meta.projectId) {
        const pidM = trimmed.match(/["']projectId["']\s*:\s*["']([^"']+)["']/);
        if (pidM)
            meta.projectId = pidM[1];
    }
    if (meta.providers.length === 0) {
        // "hashicorp/aws@~> 5.0" style inside terraformProviders
        const tpBlock = trimmed.match(/["']terraformProviders["']\s*:\s*\[([\s\S]*?)\]/);
        if (tpBlock) {
            const strRe = /["']([^"']+)["']/g;
            let m;
            while ((m = strRe.exec(tpBlock[1])) !== null) {
                if (m[1] && !/^(name|source|version)$/i.test(m[1])) {
                    meta.providers.push(m[1]);
                }
            }
        }
    }
    if (!meta.language) {
        const guessed = detectLanguageFromText(trimmed);
        if (guessed)
            meta.language = guessed;
    }
    return meta;
}
/** Extract stack names + language/app hints from cdktf.json / app text. */
export function extractStacks(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed)
        return { stacks: [] };
    const meta = extractCdktfMeta(trimmed);
    const stacks = [];
    const seen = new Set();
    const push = (info) => {
        const key = `${info.name ?? ""}|${info.language ?? ""}|${info.app ?? ""}`;
        if (seen.has(key))
            return;
        // avoid empty-only
        if (!info.name && !info.language && !info.app)
            return;
        seen.add(key);
        stacks.push(info);
    };
    // class Foo extends TerraformStack
    const classRe = /\b(?:export\s+)?class\s+([A-Za-z_][\w]*)\s+extends\s+TerraformStack\b/g;
    let m;
    while ((m = classRe.exec(trimmed)) !== null) {
        push({
            name: m[1],
            language: meta.language ?? detectLanguageFromText(trimmed) ?? "typescript",
            app: meta.app,
        });
    }
    // Python: class MyStack(TerraformStack):
    const pyClassRe = /\bclass\s+([A-Za-z_][\w]*)\s*\(\s*TerraformStack\s*\)\s*:/g;
    while ((m = pyClassRe.exec(trimmed)) !== null) {
        push({
            name: m[1],
            language: "python",
            app: meta.app,
        });
    }
    // new MyStack(app, "stack-id") — only *Stack class names (avoid resources)
    const newStackRe = /\bnew\s+([A-Z][A-Za-z0-9_]*Stack)\s*\(\s*\w+\s*,\s*(['"`])(.*?)\2/g;
    while ((m = newStackRe.exec(trimmed)) !== null) {
        const className = m[1];
        const id = m[3];
        if (/^(TerraformStack)$/.test(className))
            continue;
        const lang = meta.language ?? detectLanguageFromText(trimmed) ?? "typescript";
        if (!stacks.some((s) => s.name === id || s.name === className)) {
            push({ name: id || className, language: lang, app: meta.app });
        }
    }
    // If only cdktf.json (no stack classes), emit a project-level stack hint
    if (stacks.length === 0 && (meta.language || meta.app || meta.projectId)) {
        push({
            name: meta.projectId,
            language: meta.language,
            app: meta.app,
        });
    }
    const result = { stacks };
    if (meta.language)
        result.language = meta.language;
    else {
        const guessed = detectLanguageFromText(trimmed);
        if (guessed)
            result.language = guessed;
    }
    if (meta.app)
        result.app = meta.app;
    if (meta.projectId)
        result.projectId = meta.projectId;
    if (meta.providers.length > 0)
        result.providers = meta.providers;
    // Fill language/app onto stacks missing them
    for (const s of stacks) {
        if (!s.language && result.language)
            s.language = result.language;
        if (!s.app && result.app)
            s.app = result.app;
    }
    return result;
}
function uniqStrings(items) {
    const seen = new Set();
    const out = [];
    for (const it of items) {
        const s = it.trim();
        if (!s || seen.has(s))
            continue;
        seen.add(s);
        out.push(s);
    }
    return out;
}
/** Detect terraformProviders + TS provider imports/constructors. */
export function extractProviders(text) {
    const src = text ?? "";
    if (!src.trim())
        return [];
    const found = [];
    const meta = extractCdktfMeta(src);
    found.push(...meta.providers);
    // import { AwsProvider } from ...
    const namedImportRe = /\bimport\s+\{\s*([^}]+)\s*\}\s+from\s+['"]([^'"]+)['"]/g;
    let m;
    while ((m = namedImportRe.exec(src)) !== null) {
        const names = m[1].split(",").map((x) => x.trim().split(/\s+as\s+/)[0].trim());
        const mod = m[2];
        let sawProviderSymbol = false;
        for (const n of names) {
            if (/Provider$/i.test(n)) {
                found.push(n);
                sawProviderSymbol = true;
            }
        }
        // Prefer package root (@cdktf/provider-aws) when importing a *Provider
        if (sawProviderSymbol && /@cdktf\/provider-/i.test(mod)) {
            const root = mod.match(/(@cdktf\/provider-[A-Za-z0-9_-]+)/);
            if (root)
                found.push(root[1]);
        }
    }
    // import * as aws from '@cdktf/provider-aws'
    const starRe = /\bimport\s+\*\s+as\s+(\w+)\s+from\s+['"](@cdktf\/provider-[^'"]+)['"]/g;
    while ((m = starRe.exec(src)) !== null) {
        found.push(m[2]);
    }
    // require('@cdktf/provider-aws')
    const reqRe = /\brequire\s*\(\s*['"](@cdktf\/provider-[^'"]+)['"]\s*\)/g;
    while ((m = reqRe.exec(src)) !== null) {
        found.push(m[1]);
    }
    // Loose @cdktf/provider-* package roots
    const pkgRe = /['"](@cdktf\/provider-[A-Za-z0-9_-]+)(?:\/[^'"]*)?['"]/g;
    while ((m = pkgRe.exec(src)) !== null) {
        found.push(m[1]);
    }
    // new AwsProvider(this, "aws", ...)
    const newProvRe = /\bnew\s+([A-Za-z_][\w]*Provider)\s*\(/g;
    while ((m = newProvRe.exec(src)) !== null) {
        found.push(m[1]);
    }
    // new aws.AwsProvider / new aws.provider.AwsProvider
    const dottedProvRe = /\bnew\s+((?:[A-Za-z_][\w]*\.)+[A-Za-z_][\w]*Provider)\s*\(/g;
    while ((m = dottedProvRe.exec(src)) !== null) {
        found.push(m[1]);
    }
    return uniqStrings(found);
}
/** Heuristic resource constructors + HCL-ish resource blocks. */
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
    // new S3Bucket(this, "bucket", ...) / new Instance(this, "web", ...)
    // Prefer Capitalized CDKTF-style resource class names (not Provider)
    const newCtorRe = /\bnew\s+([A-Z][A-Za-z0-9_]*)\s*\(\s*(?:this|scope|self)?\s*,?\s*(['"`])(.*?)\2/g;
    let m;
    while ((m = newCtorRe.exec(src)) !== null) {
        const type = m[1];
        if (/^(Error|Map|Set|Array|Promise|Date|RegExp|Object|Function|Buffer|App|Construct|TerraformStack|TerraformVariable|TerraformOutput|TerraformAsset|Fn|Token)$/.test(type)) {
            continue;
        }
        if (/Provider$/i.test(type))
            continue;
        // Skip generic Stack constructors already covered elsewhere unless resource-ish
        if (/Stack$/i.test(type) && !/Resource$/i.test(type))
            continue;
        push(type, m[3]);
    }
    // new aws.s3Bucket.S3Bucket / new aws.instance.Instance
    const dottedRe = /\bnew\s+((?:[A-Za-z_][\w]*\.)+[A-Z][A-Za-z0-9_]*)\s*\(\s*(?:this|scope|self)?\s*,?\s*(['"`])(.*?)\2/g;
    while ((m = dottedRe.exec(src)) !== null) {
        const type = m[1];
        if (/Provider$/i.test(type))
            continue;
        if (/^(Error|Map|Set|Array)\b/.test(type.split(".")[0]))
            continue;
        push(type, m[3]);
    }
    // TerraformResource / new TerraformResource(...)
    if (/\bTerraformResource\b/.test(src)) {
        const trRe = /\b(?:new\s+)?TerraformResource\s*\(\s*(?:this|scope|self)?\s*,?\s*(['"`])(.*?)\1/g;
        while ((m = trRe.exec(src)) !== null) {
            push("TerraformResource", m[2]);
        }
        // also note bare mention with tfResourceType nearby
        const typeNear = src.match(/TerraformResource[\s\S]{0,200}\btfResourceType\s*:\s*['"`]([^'"`]+)['"`]/);
        if (typeNear)
            push(typeNear[1], undefined);
    }
    // HCL-ish synthesized paste: resource "aws_s3_bucket" "name" {
    const hclRe = /\bresource\s+["']([A-Za-z0-9_]+)["']\s+["']([A-Za-z0-9_-]+)["']\s*\{/g;
    while ((m = hclRe.exec(src)) !== null) {
        push(m[1], m[2]);
    }
    // data "aws_ami" "name" { — optional, skip data sources unless useful
    // skip to keep resources focused
    return resources;
}
function hasAkiaOrHardcodedSecret(text) {
    if (/\bAKIA[0-9A-Z]{16}\b/.test(text))
        return true;
    if (/\b(?:aws_secret_access_key|secretAccessKey|secret_key|api[_-]?key|password|token)\b\s*[:=]\s*['"`][^'"`]{8,}['"`]/i.test(text)) {
        return true;
    }
    if (/\b(?:accessKey|access_key|AWS_ACCESS_KEY_ID)\b\s*[:=]\s*['"`][A-Z0-9]{16,}['"`]/i.test(text)) {
        return true;
    }
    return false;
}
function hasLatestAmiOrTag(text) {
    if (/:latest\b/i.test(text))
        return true;
    if (/\bami-[0-9a-f]+\b/i.test(text) && /\blatest\b/i.test(text))
        return true;
    // tags: { ... latest } or image/ami name with latest
    if (/\b(?:ami|image|imageId|amiId)\b\s*[:=]\s*['"`][^'"`]*latest[^'"`]*['"`]/i.test(text)) {
        return true;
    }
    if (/\btags\s*[:=][\s\S]{0,200}\blatest\b/i.test(text))
        return true;
    return false;
}
function hasBackendHint(text) {
    if (/\bTerraformBackend\b/.test(text))
        return true;
    if (/\bS3Backend\b|\bAzurermBackend\b|\bGcsBackend\b|\bRemoteBackend\b/.test(text)) {
        return true;
    }
    if (/\bbackend\s+["'][\w]+["']/.test(text))
        return true;
    if (/\bterraform\s*\{[\s\S]*?\bbackend\b/.test(text))
        return true;
    return false;
}
export function lintCdktf(text) {
    const findings = [];
    const trimmed = (text ?? "").trim();
    if (!trimmed) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Provide non-empty cdktf.json / CDKTF TypeScript (or program) text. This tool only analyzes the string you pass — it never reads the filesystem.",
        });
        return findings;
    }
    const meta = extractCdktfMeta(trimmed);
    const looksLikeCdktf = /\bcdktf\b/i.test(trimmed) ||
        /\bTerraformStack\b/.test(trimmed) ||
        /\b@cdktf\//.test(trimmed) ||
        /\bterraformProviders\b/.test(trimmed) ||
        /\bnew\s+App\s*\(/.test(trimmed) ||
        meta.language !== undefined ||
        meta.app !== undefined ||
        meta.projectId !== undefined;
    const looksLikeJsonConfig = /["']language["']\s*:/.test(trimmed) ||
        /["']app["']\s*:/.test(trimmed) ||
        /["']terraformProviders["']\s*:/.test(trimmed) ||
        /["']projectId["']\s*:/.test(trimmed);
    if (looksLikeJsonConfig || looksLikeCdktf) {
        if (!meta.language && !detectLanguageFromText(trimmed)) {
            // Only warn missing language when it looks like cdktf.json-ish
            if (looksLikeJsonConfig || /\bprojectId\b/.test(trimmed)) {
                findings.push({
                    severity: "warn",
                    rule: "missing_language",
                    advice: "No `language` field detected in cdktf.json-ish text. Set `language` (e.g. typescript) so CDKTF knows which runtime to use. Educational tip only.",
                });
            }
        }
        if (!meta.app && looksLikeJsonConfig) {
            findings.push({
                severity: "warn",
                rule: "missing_app",
                advice: "No `app` command detected in cdktf.json-ish text. Set `app` (e.g. `npx ts-node main.ts`) so `cdktf synth` can run your program. Educational tip only.",
            });
        }
    }
    if (hasAkiaOrHardcodedSecret(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "hardcoded_secret",
            advice: "Possible hardcoded secret or AWS access key id (AKIA…) detected in text. Prefer environment variables, secret managers, or Terraform variables marked sensitive — never commit credentials. Educational heuristic only, not an exploit guide.",
        });
    }
    if (hasLatestAmiOrTag(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "latest_tag",
            advice: "`:latest` (or latest AMI/image/tag) reference detected. Prefer pinned AMI IDs, image digests, or versioned tags for reproducible CDKTF synth/deploy.",
        });
    }
    // Missing backend tip when it looks like a full stack/program without backend
    if (looksLikeCdktf &&
        (/\bextends\s+TerraformStack\b/.test(trimmed) ||
            /\bnew\s+App\s*\(/.test(trimmed) ||
            looksLikeJsonConfig) &&
        !hasBackendHint(trimmed)) {
        findings.push({
            severity: "info",
            rule: "missing_backend_tip",
            advice: "No Terraform backend / CDKTF backend construct detected in this paste. For shared state, configure a remote backend (e.g. S3Backend) in your stack. Educational tip only — this tool never runs Terraform.",
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
