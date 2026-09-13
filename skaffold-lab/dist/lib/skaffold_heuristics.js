/**
 * Shared skaffold.yaml text helpers.
 * String/YAML analysis only — no Skaffold CLI, cluster, network, filesystem follow, or eval.
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
function profileNames(raw) {
    const map = asMap(raw);
    if (!map)
        return [];
    const profiles = map.profiles;
    if (!Array.isArray(profiles))
        return [];
    const names = [];
    for (const p of profiles) {
        const pm = asMap(p);
        const n = strField(pm, "name");
        if (n)
            names.push(n);
    }
    return names;
}
export function extractPipeline(raw) {
    const map = asMap(raw);
    if (!map)
        return null;
    const apiVersion = strField(map, "apiVersion");
    const kind = strField(map, "kind");
    const meta = asMap(map.metadata);
    const name = strField(meta, "name");
    const profiles = profileNames(map);
    // Accept skaffold Config docs or any map with build/deploy/profiles/apiVersion skaffold-ish
    const hasBuild = map.build !== undefined;
    const hasDeploy = map.deploy !== undefined;
    const hasProfiles = Array.isArray(map.profiles);
    const skaffoldish = (apiVersion && /skaffold/i.test(apiVersion)) ||
        (kind && /^Config$/i.test(kind)) ||
        hasBuild ||
        hasDeploy ||
        hasProfiles;
    if (!skaffoldish && !name && !apiVersion)
        return null;
    const info = {};
    if (name)
        info.name = name;
    if (apiVersion)
        info.apiVersion = apiVersion;
    if (profiles.length > 0)
        info.profiles = profiles;
    return info;
}
function detectBuilder(art) {
    const context = strField(art, "context");
    if (asMap(art.docker) || art.dockerfile !== undefined) {
        const docker = asMap(art.docker) ?? {};
        const dockerfile = strField(docker, "dockerfile") ?? strField(art, "dockerfile");
        return { builder: "docker", dockerfile, context };
    }
    if (asMap(art.buildpacks) || art.buildpacks !== undefined) {
        return { builder: "buildpacks", context };
    }
    if (asMap(art.jib) || art.jib !== undefined) {
        return { builder: "jib", context };
    }
    if (asMap(art.kaniko) || art.kaniko !== undefined) {
        const kaniko = asMap(art.kaniko) ?? {};
        const dockerfile = strField(kaniko, "dockerfile");
        return { builder: "kaniko", dockerfile, context };
    }
    if (asMap(art.custom) || art.custom !== undefined) {
        return { builder: "custom", context };
    }
    // default docker when image present
    if (strField(art, "image")) {
        return { builder: "docker", context };
    }
    return { context };
}
export function extractBuilds(raw) {
    const map = asMap(raw);
    if (!map)
        return [];
    const build = asMap(map.build);
    if (!build)
        return [];
    const artifacts = build.artifacts;
    if (!Array.isArray(artifacts))
        return [];
    const out = [];
    for (const a of artifacts) {
        const art = asMap(a);
        if (!art)
            continue;
        const image = strField(art, "image");
        const detected = detectBuilder(art);
        const info = {};
        if (image)
            info.image = image;
        if (detected.context)
            info.context = detected.context;
        if (detected.dockerfile)
            info.dockerfile = detected.dockerfile;
        if (detected.builder)
            info.builder = detected.builder;
        if (image || detected.builder || detected.context || detected.dockerfile) {
            out.push(info);
        }
    }
    return out;
}
export function extractDeploys(raw) {
    const map = asMap(raw);
    if (!map)
        return [];
    const deploy = asMap(map.deploy);
    if (!deploy)
        return [];
    const out = [];
    const kubectl = asMap(deploy.kubectl);
    if (kubectl) {
        const manifests = kubectl.manifests;
        const paths = Array.isArray(manifests)
            ? manifests.map((m) => String(m)).filter(Boolean)
            : undefined;
        const info = { type: "kubectl" };
        if (paths && paths.length > 0)
            info.paths = paths;
        out.push(info);
    }
    const helm = asMap(deploy.helm);
    if (helm) {
        const releases = Array.isArray(helm.releases) ? helm.releases : undefined;
        const info = { type: "helm" };
        if (releases)
            info.releases = releases;
        out.push(info);
    }
    const kustomize = asMap(deploy.kustomize);
    if (kustomize) {
        const pathsRaw = kustomize.paths ?? kustomize.path;
        let paths;
        if (Array.isArray(pathsRaw)) {
            paths = pathsRaw.map((p) => String(p)).filter(Boolean);
        }
        else if (typeof pathsRaw === "string" && pathsRaw.trim()) {
            paths = [pathsRaw.trim()];
        }
        const info = { type: "kustomize" };
        if (paths && paths.length > 0)
            info.paths = paths;
        out.push(info);
    }
    // statusCheck as a deploy-ish note entry when alone or alongside
    if (deploy.statusCheck !== undefined && out.length === 0) {
        out.push({ type: "statusCheck" });
    }
    else if (deploy.statusCheck !== undefined && out.length > 0) {
        // attach as synthetic entry so callers can see it
        out.push({ type: "statusCheck", paths: [String(deploy.statusCheck)] });
    }
    return out;
}
function hasLatestTag(image) {
    const s = image.trim();
    if (!s)
        return false;
    if (/:latest\b/i.test(s))
        return true;
    // untagged (no :) — treat as floating/latest smell for educational tip
    if (!s.includes(":"))
        return true;
    return false;
}
function textHasRemoteGit(text) {
    return (/git@[\w.-]+:/.test(text) ||
        /https?:\/\/[^/\s]+\/.+\.git/i.test(text) ||
        /\brepo:\s*['"]?git/i.test(text) ||
        /\bgit\s*:\s*['"]?https?:/i.test(text));
}
function textHasSecretPathTip(text) {
    return (/secret/i.test(text) &&
        (/manifests?:/i.test(text) ||
            /k8s\//i.test(text) ||
            /\.ya?ml/i.test(text) ||
            /deploy:/i.test(text)));
}
export function lintSkaffold(text) {
    const findings = [];
    const trimmed = (text ?? "").trim();
    if (!trimmed) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Provide non-empty skaffold.yaml text. This tool only analyzes the string you pass — it never reads the filesystem.",
        });
        return findings;
    }
    const docs = parseYamlDocs(trimmed);
    const docsToCheck = docs.length > 0 ? docs : [parseYamlObject(trimmed)].filter((d) => d !== null);
    if (docsToCheck.length === 0) {
        findings.push({
            severity: "error",
            rule: "unparseable_yaml",
            advice: "Could not parse YAML. Check indentation and document separators (---).",
        });
        return findings;
    }
    let anyArtifacts = false;
    let anyApiVersion = false;
    let anyKind = false;
    for (const doc of docsToCheck) {
        const map = asMap(doc);
        if (!map)
            continue;
        const apiVersion = strField(map, "apiVersion");
        const kind = strField(map, "kind");
        if (apiVersion)
            anyApiVersion = true;
        if (kind)
            anyKind = true;
        if (!apiVersion) {
            findings.push({
                severity: "warn",
                rule: "missing_apiVersion",
                advice: "Add apiVersion (e.g. skaffold/v4beta7) so Skaffold knows which schema to use.",
            });
        }
        else if (!/skaffold\//i.test(apiVersion)) {
            findings.push({
                severity: "info",
                rule: "unexpected_apiVersion",
                advice: `apiVersion "${apiVersion}" does not look like a skaffold/* schema — confirm this is a skaffold.yaml.`,
            });
        }
        if (!kind) {
            findings.push({
                severity: "warn",
                rule: "missing_kind",
                advice: 'Add kind: Config for a standard Skaffold config document.',
            });
        }
        else if (!/^Config$/i.test(kind)) {
            findings.push({
                severity: "info",
                rule: "unexpected_kind",
                advice: `kind "${kind}" is unusual for skaffold.yaml (expected Config).`,
            });
        }
        const builds = extractBuilds(map);
        if (builds.length > 0)
            anyArtifacts = true;
        for (const b of builds) {
            if (b.image && hasLatestTag(b.image)) {
                findings.push({
                    severity: "warn",
                    rule: "latest_tag",
                    advice: `Image "${b.image}" uses :latest or is untagged — pin a digest or immutable tag for reproducible deploys.`,
                });
            }
        }
        const build = asMap(map.build);
        if (build && (!Array.isArray(build.artifacts) || build.artifacts.length === 0)) {
            findings.push({
                severity: "warn",
                rule: "missing_build_artifacts",
                advice: "build.artifacts is empty or missing — add at least one artifact with an image name.",
            });
            anyArtifacts = true; // avoid duplicate global missing tip
        }
        const deploys = extractDeploys(map);
        if (deploys.length === 0 && !asMap(map.deploy) && !asMap(map.manifests)) {
            // no deploy section — info tip
            findings.push({
                severity: "info",
                rule: "missing_deploy_tip",
                advice: "No deploy section found. Add deploy.kubectl, deploy.helm, or deploy.kustomize when you want Skaffold to apply manifests.",
            });
        }
    }
    if (!anyApiVersion) {
        // already emitted per-doc; if somehow skipped
    }
    if (!anyKind) {
        // already emitted
    }
    // Global missing artifacts when no build.artifacts across docs
    if (!anyArtifacts) {
        const already = findings.some((f) => f.rule === "missing_build_artifacts");
        if (!already) {
            findings.push({
                severity: "warn",
                rule: "missing_build_artifacts",
                advice: "No build.artifacts found. Skaffold configs usually declare at least one image artifact to build.",
            });
        }
    }
    if (textHasRemoteGit(trimmed)) {
        findings.push({
            severity: "info",
            rule: "remote_git_repo_tip",
            advice: "Remote git repo references detected. Prefer pinning commits/tags and reviewing trust boundaries — this tool never clones or follows remotes.",
        });
    }
    if (textHasSecretPathTip(trimmed)) {
        findings.push({
            severity: "info",
            rule: "plaintext_secrets_manifests_tip",
            advice: "Paths or keys mentioning secrets/manifests were found. Avoid committing plaintext secrets in kubectl manifests — use Secrets managers or sealed/encrypted resources. This is educational only, not an exploit guide.",
        });
    }
    // Deduplicate identical rule+advice
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
