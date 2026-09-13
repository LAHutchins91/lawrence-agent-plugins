/**
 * Shared Nomad job HCL text helpers.
 * Pure regex/string heuristics — no nomad CLI, cluster, network, filesystem follow, or eval.
 */
const MAX_CHARS = 1_048_576;
export function clampText(text) {
    const t = text ?? "";
    if (t.length > MAX_CHARS)
        return t.slice(0, MAX_CHARS);
    return t;
}
/** Strip hash, line, and block comments loosely; keep string contents. */
export function stripCommentsKeepStrings(raw) {
    let s = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
    const out = [];
    let i = 0;
    while (i < s.length) {
        if (s[i] === '"') {
            out.push('"');
            i++;
            while (i < s.length) {
                if (s[i] === "\\") {
                    out.push(s[i], s[i + 1] ?? "");
                    i += 2;
                    continue;
                }
                if (s[i] === '"') {
                    out.push('"');
                    i++;
                    break;
                }
                if (s[i] === "\n")
                    break;
                out.push(s[i]);
                i++;
            }
            continue;
        }
        if (s[i] === "/" && s[i + 1] === "/") {
            i += 2;
            while (i < s.length && s[i] !== "\n")
                i++;
            continue;
        }
        if (s[i] === "#") {
            i++;
            while (i < s.length && s[i] !== "\n")
                i++;
            continue;
        }
        if (s[i] === "/" && s[i + 1] === "*") {
            i += 2;
            while (i < s.length && !(s[i] === "*" && s[i + 1] === "/"))
                i++;
            if (i < s.length)
                i += 2;
            out.push(" ");
            continue;
        }
        out.push(s[i]);
        i++;
    }
    return out.join("");
}
function findMatchingBrace(s, openBraceIndex) {
    let depth = 0;
    for (let i = openBraceIndex; i < s.length; i++) {
        const c = s[i];
        if (c === "{")
            depth++;
        else if (c === "}") {
            depth--;
            if (depth === 0)
                return i;
        }
    }
    return -1;
}
function unescapeHclString(value) {
    return value.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
}
function extractStringAttr(body, key) {
    const re = new RegExp(`(?:^|\\n)\\s*${key}\\s*=\\s*"((?:[^"\\\\]|\\\\.)*)"`, "i");
    const m = re.exec(body);
    return m ? unescapeHclString(m[1]) : undefined;
}
function extractNumberAttr(body, key) {
    const re = new RegExp(`(?:^|\\n)\\s*${key}\\s*=\\s*(\\d+)\\b`, "i");
    const m = re.exec(body);
    if (!m)
        return undefined;
    const n = Number(m[1]);
    return Number.isFinite(n) ? n : undefined;
}
function extractStringList(body, key) {
    const re = new RegExp(`(?:^|\\n)\\s*${key}\\s*=\\s*\\[([^\\]]*)]`, "i");
    const m = re.exec(body);
    if (!m)
        return [];
    const inner = m[1];
    const out = [];
    const strRe = /"((?:[^"\\]|\\.)*)"/g;
    let sm;
    while ((sm = strRe.exec(inner)) !== null) {
        out.push(unescapeHclString(sm[1]));
    }
    return out;
}
function extractBoolAttr(body, key) {
    const re = new RegExp(`(?:^|\\n)\\s*${key}\\s*=\\s*(true|false)\\b`, "i");
    const m = re.exec(body);
    if (!m)
        return undefined;
    return m[1].toLowerCase() === "true";
}
/** Extract job blocks: id/name, type, datacenters, namespace. */
export function extractJobs(text) {
    const trimmed = clampText(text).trim();
    if (!trimmed)
        return [];
    const jobs = [];
    const seen = new Set();
    const push = (info) => {
        const key = `${info.id ?? ""}|${info.type ?? ""}|${(info.datacenters ?? []).join(",")}|${info.namespace ?? ""}`;
        if (seen.has(key))
            return;
        seen.add(key);
        jobs.push(info);
    };
    const hcl = stripCommentsKeepStrings(trimmed);
    // job "name" { ... }
    const jobRe = /\bjob\s+"([^"]+)"\s*\{/g;
    let m;
    while ((m = jobRe.exec(hcl)) !== null) {
        const id = m[1];
        const open = m.index + m[0].length - 1;
        const close = findMatchingBrace(hcl, open);
        const body = close >= 0 ? hcl.slice(open + 1, close) : "";
        const info = { id };
        const type = extractStringAttr(body, "type");
        if (type)
            info.type = type;
        const dcs = extractStringList(body, "datacenters");
        if (dcs.length)
            info.datacenters = dcs;
        const ns = extractStringAttr(body, "namespace");
        if (ns)
            info.namespace = ns;
        // Also: id = "..." override (rare)
        const idAttr = extractStringAttr(body, "id");
        if (idAttr)
            info.id = idAttr;
        push(info);
    }
    return jobs;
}
function extractNetworksFromBody(body) {
    const networks = [];
    const netRe = /\bnetwork\s*\{/g;
    let m;
    while ((m = netRe.exec(body)) !== null) {
        const open = m.index + m[0].length - 1;
        const close = findMatchingBrace(body, open);
        const netBody = close >= 0 ? body.slice(open + 1, close) : "";
        const info = {};
        const mode = extractStringAttr(netBody, "mode");
        if (mode)
            info.mode = mode;
        const ports = [];
        // port "http" { ... } or port "db" {}
        const portRe = /\bport\s+"([^"]+)"\s*\{/g;
        let pm;
        while ((pm = portRe.exec(netBody)) !== null) {
            ports.push(pm[1]);
        }
        // Also: ports = ["http", "db"] rare
        const listPorts = extractStringList(netBody, "ports");
        for (const p of listPorts) {
            if (!ports.includes(p))
                ports.push(p);
        }
        if (ports.length)
            info.ports = ports;
        if (info.mode || info.ports)
            networks.push(info);
        else
            networks.push({});
    }
    return networks;
}
/** Extract group blocks: name, count, network ports. */
export function extractGroups(text) {
    const trimmed = clampText(text).trim();
    if (!trimmed)
        return [];
    const groups = [];
    const seen = new Set();
    const push = (info) => {
        const key = `${info.name ?? ""}|${info.count ?? ""}`;
        if (seen.has(key) && key !== "|")
            return;
        if (key !== "|")
            seen.add(key);
        groups.push(info);
    };
    const hcl = stripCommentsKeepStrings(trimmed);
    const groupRe = /\bgroup\s+"([^"]+)"\s*\{/g;
    let m;
    while ((m = groupRe.exec(hcl)) !== null) {
        const name = m[1];
        const open = m.index + m[0].length - 1;
        const close = findMatchingBrace(hcl, open);
        const body = close >= 0 ? hcl.slice(open + 1, close) : "";
        const info = { name };
        const count = extractNumberAttr(body, "count");
        if (count !== undefined)
            info.count = count;
        const networks = extractNetworksFromBody(body);
        if (networks.length)
            info.networks = networks;
        push(info);
    }
    return groups;
}
const SECRET_KEY_RE = /(?:secret|password|passwd|token|api[_-]?key|access[_-]?key|private[_-]?key|auth|credential|client[_-]?secret)/i;
/** Extract task blocks: name, driver, image; collect secret-like env key names. */
export function extractTasks(text) {
    const trimmed = clampText(text).trim();
    if (!trimmed)
        return { tasks: [], secretKeyNames: [] };
    const tasks = [];
    const secretKeyNames = [];
    const seenT = new Set();
    const seenS = new Set();
    const pushT = (info) => {
        const key = `${info.name ?? ""}|${info.driver ?? ""}|${info.image ?? ""}`;
        if (seenT.has(key))
            return;
        seenT.add(key);
        tasks.push(info);
    };
    const pushS = (k) => {
        if (!k || seenS.has(k))
            return;
        seenS.add(k);
        secretKeyNames.push(k);
    };
    const hcl = stripCommentsKeepStrings(trimmed);
    const taskRe = /\btask\s+"([^"]+)"\s*\{/g;
    let m;
    while ((m = taskRe.exec(hcl)) !== null) {
        const name = m[1];
        const open = m.index + m[0].length - 1;
        const close = findMatchingBrace(hcl, open);
        const body = close >= 0 ? hcl.slice(open + 1, close) : "";
        const info = { name };
        const driver = extractStringAttr(body, "driver");
        if (driver)
            info.driver = driver;
        // config { image = "..." } for docker; command/args for exec; class for java
        const configRe = /\bconfig\s*\{/g;
        let cm;
        while ((cm = configRe.exec(body)) !== null) {
            const cOpen = cm.index + cm[0].length - 1;
            const cClose = findMatchingBrace(body, cOpen);
            const cBody = cClose >= 0 ? body.slice(cOpen + 1, cClose) : "";
            const image = extractStringAttr(cBody, "image");
            if (image)
                info.image = image;
            // Also: image = "..." at task top-level (nonstandard but seen)
        }
        if (!info.image) {
            const topImage = extractStringAttr(body, "image");
            if (topImage)
                info.image = topImage;
        }
        // env { KEY = "value" } — collect key names; flag secret-like names
        const envRe = /\benv\s*\{/g;
        let em;
        while ((em = envRe.exec(body)) !== null) {
            const eOpen = em.index + em[0].length - 1;
            const eClose = findMatchingBrace(body, eOpen);
            const eBody = eClose >= 0 ? body.slice(eOpen + 1, eClose) : "";
            const keyRe = /(?:^|\n)\s*([A-Za-z_][A-Za-z0-9_]*)\s*=/g;
            let km;
            while ((km = keyRe.exec(eBody)) !== null) {
                const k = km[1];
                if (SECRET_KEY_RE.test(k))
                    pushS(k);
            }
        }
        // template destination / vault env naming sometimes appears as env vars via meta
        // Also catch: env = { "KEY" = "..." } HCL2 map form
        const envMapRe = /\benv\s*=\s*\{([^}]*)\}/g;
        let mm;
        while ((mm = envMapRe.exec(body)) !== null) {
            const inner = mm[1];
            const keyRe = /"([A-Za-z_][A-Za-z0-9_]*)"\s*=/g;
            let km;
            while ((km = keyRe.exec(inner)) !== null) {
                const k = km[1];
                if (SECRET_KEY_RE.test(k))
                    pushS(k);
            }
        }
        pushT(info);
    }
    return { tasks, secretKeyNames };
}
function looksLikeNomad(text) {
    return (/\bjob\s+"[^"]+"\s*\{/.test(text) ||
        /\bgroup\s+"[^"]+"\s*\{/.test(text) ||
        /\btask\s+"[^"]+"\s*\{/.test(text) ||
        /\bdriver\s*=\s*"(?:docker|exec|java|raw_exec|podman|qemu)"/.test(text) ||
        extractJobs(text).length > 0 ||
        extractGroups(text).length > 0 ||
        extractTasks(text).tasks.length > 0);
}
function hasLatestTag(text) {
    return (/:\s*latest["'\s]/i.test(text) ||
        /["'][^"']*:latest["']/i.test(text) ||
        /\bimage\s*=\s*"[^"]*:latest"/i.test(text));
}
function hasPrivilegedOrHostNetwork(text) {
    return (/\bprivileged\s*=\s*true\b/i.test(text) ||
        /\bmode\s*=\s*"host"/i.test(text) ||
        /\bnetwork_mode\s*=\s*"host"/i.test(text));
}
function hasPlaintextSecrets(text) {
    // env KEY = "literal" where KEY looks secret, or password/secret/token attrs with literals
    const hcl = stripCommentsKeepStrings(text);
    // Attribute form: password = "value"
    if (/(?:password|passwd|secret|token|api[_-]?key|access[_-]?key|client[_-]?secret)\s*=\s*"(?!\{\{|\$\{|env\()[^"]{3,}"/i.test(hcl)) {
        return true;
    }
    // env block with secret-named keys and non-empty string values
    const envRe = /\benv\s*\{/g;
    let m;
    while ((m = envRe.exec(hcl)) !== null) {
        const open = m.index + m[0].length - 1;
        const close = findMatchingBrace(hcl, open);
        const body = close >= 0 ? hcl.slice(open + 1, close) : "";
        const pairRe = /(?:^|\n)\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*"((?:[^"\\]|\\.)*)"/g;
        let pm;
        while ((pm = pairRe.exec(body)) !== null) {
            const k = pm[1];
            const v = pm[2];
            if (SECRET_KEY_RE.test(k) && v.length >= 3 && !/^\$\{/.test(v) && !/^\{\{/.test(v)) {
                return true;
            }
        }
    }
    return false;
}
export function lintNomad(text) {
    const findings = [];
    const trimmed = clampText(text).trim();
    if (!trimmed) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Provide non-empty Nomad job HCL text. This tool only analyzes the string you pass — it never runs nomad, talks to a cluster, or reads the filesystem.",
        });
        return findings;
    }
    if (!looksLikeNomad(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "empty_source",
            advice: "No clear Nomad job patterns found (`job`/`group`/`task` blocks). Paste Nomad job HCL text. Educational tip only.",
        });
        return findings;
    }
    const jobs = extractJobs(trimmed);
    const tasks = extractTasks(trimmed).tasks;
    const hasJob = jobs.length > 0 || /\bjob\s+"/.test(trimmed);
    const hasTask = tasks.length > 0 || /\btask\s+"/.test(trimmed);
    if (!hasJob) {
        findings.push({
            severity: "warn",
            rule: "missing_job",
            advice: "No `job \"name\" { ... }` block found. Nomad job specs usually start with a job block. Educational tip only — this tool never runs nomad.",
        });
    }
    if (hasJob && !hasTask) {
        findings.push({
            severity: "warn",
            rule: "missing_task",
            advice: "Job found but no `task \"name\" { ... }` block. Groups typically contain at least one task. Educational tip only.",
        });
    }
    if (hasLatestTag(trimmed)) {
        findings.push({
            severity: "info",
            rule: "latest_tag",
            advice: "Docker image uses `:latest`, which can make deployments non-reproducible. Prefer pinned digests or version tags. Educational tip only.",
        });
    }
    if (hasPrivilegedOrHostNetwork(trimmed)) {
        findings.push({
            severity: "info",
            rule: "privileged_or_host_network",
            advice: "Privileged or host-network tip: `privileged = true` or `mode = \"host\"` widens the task attack surface. Prefer bridge/CNI and drop capabilities when practical. Educational tip only — not an exploit guide.",
        });
    }
    if (hasPlaintextSecrets(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "plaintext_secrets",
            advice: "Possible plaintext secret/password/token literal in Nomad job text (env keys or attrs). Prefer Nomad variables, Vault, or workload identity — never commit credentials. Attribute/env-name heuristic only (not an exploit guide).",
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
