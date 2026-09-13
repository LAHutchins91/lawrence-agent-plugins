/**
 * Shared Tiltfile text helpers.
 * Pure regex/string heuristics — no Tilt CLI, cluster, network, filesystem follow, or Starlark eval.
 */
/** Strip # line comments (naive; ignores strings). */
export function stripComments(text) {
    return (text ?? "")
        .split("\n")
        .map((line) => {
        let inSingle = false;
        let inDouble = false;
        let out = "";
        for (let i = 0; i < line.length; i++) {
            const c = line[i];
            if (c === "'" && !inDouble)
                inSingle = !inSingle;
            else if (c === '"' && !inSingle)
                inDouble = !inDouble;
            else if (c === "#" && !inSingle && !inDouble)
                break;
            out += c;
        }
        return out;
    })
        .join("\n");
}
/** Parse a Python/Starlark-ish list literal of strings: ['a', "b"] */
export function parseStringList(raw) {
    const inner = raw.trim();
    if (!inner)
        return [];
    const items = [];
    const re = /(['"])(.*?)\1/g;
    let m;
    while ((m = re.exec(inner)) !== null) {
        items.push(m[2]);
    }
    return items;
}
/** Find balanced call spans for a function name (best-effort). */
function findCalls(text, fnName) {
    const out = [];
    const re = new RegExp(`\\b${fnName}\\s*\\(`, "g");
    let m;
    while ((m = re.exec(text)) !== null) {
        const open = m.index + m[0].length - 1;
        let depth = 0;
        let inSingle = false;
        let inDouble = false;
        let end = -1;
        for (let i = open; i < text.length; i++) {
            const c = text[i];
            if (c === "'" && !inDouble) {
                inSingle = !inSingle;
                continue;
            }
            if (c === '"' && !inSingle) {
                inDouble = !inDouble;
                continue;
            }
            if (inSingle || inDouble)
                continue;
            if (c === "(")
                depth++;
            else if (c === ")") {
                depth--;
                if (depth === 0) {
                    end = i;
                    break;
                }
            }
        }
        if (end > open) {
            out.push({
                start: m.index,
                end,
                args: text.slice(open + 1, end),
            });
        }
    }
    return out;
}
function kwString(args, key) {
    const re = new RegExp(`\\b${key}\\s*=\\s*(['"])(.*?)\\1`, "i");
    const m = args.match(re);
    return m ? m[2] : undefined;
}
function kwList(args, key) {
    const re = new RegExp(`\\b${key}\\s*=\\s*\\[([^\\]]*)\\]`, "i");
    const m = args.match(re);
    if (!m)
        return undefined;
    const list = parseStringList(m[1]);
    return list.length > 0 ? list : [];
}
function kwIdent(args, key) {
    const re = new RegExp(`\\b${key}\\s*=\\s*([A-Za-z_][A-Za-z0-9_]*)`, "i");
    const m = args.match(re);
    return m ? m[1] : undefined;
}
function resourceNameFromArgs(args) {
    // First positional string, or name=
    const first = args.match(/^\s*(['"])(.*?)\1/);
    if (first)
        return first[2];
    return kwString(args, "name");
}
export function extractResources(text) {
    const src = stripComments(text ?? "");
    const resources = [];
    for (const call of findCalls(src, "docker_build")) {
        const image = resourceNameFromArgs(call.args);
        const info = { kind: "docker_build" };
        if (image) {
            info.image = image;
            info.name = image;
        }
        resources.push(info);
    }
    for (const call of findCalls(src, "custom_build")) {
        const image = resourceNameFromArgs(call.args);
        const info = { kind: "custom_build" };
        if (image) {
            info.image = image;
            info.name = image;
        }
        resources.push(info);
    }
    for (const call of findCalls(src, "k8s_yaml")) {
        const info = { kind: "k8s_yaml" };
        const first = resourceNameFromArgs(call.args);
        if (first)
            info.name = first;
        else {
            const list = call.args.match(/^\s*\[([^\]]*)\]/);
            if (list) {
                const items = parseStringList(list[1]);
                if (items.length > 0)
                    info.name = items.join(", ");
            }
        }
        resources.push(info);
    }
    for (const call of findCalls(src, "k8s_resource")) {
        const name = resourceNameFromArgs(call.args);
        const info = { kind: "k8s_resource" };
        if (name)
            info.name = name;
        resources.push(info);
    }
    for (const call of findCalls(src, "local_resource")) {
        const name = resourceNameFromArgs(call.args);
        const info = { kind: "local_resource" };
        if (name)
            info.name = name;
        resources.push(info);
    }
    for (const call of findCalls(src, "dc_resource")) {
        const name = resourceNameFromArgs(call.args);
        const info = { kind: "dc_resource" };
        if (name)
            info.name = name;
        resources.push(info);
    }
    for (const call of findCalls(src, "docker_compose")) {
        const info = { kind: "docker_compose" };
        const path = resourceNameFromArgs(call.args);
        if (path)
            info.name = path;
        resources.push(info);
    }
    return resources;
}
export function extractTriggers(text) {
    const src = stripComments(text ?? "");
    const triggers = [];
    const fns = [
        "k8s_resource",
        "local_resource",
        "dc_resource",
        "docker_build",
        "custom_build",
    ];
    for (const fn of fns) {
        for (const call of findCalls(src, fn)) {
            const resource = resourceNameFromArgs(call.args);
            const deps = kwList(call.args, "deps");
            const resourceDeps = kwList(call.args, "resource_deps");
            const triggerMode = kwIdent(call.args, "trigger_mode") ?? kwString(call.args, "trigger_mode");
            const autoInit = kwIdent(call.args, "auto_init") ?? kwString(call.args, "auto_init");
            const labels = kwList(call.args, "labels");
            const links = kwList(call.args, "links");
            const hasHint = (deps && deps.length > 0) ||
                (resourceDeps && resourceDeps.length > 0) ||
                !!triggerMode ||
                autoInit !== undefined ||
                (labels && labels.length > 0) ||
                (links && links.length > 0);
            if (!hasHint)
                continue;
            const info = {};
            if (resource)
                info.resource = resource;
            if (deps && deps.length > 0)
                info.deps = deps;
            if (resourceDeps && resourceDeps.length > 0)
                info.resourceDeps = resourceDeps;
            if (triggerMode)
                info.triggerMode = triggerMode;
            // Surface auto_init / labels / links via optional fields encoded in triggerMode tip
            // Keep schema to {resource?, deps?, resourceDeps?, triggerMode?} — fold extras into advice via lint.
            // Still record triggerMode; if only labels/links/auto_init, invent a triggerMode note.
            if (!triggerMode && (autoInit !== undefined || (labels && labels.length) || (links && links.length))) {
                const bits = [];
                if (autoInit !== undefined)
                    bits.push(`auto_init=${autoInit}`);
                if (labels && labels.length)
                    bits.push(`labels=[${labels.join(",")}]`);
                if (links && links.length)
                    bits.push(`links=[${links.join(",")}]`);
                info.triggerMode = bits.join("; ");
            }
            else if (triggerMode && (autoInit !== undefined || (labels && labels.length) || (links && links.length))) {
                const bits = [triggerMode];
                if (autoInit !== undefined)
                    bits.push(`auto_init=${autoInit}`);
                if (labels && labels.length)
                    bits.push(`labels=[${labels.join(",")}]`);
                if (links && links.length)
                    bits.push(`links=[${links.join(",")}]`);
                info.triggerMode = bits.join("; ");
            }
            triggers.push(info);
        }
    }
    return triggers;
}
export function extractExtensions(text) {
    const src = stripComments(text ?? "");
    const extensions = [];
    for (const call of findCalls(src, "load")) {
        const args = call.args;
        const parts = [];
        const re = /(['"])(.*?)\1/g;
        let m;
        while ((m = re.exec(args)) !== null) {
            parts.push(m[2]);
        }
        if (parts.length === 0)
            continue;
        const path = parts[0];
        const symbols = parts.slice(1);
        const info = { path };
        if (symbols.length > 0)
            info.symbols = symbols;
        extensions.push(info);
    }
    for (const call of findCalls(src, "load_dynamic")) {
        const args = call.args;
        const parts = [];
        const re = /(['"])(.*?)\1/g;
        let m;
        while ((m = re.exec(args)) !== null) {
            parts.push(m[2]);
        }
        const path = parts[0] ?? args.trim().slice(0, 80);
        const info = { path: path || undefined };
        if (parts.length > 1)
            info.symbols = parts.slice(1);
        extensions.push(info);
    }
    // v1alpha1.extension / v1alpha1.extension_repo
    const v1Re = /\bv1alpha1\.(extension(?:_repo)?)\s*\(/g;
    let vm;
    while ((vm = v1Re.exec(src)) !== null) {
        const window = src.slice(vm.index, vm.index + 400);
        const name = kwString(window, "name");
        const url = kwString(window, "url") ?? kwString(window, "repo_path");
        const info = {};
        if (url)
            info.path = url;
        else if (name)
            info.path = `v1alpha1.${vm[1]}:${name}`;
        else
            info.path = `v1alpha1.${vm[1]}`;
        if (name)
            info.symbols = [name];
        extensions.push(info);
    }
    // Bare tilt_extensions / github.com/tilt-dev path mentions outside load
    const pathRe = /(?:tilt_extensions|github\.com\/tilt-dev\/[A-Za-z0-9_.\-\/]+|ext:\/\/[A-Za-z0-9_.\-]+)/g;
    let pm;
    const seen = new Set(extensions.map((e) => e.path).filter(Boolean));
    while ((pm = pathRe.exec(src)) !== null) {
        const path = pm[0];
        if (seen.has(path))
            continue;
        // Skip if already captured inside a load path that contains it
        if ([...seen].some((p) => p.includes(path) || path.includes(p)))
            continue;
        seen.add(path);
        extensions.push({ path });
    }
    return extensions;
}
function hasLatestTag(image) {
    const s = image.trim();
    if (!s)
        return false;
    if (/:latest\b/i.test(s))
        return true;
    if (!s.includes(":"))
        return true;
    return false;
}
export function lintTiltfile(text) {
    const findings = [];
    const trimmed = (text ?? "").trim();
    if (!trimmed) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Provide non-empty Tiltfile text. This tool only analyzes the string you pass — it never reads the filesystem.",
        });
        return findings;
    }
    const src = stripComments(trimmed);
    const resources = extractResources(src);
    const hasDockerBuild = resources.some((r) => r.kind === "docker_build" || r.kind === "custom_build");
    const hasK8sYaml = resources.some((r) => r.kind === "k8s_yaml");
    const hasK8sResource = resources.some((r) => r.kind === "k8s_resource");
    const hasCompose = resources.some((r) => r.kind === "docker_compose" || r.kind === "dc_resource");
    if (!hasDockerBuild && !hasCompose) {
        findings.push({
            severity: "warn",
            rule: "missing_docker_build",
            advice: "No docker_build/custom_build (or docker_compose) found. Most Tiltfiles declare at least one image build or compose stack.",
        });
    }
    if (!hasK8sYaml && !hasK8sResource && !hasCompose) {
        findings.push({
            severity: "warn",
            rule: "missing_k8s_yaml",
            advice: "No k8s_yaml/k8s_resource (or docker_compose) found. Add k8s_yaml(...) or compose if you expect Kubernetes/Compose resources.",
        });
    }
    for (const r of resources) {
        if ((r.kind === "docker_build" || r.kind === "custom_build") &&
            r.image &&
            hasLatestTag(r.image)) {
            findings.push({
                severity: "warn",
                rule: "latest_tag",
                advice: `Image "${r.image}" uses :latest or is untagged — prefer pinned tags/digests for reproducible local workflows.`,
            });
        }
    }
    // Plaintext secret/password smell in Tiltfile text (educational)
    if (/\b(password|secret|api[_-]?key|token)\b\s*=\s*['"][^'"]+['"]/i.test(trimmed) ||
        /\b(password|secret)\s*[:=]\s*['"][^'"]+['"]/i.test(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "plaintext_secret_tip",
            advice: "Possible plaintext secret/password assignment in the Tiltfile. Prefer env vars, secret managers, or local untracked files — never commit credentials. Educational only, not an exploit guide.",
        });
    }
    // Remote git load tip
    if (/load\s*\(\s*['"][^'"]*github\.com\//i.test(trimmed) ||
        /load\s*\(\s*['"]git@/i.test(trimmed) ||
        /load_dynamic\s*\(/i.test(trimmed) ||
        /https?:\/\/[^/\s]+\/.+\.git/i.test(trimmed)) {
        findings.push({
            severity: "info",
            rule: "remote_git_load_tip",
            advice: "Remote git / load_dynamic extension references detected. Pin versions and review trust boundaries — this tool never clones or follows remotes.",
        });
    }
    // allow_k8s_contexts tip
    if (/\ballow_k8s_contexts\s*\(/i.test(trimmed)) {
        findings.push({
            severity: "info",
            rule: "allow_k8s_contexts_tip",
            advice: "allow_k8s_contexts(...) widens which kube-contexts Tilt may use. Keep the allow-list tight to avoid accidental deploys to shared/prod clusters.",
        });
    }
    else if (hasK8sYaml || hasK8sResource) {
        findings.push({
            severity: "info",
            rule: "allow_k8s_contexts_tip",
            advice: "No allow_k8s_contexts(...) found. Consider explicitly allow-listing safe local contexts so Tilt refuses unexpected clusters.",
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
