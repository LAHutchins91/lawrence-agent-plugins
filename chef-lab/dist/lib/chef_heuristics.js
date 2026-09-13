/**
 * Shared Chef cookbook/recipe Ruby DSL text helpers.
 * Pure regex/string heuristics — no Chef CLI, knife, network, filesystem follow, or eval.
 */
const SECRET_KEY_RE = /(?:^|[_.\-\/\[\]])(password|passwd|secret|token|api[_-]?key|access[_-]?key|private[_-]?key|auth[_-]?token|client[_-]?secret)(?:$|[_.\-\/\[\]])/i;
function isSecretKeyName(name) {
    const bare = name.replace(/^['"]|['"]$/g, "");
    return (SECRET_KEY_RE.test(bare) ||
        /^(password|passwd|secret|token)$/i.test(bare) ||
        /\[(?:['"]?)(password|passwd|secret|token|api[_-]?key)(?:['"]?)\]/i.test(bare));
}
function unquote(s) {
    const t = s.trim();
    if ((t.startsWith("'") && t.endsWith("'")) ||
        (t.startsWith('"') && t.endsWith('"'))) {
        return t.slice(1, -1);
    }
    return t;
}
/** Extract cookbooks from metadata.rb / Policyfile / Berksfile text. */
export function extractCookbooks(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed)
        return [];
    const cookbooks = [];
    const byName = new Map();
    let primary = null;
    const ensure = (name) => {
        if (name) {
            let c = byName.get(name);
            if (!c) {
                c = { name };
                byName.set(name, c);
                cookbooks.push(c);
            }
            return c;
        }
        if (!primary) {
            primary = {};
            cookbooks.push(primary);
        }
        return primary;
    };
    const getPrimary = () => {
        if (primary)
            return primary;
        primary = cookbooks[0] ?? ensure();
        return primary;
    };
    // metadata.rb: name 'foo'
    const nameRe = /(?:^|\n)\s*name\s+(['"][^'"]+['"]|[A-Za-z_][\w.-]*)/gi;
    let m;
    while ((m = nameRe.exec(trimmed)) !== null) {
        const n = unquote(m[1]);
        if (n && !/^(run_list|default_source)$/i.test(n)) {
            const c = ensure(n);
            c.name = n;
            if (!primary)
                primary = c;
        }
    }
    // version '1.2.3' (metadata)
    const verRe = /(?:^|\n)\s*version\s+(['"][^'"]+['"]|[\d][\w.-]*)/gi;
    while ((m = verRe.exec(trimmed)) !== null) {
        const v = unquote(m[1]);
        getPrimary().version = v;
    }
    // depends 'apt', '~> 7.0'  OR  depends "nginx"
    const dependsRe = /(?:^|\n)\s*depends\s+(['"][^'"]+['"])\s*(?:,\s*(['"][^'"]+['"]))?/gi;
    while ((m = dependsRe.exec(trimmed)) !== null) {
        const depName = unquote(m[1]);
        const constraint = m[2] ? unquote(m[2]) : undefined;
        const label = constraint ? `${depName} (${constraint})` : depName;
        const target = getPrimary();
        if (!target.depends)
            target.depends = [];
        if (!target.depends.includes(label))
            target.depends.push(label);
        // also record as separate cookbook entry for the dependency
        if (!byName.has(depName)) {
            const dep = { name: depName };
            if (constraint)
                dep.version = constraint;
            byName.set(depName, dep);
            cookbooks.push(dep);
        }
    }
    // supports 'ubuntu', '>= 18.04'
    const supportsRe = /(?:^|\n)\s*supports\s+(['"][^'"]+['"])\s*(?:,\s*(['"][^'"]+['"]))?/gi;
    while ((m = supportsRe.exec(trimmed)) !== null) {
        const plat = unquote(m[1]);
        const constraint = m[2] ? unquote(m[2]) : undefined;
        const label = constraint ? `${plat} (${constraint})` : plat;
        const p = getPrimary();
        if (!p.supports)
            p.supports = [];
        if (!p.supports.includes(label))
            p.supports.push(label);
    }
    // Berksfile: cookbook 'apt' / cookbook 'nginx', '~> 2.0'
    const berksRe = /(?:^|\n)\s*cookbook\s+(['"][^'"]+['"])\s*(?:,\s*(['"][^'"]+['"]|path:\s*['"][^'"]+['"]|[^\n#,]+))?/gi;
    while ((m = berksRe.exec(trimmed)) !== null) {
        const n = unquote(m[1]);
        const rest = (m[2] || "").trim();
        const c = ensure(n);
        c.name = n;
        if (rest) {
            const q = rest.match(/^['"]([^'"]+)['"]/);
            if (q)
                c.version = q[1];
            else if (/path\s*:/i.test(rest)) {
                /* local path — leave version unset */
            }
            else {
                const cleaned = unquote(rest.replace(/,$/, "").trim());
                if (cleaned && !/^(true|false)$/i.test(cleaned))
                    c.version = cleaned;
            }
        }
    }
    // If we only got depends as separate entries and a nameless primary, clean up
    // Prefer returning entries that have a name
    const named = cookbooks.filter((c) => c.name);
    if (named.length > 0)
        return named;
    // fallback: single empty-ish entry if any metadata-ish keys found
    if (cookbooks.length > 0)
        return cookbooks;
    return [];
}
const RESOURCE_TYPES = [
    "package",
    "service",
    "template",
    "file",
    "directory",
    "execute",
    "cookbook_file",
    "remote_file",
    "link",
    "user",
    "group",
    "cron",
    "mount",
    "git",
    "bash",
    "script",
    "ruby_block",
    "log",
    "ohai",
    "apt_package",
    "yum_package",
    "systemd_unit",
];
/** Heuristic scan of recipe Ruby for resources + include_recipe. */
export function extractRecipes(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed)
        return { resources: [], includes: [] };
    const resources = [];
    const seenRes = new Set();
    const includes = [];
    const seenInc = new Set();
    const pushRes = (type, name) => {
        const key = `${type}|${name ?? ""}`;
        if (seenRes.has(key))
            return;
        seenRes.add(key);
        const r = { type };
        if (name)
            r.name = name;
        resources.push(r);
    };
    // include_recipe 'cookbook::recipe'
    const incRe = /include_recipe\s*\(?\s*(['"][^'"]+['"]|[A-Za-z_][\w.:-]*)\s*\)?/gi;
    let m;
    while ((m = incRe.exec(trimmed)) !== null) {
        const n = unquote(m[1]);
        if (n && !seenInc.has(n)) {
            seenInc.add(n);
            includes.push(n);
        }
    }
    // resource 'name' do  OR  resource "name" do  OR  resource name do
    const typeAlt = RESOURCE_TYPES.join("|");
    const resRe = new RegExp(`(?:^|\\n)\\s*(${typeAlt})\\s+(?:(['"][^'"]+['"])|([A-Za-z_][\\w./:@-]*)|(%\\w?\\{[^}]*\\}))\\s*(?:do|\\{|$)`, "gi");
    while ((m = resRe.exec(trimmed)) !== null) {
        const type = m[1].toLowerCase();
        const nameRaw = m[2] || m[3] || m[4] || "";
        const name = nameRaw ? unquote(nameRaw.replace(/^%r?\{|\}$/g, "")) : undefined;
        pushRes(type, name || undefined);
    }
    // Also catch: package 'x' without do on same line patterns already covered.
    // Custom LWRP-ish: something_resource 'name' do — light catch for *_* pattern
    const customRe = /(?:^|\n)\s*([a-z][a-z0-9]*(?:_[a-z0-9]+)+)\s+(['"][^'"]+['"])\s+do\b/gi;
    while ((m = customRe.exec(trimmed)) !== null) {
        const type = m[1].toLowerCase();
        if (RESOURCE_TYPES.includes(type))
            continue; // already
        // skip common non-resources
        if (/^(not_if|only_if|lazy|sensitive|action|notifies|subscribes|include_recipe)$/i.test(type)) {
            continue;
        }
        pushRes(type, unquote(m[2]));
    }
    return { resources, includes };
}
/** Extract default/override/normal / node[...] attribute keys; flag secret key names. */
export function extractAttrs(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed)
        return { attrs: [], secretKeyNames: [] };
    const attrs = new Set();
    const secrets = new Set();
    const consider = (path) => {
        const p = path.trim();
        if (!p)
            return;
        attrs.add(p);
        // check each bracket key and the full path
        if (isSecretKeyName(p))
            secrets.add(p);
        const parts = [...p.matchAll(/\[['"]?([^'"\]]+)['"]?\]/g)].map((x) => x[1]);
        for (const part of parts) {
            if (isSecretKeyName(part))
                secrets.add(part);
        }
        // dotted path last segment
        const last = p.split(/[.\/]/).pop();
        if (last && isSecretKeyName(last))
            secrets.add(last);
    };
    // default['a']['b'] = ...  / override[...] / normal[...] / force_default / force_override
    const assignRe = /(?:^|\n)\s*(?:default|override|normal|force_default|force_override)((?:\[[^\]]+\])+)\s*=/gi;
    let m;
    while ((m = assignRe.exec(trimmed)) !== null) {
        consider(m[1]);
    }
    // node.default['x'] / node.override['x'] / node.normal['x']
    const nodeMethodRe = /node\.(?:default|override|normal|force_default|force_override)((?:\[[^\]]+\])+)\s*=/gi;
    while ((m = nodeMethodRe.exec(trimmed)) !== null) {
        consider(m[1]);
    }
    // node['a']['b'] references (read or write)
    const nodeIndexRe = /node((?:\[[^\]]+\])+)/gi;
    while ((m = nodeIndexRe.exec(trimmed)) !== null) {
        consider(m[1]);
    }
    // Simple attributes/*.rb style: default['cookbook']['key'] already covered.
    // Also: attribute 'name', ... (metadata attribute declarations)
    const metaAttrRe = /(?:^|\n)\s*attribute\s+(['"][^'"]+['"])/gi;
    while ((m = metaAttrRe.exec(trimmed)) !== null) {
        const n = unquote(m[1]);
        consider(n);
    }
    return {
        attrs: [...attrs],
        secretKeyNames: [...secrets],
    };
}
function looksLikeChef(text) {
    return (/\b(?:name|version|depends|supports)\s+['"]/i.test(text) ||
        /\binclude_recipe\b/i.test(text) ||
        /\b(?:package|service|template|file|directory|execute)\s+['"]/i.test(text) ||
        /\b(?:default|override|normal)\s*\[/i.test(text) ||
        /\bnode\s*\[/i.test(text) ||
        /\bcookbook\s+['"]/i.test(text) ||
        /\brun_list\b/i.test(text) ||
        /\bdefault_source\b/i.test(text));
}
function hasPlaintextPassword(text) {
    // password/secret/token keys assigned a literal non-interpolated string
    return /(?:password|passwd|secret|token|api[_-]?key)['"\]]*\s*=\s*['"](?!#\{)[^'"]{3,}['"]/i.test(text);
}
function executeWithoutGuard(text) {
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
        if (/\bexecute\s+['"]/.test(lines[i]) || /\bexecute\s+\S+\s+do\b/.test(lines[i])) {
            let window = lines[i];
            let depthHint = 0;
            for (let j = i; j < Math.min(i + 40, lines.length); j++) {
                window += "\n" + lines[j];
                if (/\bdo\b/.test(lines[j]))
                    depthHint++;
                if (/\bend\b/.test(lines[j]) && j > i)
                    break;
            }
            if (!/\bnot_if\b/.test(window) && !/\bonly_if\b/.test(window) && !/\bcreates\b/.test(window)) {
                return true;
            }
            void depthHint;
        }
    }
    return false;
}
function packageLatestTip(text) {
    return /action\s+:latest\b/i.test(text) || /:\s*:latest\b/.test(text) || /\bversion\s+['"]:latest['"]/i.test(text);
}
function missingMetadataNameVersion(text) {
    // Only apply when it looks like metadata.rb
    const looksMeta = /\bdepends\s+['"]/i.test(text) ||
        /\bsupports\s+['"]/i.test(text) ||
        /\bmaintainer\b/i.test(text) ||
        /\blicense\s+['"]/i.test(text) ||
        (/\bname\s+['"]/i.test(text) && /\bversion\s+['"]/i.test(text)) ||
        (/\bname\s+['"]/i.test(text) && /\bdepends\b/i.test(text)) ||
        /\bdescription\s+['"]/i.test(text);
    if (!looksMeta && !/\bversion\s+['"]/i.test(text) && !/\bname\s+['"][\w.-]+['"]\s*$/m.test(text)) {
        // If it's clearly a recipe/attrs file, skip
        if (/\binclude_recipe\b/i.test(text) ||
            /\b(?:package|service|template|execute)\s+['"]/i.test(text) ||
            /\b(?:default|override|normal)\s*\[/i.test(text)) {
            return { missingName: false, missingVersion: false };
        }
    }
    if (!looksMeta) {
        // Bare name/version only — still check if name present without version or vice versa when metadata-ish keys exist
        if (!/\bname\s+['"]/i.test(text) && !/\bversion\s+['"]/i.test(text) && !/\bdepends\s+['"]/i.test(text)) {
            return { missingName: false, missingVersion: false };
        }
    }
    const hasName = /(?:^|\n)\s*name\s+['"][^'"]+['"]/i.test(text);
    const hasVersion = /(?:^|\n)\s*version\s+['"][^'"]+['"]/i.test(text);
    // If depends/supports/maintainer present, treat as metadata
    const isMeta = looksMeta ||
        /\bdepends\s+['"]/i.test(text) ||
        /\bsupports\s+['"]/i.test(text) ||
        /\bmaintainer\b/i.test(text);
    if (!isMeta)
        return { missingName: false, missingVersion: false };
    return { missingName: !hasName, missingVersion: !hasVersion };
}
export function lintChef(text) {
    const findings = [];
    const trimmed = (text ?? "").trim();
    if (!trimmed) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Provide non-empty Chef cookbook/recipe/attributes text. This tool only analyzes the string you pass — it never reads the filesystem or runs Chef/knife.",
        });
        return findings;
    }
    if (!looksLikeChef(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "empty_source",
            advice: "No clear Chef patterns found (metadata name/version/depends, resources, include_recipe, node/default attributes). Paste cookbook Ruby DSL text. Educational tip only.",
        });
        return findings;
    }
    const meta = missingMetadataNameVersion(trimmed);
    if (meta.missingName) {
        findings.push({
            severity: "warn",
            rule: "missing_metadata_name",
            advice: "metadata.rb-style text appears to lack `name '...'`. Every cookbook should declare its name. Educational tip only — this tool never runs Chef.",
        });
    }
    if (meta.missingVersion) {
        findings.push({
            severity: "warn",
            rule: "missing_metadata_version",
            advice: "metadata.rb-style text appears to lack `version '...'`. Pin a semantic version for reproducibility. Educational tip only.",
        });
    }
    if (hasPlaintextPassword(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "plaintext_password",
            advice: "Possible plaintext password/secret/token literal in Chef Ruby text. Prefer encrypted data bags, Chef Vault, or CI secrets — never commit credentials. Key/value heuristic only (not an exploit guide).",
        });
    }
    if (executeWithoutGuard(trimmed)) {
        findings.push({
            severity: "info",
            rule: "execute_without_guard",
            advice: "`execute` resource without `not_if` / `only_if` / `creates` may re-run every converge. Prefer idempotent guards or built-in resources. Educational tip only.",
        });
    }
    if (packageLatestTip(trimmed)) {
        findings.push({
            severity: "info",
            rule: "package_latest_tip",
            advice: "Package action/version `:latest` can make converges non-reproducible across time. Prefer pinned package versions when stability matters. Educational tip only.",
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
