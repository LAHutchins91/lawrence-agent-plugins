/**
 * Shared Vagrantfile Ruby DSL text helpers.
 * Pure regex/string heuristics — no vagrant CLI, VM start, network, filesystem follow, or eval.
 */
const MAX_CHARS = 1_048_576;
export function clampText(text) {
    const t = text ?? "";
    if (t.length > MAX_CHARS)
        return t.slice(0, MAX_CHARS);
    return t;
}
/** Strip Ruby # line comments and =begin/=end blocks loosely; keep string contents. */
export function stripCommentsKeepStrings(raw) {
    let s = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
    const out = [];
    let i = 0;
    while (i < s.length) {
        const c = s[i];
        if (c === '"' || c === "'") {
            const q = c;
            out.push(q);
            i++;
            while (i < s.length) {
                if (s[i] === "\\" && q === '"') {
                    out.push(s[i], s[i + 1] ?? "");
                    i += 2;
                    continue;
                }
                if (s[i] === q) {
                    out.push(q);
                    i++;
                    break;
                }
                if (s[i] === "\n" && q === "'") {
                    // unclosed single-quote line — stop
                    break;
                }
                out.push(s[i]);
                i++;
            }
            continue;
        }
        // heredoc-ish skip is out of scope; treat # comments
        if (c === "#") {
            i++;
            while (i < s.length && s[i] !== "\n")
                i++;
            continue;
        }
        // =begin ... =end
        if (c === "=" &&
            s.slice(i, i + 6) === "=begin" &&
            (i === 0 || s[i - 1] === "\n")) {
            i += 6;
            while (i < s.length) {
                if (s[i] === "=" &&
                    s.slice(i, i + 4) === "=end" &&
                    (i === 0 || s[i - 1] === "\n")) {
                    i += 4;
                    break;
                }
                i++;
            }
            out.push(" ");
            continue;
        }
        out.push(c);
        i++;
    }
    return out.join("");
}
function unquote(s) {
    const t = s.trim();
    if ((t.startsWith("'") && t.endsWith("'")) ||
        (t.startsWith('"') && t.endsWith('"'))) {
        return t.slice(1, -1);
    }
    return t;
}
/** Match do...end depth starting at index of 'd' in 'do'. Returns end index after 'end'. */
function findMatchingDoEnd(s, doIndex) {
    // doIndex points at 'd' of \bdo\b
    let i = doIndex + 2;
    let depth = 1;
    while (i < s.length) {
        const c = s[i];
        if (c === '"' || c === "'") {
            const q = c;
            i++;
            while (i < s.length) {
                if (s[i] === "\\" && q === '"') {
                    i += 2;
                    continue;
                }
                if (s[i] === q) {
                    i++;
                    break;
                }
                i++;
            }
            continue;
        }
        if (c === "#") {
            while (i < s.length && s[i] !== "\n")
                i++;
            continue;
        }
        // word boundaries for do / end
        if (/\w/.test(c)) {
            let j = i;
            while (j < s.length && /\w/.test(s[j]))
                j++;
            const word = s.slice(i, j);
            const before = i === 0 ? "" : s[i - 1];
            const after = j < s.length ? s[j] : "";
            const boundaryBefore = i === 0 || !/\w/.test(before);
            const boundaryAfter = j >= s.length || !/\w/.test(after);
            if (boundaryBefore && boundaryAfter) {
                if (word === "do")
                    depth++;
                else if (word === "end") {
                    depth--;
                    if (depth === 0)
                        return j;
                }
            }
            i = j;
            continue;
        }
        i++;
    }
    return -1;
}
function extractAttrAssign(body, attr) {
    // machine.vm.box = "..."  OR  config.vm.box = '...'
    const re = new RegExp(`(?:^|\\n)\\s*(?:\\w+\\.)?vm\\.${attr}\\s*=\\s*(['"][^'"]+['"])`, "i");
    const m = re.exec(body);
    return m ? unquote(m[1]) : undefined;
}
const KNOWN_PROVIDERS = [
    "virtualbox",
    "vmware",
    "libvirt",
    "docker",
    "hyperv",
];
function normalizeProvider(raw) {
    const t = raw.toLowerCase().trim();
    if (!t)
        return undefined;
    if (t === "vmware_desktop" || t === "vmware_fusion" || t === "vmware_workstation") {
        return "vmware";
    }
    if (KNOWN_PROVIDERS.includes(t))
        return t;
    // still surface unknown provider strings that look like provider blocks
    if (/^[a-z][a-z0-9_-]*$/i.test(t)) {
        // only return known set per tool contract
        return undefined;
    }
    return undefined;
}
const PROVISION_TYPES = [
    "shell",
    "ansible",
    "chef",
    "puppet",
    "docker",
    "file",
];
function normalizeProvisionType(raw) {
    const t = raw.toLowerCase().trim();
    if (PROVISION_TYPES.includes(t))
        return t;
    if (t === "ansible_local")
        return "ansible";
    if (t === "chef_solo" || t === "chef_client" || t === "chef_zero" || t === "chef_apply") {
        return "chef";
    }
    if (t === "puppet_server" || t === "puppet_agent")
        return "puppet";
    return undefined;
}
/** Extract box / define inventory from Vagrantfile text. */
export function extractBoxes(text) {
    const trimmed = clampText(text).trim();
    if (!trimmed)
        return [];
    const src = stripCommentsKeepStrings(trimmed);
    const boxes = [];
    const seen = new Set();
    const push = (info) => {
        const key = `${info.name ?? ""}|${info.box ?? ""}|${info.version ?? ""}`;
        if (seen.has(key))
            return;
        if (!info.name && !info.box && !info.version)
            return;
        seen.add(key);
        boxes.push(info);
    };
    // config.vm.define "web" do |web| ... end
    const defineRe = /\.vm\.define\s+(['"][^'"]+['"])(?:\s*,\s*[^\n]*?)?\s+do\b/g;
    let m;
    const defineSpans = [];
    while ((m = defineRe.exec(src)) !== null) {
        const name = unquote(m[1]);
        const doIdx = m.index + m[0].length - 2; // points at 'd' of do
        const endIdx = findMatchingDoEnd(src, doIdx);
        const body = endIdx >= 0 ? src.slice(doIdx, endIdx) : "";
        defineSpans.push({ name, body });
    }
    for (const d of defineSpans) {
        const info = { name: d.name };
        const box = extractAttrAssign(d.body, "box");
        const version = extractAttrAssign(d.body, "box_version");
        if (box)
            info.box = box;
        if (version)
            info.version = version;
        // also box_url presence does not change shape; ignore url in output
        push(info);
    }
    // Top-level / any remaining vm.box assignments not already captured as sole define
    const boxRe = /(?:^|\n)\s*(?:(\w+)\.)?vm\.box\s*=\s*(['"][^'"]+['"])/gi;
    const versionRe = /(?:^|\n)\s*(?:(\w+)\.)?vm\.box_version\s*=\s*(['"][^'"]+['"])/gi;
    const topBoxes = [];
    while ((m = boxRe.exec(src)) !== null) {
        topBoxes.push({
            prefix: m[1] || undefined,
            box: unquote(m[2]),
            index: m.index,
        });
    }
    const topVersions = [];
    while ((m = versionRe.exec(src)) !== null) {
        topVersions.push({
            prefix: m[1] || undefined,
            version: unquote(m[2]),
        });
    }
    // If we have defines, attach unmatched top-level config.vm.box (prefix config or none)
    // that isn't inside a define body we already read
    const globalBox = topBoxes.find((b) => !b.prefix || b.prefix === "config");
    const globalVer = topVersions.find((v) => !v.prefix || v.prefix === "config");
    if (defineSpans.length === 0) {
        if (globalBox || globalVer) {
            const info = {};
            if (globalBox)
                info.box = globalBox.box;
            if (globalVer)
                info.version = globalVer.version;
            push(info);
        }
        else {
            // machine-prefixed without define
            for (const b of topBoxes) {
                const info = { box: b.box };
                if (b.prefix && b.prefix !== "config")
                    info.name = b.prefix;
                const ver = topVersions.find((v) => (v.prefix ?? "config") === (b.prefix ?? "config"));
                if (ver)
                    info.version = ver.version;
                push(info);
            }
        }
    }
    else {
        // Fill defines that lacked box with global config.vm.box
        if (globalBox) {
            for (const b of boxes) {
                if (!b.box)
                    b.box = globalBox.box;
            }
            // Also if no define had a box and we only pushed names, ensure box set
        }
        if (globalVer) {
            for (const b of boxes) {
                if (!b.version)
                    b.version = globalVer.version;
            }
        }
        // If defines exist but none got a box and no global — keep names only
        // If there is a global box and zero defines somehow skipped — already handled
        // Extra: define names without any box entry yet (shouldn't happen)
        for (const d of defineSpans) {
            if (!boxes.some((b) => b.name === d.name)) {
                push({ name: d.name });
            }
        }
        // If only defines with no box/version and we have global, already filled.
        // Also push a nameless entry only when there are no defines — done above.
    }
    // box_url alone does not create an entry without box name — skip
    return boxes;
}
/** Detect provider names from provider blocks and known tokens. */
export function extractProviders(text) {
    const trimmed = clampText(text).trim();
    if (!trimmed)
        return [];
    const src = stripCommentsKeepStrings(trimmed);
    const found = new Set();
    // config.vm.provider "virtualbox" do |vb|
    const provRe = /\.vm\.provider\s+(['"][^'"]+['"])/gi;
    let m;
    while ((m = provRe.exec(src)) !== null) {
        const n = normalizeProvider(unquote(m[1]));
        if (n)
            found.add(n);
    }
    // ENV["VAGRANT_DEFAULT_PROVIDER"] = "libvirt" style literals nearby
    const envRe = /VAGRANT_DEFAULT_PROVIDER['"]?\s*\]?\s*(?:=|,)\s*['"]([^'"]+)['"]/gi;
    while ((m = envRe.exec(src)) !== null) {
        const n = normalizeProvider(m[1]);
        if (n)
            found.add(n);
    }
    // Loose mention of provider config helpers: vb.customize, docker.image, etc.
    if (/\bvb\.|virtualbox/i.test(src) && /\.vm\.provider\b/i.test(src) === false) {
        // only add from explicit keywords if provider block missing but vb. seen with Vagrant.configure
        if (/\bVagrant\.configure\b/.test(src) && /\bvb\./.test(src)) {
            found.add("virtualbox");
        }
    }
    // docker.vm / config.vm.provider :docker symbol form
    const symRe = /\.vm\.provider\s+:([a-zA-Z_][\w]*)/g;
    while ((m = symRe.exec(src)) !== null) {
        const n = normalizeProvider(m[1]);
        if (n)
            found.add(n);
    }
    return [...found];
}
/** Extract provisioner type/name hints. */
export function extractProvisions(text) {
    const trimmed = clampText(text).trim();
    if (!trimmed)
        return [];
    const src = stripCommentsKeepStrings(trimmed);
    const provisions = [];
    const seen = new Set();
    const push = (info) => {
        const key = `${info.type ?? ""}|${info.name ?? ""}`;
        if (seen.has(key))
            return;
        if (!info.type && !info.name)
            return;
        seen.add(key);
        provisions.push(info);
    };
    // config.vm.provision "shell", name: "bootstrap", inline: "..."
    // config.vm.provision "ansible" do |ansible|
    // config.vm.provision :shell do |s|
    const provRe = /\.vm\.provision\s+(?:(['"][^'"]+['"])|:([a-zA-Z_][\w]*))((?:\s*,\s*[^\n]+)?)/gi;
    let m;
    while ((m = provRe.exec(src)) !== null) {
        const rawType = m[1] ? unquote(m[1]) : m[2];
        const type = normalizeProvisionType(rawType);
        const rest = m[3] ?? "";
        let name;
        const nameM = /(?:^|,)\s*name:\s*(['"][^'"]+['"])/i.exec(rest);
        if (nameM)
            name = unquote(nameM[1]);
        // Also: provision "shell", run: "always" — type only
        if (type || name) {
            const info = {};
            if (type)
                info.type = type;
            else if (rawType) {
                // unknown type — skip per contract of known types only? Keep if matches loosely
                // Spec: shell, ansible, chef, puppet, docker, file — skip unknowns
            }
            if (name)
                info.name = name;
            if (info.type || info.name)
                push(info);
        }
    }
    return provisions;
}
function looksLikeVagrant(text) {
    return (/\bVagrant\.configure\b/.test(text) ||
        /\.vm\.box\s*=/.test(text) ||
        /\.vm\.define\b/.test(text) ||
        /\.vm\.provider\b/.test(text) ||
        /\.vm\.provision\b/.test(text) ||
        /\.vm\.network\b/.test(text) ||
        /\.vm\.synced_folder\b/.test(text));
}
function hasPlaintextPassword(text) {
    // config.ssh.password = "..." or password: "..." in provision/network
    return (/(?:\.ssh\.password|password)\s*=\s*['"][^'"]{3,}['"]/i.test(text) ||
        /(?:^|,)\s*password:\s*['"][^'"]{3,}['"]/i.test(text));
}
function hasPrivateNetwork(text) {
    return /\.vm\.network\s+['"]private_network['"]/i.test(text);
}
function hasSyncedFolderDot(text) {
    // synced_folder ".", "/vagrant" or synced_folder '.', ...
    return /\.vm\.synced_folder\s+['"]\.['"]/i.test(text);
}
function hasBox(text) {
    return extractBoxes(text).some((b) => !!b.box) || /\.vm\.box\s*=/.test(text);
}
export function lintVagrant(text) {
    const findings = [];
    const trimmed = clampText(text).trim();
    if (!trimmed) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Provide non-empty Vagrantfile Ruby DSL text. This tool only analyzes the string you pass — it never runs vagrant, starts VMs, or reads the filesystem.",
        });
        return findings;
    }
    if (!looksLikeVagrant(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "empty_source",
            advice: "No clear Vagrantfile patterns found (`Vagrant.configure`, `vm.box`, `vm.define`, `vm.provider`, `vm.provision`). Paste Vagrantfile text. Educational tip only.",
        });
        return findings;
    }
    if (!hasBox(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "missing_box",
            advice: "No `vm.box = \"...\"` assignment found. Vagrant typically needs a box name (or box_url) before `vagrant up`. Educational tip only — this tool never runs vagrant.",
        });
    }
    if (hasPlaintextPassword(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "plaintext_password",
            advice: "Possible plaintext password literal in Vagrantfile text (`ssh.password` or `password:`). Prefer SSH keys and secrets from the environment — never commit credentials. Attribute-name heuristic only (not an exploit guide).",
        });
    }
    if (hasPrivateNetwork(trimmed)) {
        findings.push({
            severity: "info",
            rule: "insecure_private_network",
            advice: "Private network tip: `vm.network \"private_network\"` is convenient for lab VMs but can expose services on host-only/bridged segments. Prefer forwarded ports and firewall rules when sharing a host. Educational tip only — not an exploit guide.",
        });
    }
    if (hasSyncedFolderDot(trimmed)) {
        findings.push({
            severity: "info",
            rule: "synced_folder_dot",
            advice: "Synced folder tip: `vm.synced_folder \".\", ...` mounts the project root into the guest. Avoid syncing secrets, `.git`, or host-only credentials into untrusted VMs; narrow the folder and use rsync excludes when practical. Educational tip only — not an exploit guide.",
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
