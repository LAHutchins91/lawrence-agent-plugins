/**
 * Shared Ansible playbook/role YAML text helpers.
 * Pure YAML string heuristics — no ansible CLI, SSH, network, filesystem follow, or eval.
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
    if (typeof v === "object") {
        try {
            return JSON.stringify(v);
        }
        catch {
            return undefined;
        }
    }
    const s = String(v).trim();
    return s === "" ? undefined : s;
}
export function boolOrStrField(map, key) {
    if (!map)
        return undefined;
    const v = map[key];
    if (v === undefined || v === null)
        return undefined;
    if (typeof v === "boolean")
        return v;
    if (typeof v === "number")
        return v !== 0;
    if (typeof v === "string") {
        const t = v.trim().toLowerCase();
        if (t === "yes" || t === "true")
            return true;
        if (t === "no" || t === "false")
            return false;
        return v.trim() === "" ? undefined : v.trim();
    }
    return undefined;
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
function hostsToString(hosts) {
    if (hosts === undefined || hosts === null)
        return undefined;
    if (typeof hosts === "string") {
        const t = hosts.trim();
        return t === "" ? undefined : t;
    }
    if (Array.isArray(hosts)) {
        const parts = hosts
            .map((h) => (typeof h === "string" ? h.trim() : String(h)))
            .filter(Boolean);
        return parts.length ? parts.join(",") : undefined;
    }
    try {
        return JSON.stringify(hosts);
    }
    catch {
        return undefined;
    }
}
function playFromEntry(raw) {
    const map = asMap(raw);
    if (!map)
        return null;
    // A play typically has hosts, or name+tasks/roles — skip pure task dicts lacking hosts/name
    const name = strField(map, "name") ?? strField(map, "Name");
    const hosts = hostsToString(map.hosts ?? map.Hosts);
    const become = boolOrStrField(map, "become") ?? boolOrStrField(map, "Become");
    const gatherFacts = boolOrStrField(map, "gather_facts") ??
        boolOrStrField(map, "gatherFacts") ??
        boolOrStrField(map, "GatherFacts");
    const strategy = strField(map, "strategy") ?? strField(map, "Strategy");
    const looksLikePlay = hosts !== undefined ||
        map.tasks !== undefined ||
        map.roles !== undefined ||
        map.handlers !== undefined ||
        map.pre_tasks !== undefined ||
        map.post_tasks !== undefined ||
        map.vars_files !== undefined ||
        (name !== undefined &&
            (map.become !== undefined || map.gather_facts !== undefined));
    if (!looksLikePlay && !hosts && !name)
        return null;
    if (!looksLikePlay)
        return null;
    const info = {};
    if (name)
        info.name = name;
    if (hosts)
        info.hosts = hosts;
    if (become !== undefined)
        info.become = become;
    if (gatherFacts !== undefined)
        info.gatherFacts = gatherFacts;
    if (strategy)
        info.strategy = strategy;
    return info;
}
/** Extract plays from playbook YAML (top-level list or single play map). */
export function extractPlays(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed)
        return [];
    const plays = [];
    const seen = new Set();
    const push = (info) => {
        const key = `${info.name ?? ""}|${info.hosts ?? ""}|${String(info.become)}|${String(info.gatherFacts)}|${info.strategy ?? ""}`;
        if (seen.has(key))
            return;
        seen.add(key);
        plays.push(info);
    };
    const docs = parseYamlDocs(trimmed);
    for (const doc of docs) {
        if (Array.isArray(doc)) {
            for (const entry of doc) {
                const info = playFromEntry(entry);
                if (info)
                    push(info);
            }
        }
        else {
            const info = playFromEntry(doc);
            if (info)
                push(info);
        }
    }
    // Regex fallback for partial / broken YAML
    if (plays.length === 0) {
        const hostRe = /(?:^|\n)[ \t]*hosts\s*:\s*([^\n#]+)/gi;
        let m;
        while ((m = hostRe.exec(trimmed)) !== null) {
            const hosts = m[1].trim().replace(/^["']|["']$/g, "");
            // look backwards for name
            const before = trimmed.slice(Math.max(0, m.index - 200), m.index);
            const nameM = before.match(/(?:^|\n)[ \t]*-\s*name\s*:\s*(.+?)(?:\n|$)/i);
            const window = trimmed.slice(m.index, m.index + 400);
            const becomeM = window.match(/\bbecome\s*:\s*(yes|true|no|false|\w+)/i);
            const gfM = window.match(/\bgather_facts\s*:\s*(yes|true|no|false|\w+)/i);
            const stratM = window.match(/\bstrategy\s*:\s*([^\s#]+)/i);
            const info = { hosts };
            if (nameM)
                info.name = nameM[1].trim().replace(/^["']|["']$/g, "");
            if (becomeM) {
                const b = becomeM[1].toLowerCase();
                info.become = b === "yes" || b === "true" ? true : b === "no" || b === "false" ? false : becomeM[1];
            }
            if (gfM) {
                const g = gfM[1].toLowerCase();
                info.gatherFacts = g === "yes" || g === "true" ? true : g === "no" || g === "false" ? false : gfM[1];
            }
            if (stratM)
                info.strategy = stratM[1];
            push(info);
        }
    }
    return plays;
}
function roleNameFromEntry(entry) {
    if (typeof entry === "string") {
        const t = entry.trim();
        return t === "" ? undefined : t;
    }
    const map = asMap(entry);
    if (!map)
        return undefined;
    return (strField(map, "role") ??
        strField(map, "name") ??
        strField(map, "Role") ??
        strField(map, "Name"));
}
function collectRolesFromTasks(tasks, into) {
    if (!Array.isArray(tasks))
        return;
    for (const t of tasks) {
        const map = asMap(t);
        if (!map)
            continue;
        for (const key of ["import_role", "include_role", "ansible.builtin.import_role", "ansible.builtin.include_role"]) {
            const roleBlock = asMap(map[key]);
            if (roleBlock) {
                const n = strField(roleBlock, "name") ?? strField(roleBlock, "role");
                if (n)
                    into.add(n);
            }
            else if (typeof map[key] === "string") {
                const n = String(map[key]).trim();
                if (n)
                    into.add(n);
            }
        }
        // Nested block/rescue/always
        collectRolesFromTasks(map.block, into);
        collectRolesFromTasks(map.rescue, into);
        collectRolesFromTasks(map.always, into);
    }
}
function collectRolesFromPlay(play, into) {
    const roles = play.roles ?? play.Roles;
    if (Array.isArray(roles)) {
        for (const entry of roles) {
            const n = roleNameFromEntry(entry);
            if (n)
                into.add(n);
        }
    }
    collectRolesFromTasks(play.tasks, into);
    collectRolesFromTasks(play.pre_tasks, into);
    collectRolesFromTasks(play.post_tasks, into);
    collectRolesFromTasks(play.handlers, into);
}
/** Extract role names from roles:, import_role, include_role, role: name. */
export function extractRoles(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed)
        return [];
    const into = new Set();
    const docs = parseYamlDocs(trimmed);
    for (const doc of docs) {
        if (Array.isArray(doc)) {
            for (const entry of doc) {
                const map = asMap(entry);
                if (map)
                    collectRolesFromPlay(map, into);
            }
        }
        else {
            const map = asMap(doc);
            if (map) {
                // Could be a playbook play or a bare roles list document
                collectRolesFromPlay(map, into);
                if (Array.isArray(map.roles)) {
                    for (const entry of map.roles) {
                        const n = roleNameFromEntry(entry);
                        if (n)
                            into.add(n);
                    }
                }
            }
        }
    }
    // Regex fallback
    if (into.size === 0) {
        const listItemRe = /(?:^|\n)[ \t]+-\s*(?:role\s*:\s*)?([A-Za-z0-9_.][\w.-]*)\s*(?:#.*)?$/gm;
        const rolesBlock = trimmed.match(/(?:^|\n)[ \t]*roles\s*:\s*\n([\s\S]*?)(?=\n[ \t]*(?:tasks|handlers|vars|pre_tasks|post_tasks|become|gather_facts|hosts|name)\s*:|\n---|\n[A-Za-z_][\w]*\s*:|$)/i);
        if (rolesBlock) {
            let m;
            const body = rolesBlock[1];
            const re = /-\s*(?:role\s*:\s*|name\s*:\s*)?["']?([A-Za-z0-9_.][\w.-]*)["']?/g;
            while ((m = re.exec(body)) !== null) {
                into.add(m[1]);
            }
        }
        const importRe = /\b(?:import_role|include_role|ansible\.builtin\.(?:import_role|include_role))\s*:\s*(?:\n[ \t]+name\s*:\s*["']?([^\s"'#]+)["']?|["']?([^\s"'#]+)["']?)/gi;
        let im;
        while ((im = importRe.exec(trimmed)) !== null) {
            const n = (im[1] || im[2] || "").trim();
            if (n)
                into.add(n);
        }
        // silence unused
        void listItemRe;
    }
    return [...into];
}
const SECRET_KEY_RE = /(?:^|[_.-])(password|passwd|secret|token|api[_-]?key|access[_-]?key|private[_-]?key|auth[_-]?token|client[_-]?secret)(?:$|[_.-])/i;
function isSecretKeyName(name) {
    return SECRET_KEY_RE.test(name) || /^(password|passwd|secret|token)$/i.test(name);
}
function collectVarKeys(obj, into, secrets) {
    const map = asMap(obj);
    if (!map)
        return;
    for (const key of Object.keys(map)) {
        into.add(key);
        if (isSecretKeyName(key))
            secrets.add(key);
    }
}
function walkTasksForSetFact(tasks, into, secrets) {
    if (!Array.isArray(tasks))
        return;
    for (const t of tasks) {
        const map = asMap(t);
        if (!map)
            continue;
        for (const key of ["set_fact", "ansible.builtin.set_fact"]) {
            if (map[key] !== undefined)
                collectVarKeys(map[key], into, secrets);
        }
        walkTasksForSetFact(map.block, into, secrets);
        walkTasksForSetFact(map.rescue, into, secrets);
        walkTasksForSetFact(map.always, into, secrets);
    }
}
function collectVarsFromPlay(play, vars, secrets, varsFiles) {
    collectVarKeys(play.vars, vars, secrets);
    collectVarKeys(play.vars_prompt, vars, secrets);
    const vf = play.vars_files ?? play.vars_files;
    if (Array.isArray(play.vars_files)) {
        for (const f of play.vars_files) {
            if (typeof f === "string" && f.trim())
                varsFiles.add(f.trim());
            else if (Array.isArray(f)) {
                for (const inner of f) {
                    if (typeof inner === "string" && inner.trim())
                        varsFiles.add(inner.trim());
                }
            }
        }
    }
    else if (typeof play.vars_files === "string" && play.vars_files.trim()) {
        varsFiles.add(play.vars_files.trim());
    }
    void vf;
    walkTasksForSetFact(play.tasks, vars, secrets);
    walkTasksForSetFact(play.pre_tasks, vars, secrets);
    walkTasksForSetFact(play.post_tasks, vars, secrets);
    walkTasksForSetFact(play.handlers, vars, secrets);
    // roles entries may have vars:
    if (Array.isArray(play.roles)) {
        for (const entry of play.roles) {
            const rm = asMap(entry);
            if (rm)
                collectVarKeys(rm.vars, vars, secrets);
        }
    }
}
/** Extract vars / vars_files / set_fact key names; flag secret-ish key names only. */
export function extractVars(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed)
        return { vars: [], secretKeyNames: [], varsFiles: [] };
    const vars = new Set();
    const secrets = new Set();
    const varsFiles = new Set();
    const docs = parseYamlDocs(trimmed);
    for (const doc of docs) {
        if (Array.isArray(doc)) {
            for (const entry of doc) {
                const map = asMap(entry);
                if (map)
                    collectVarsFromPlay(map, vars, secrets, varsFiles);
            }
        }
        else {
            const map = asMap(doc);
            if (map)
                collectVarsFromPlay(map, vars, secrets, varsFiles);
        }
    }
    // Regex fallback for key names under vars: / set_fact:
    if (vars.size === 0) {
        const blockRe = /(?:^|\n)[ \t]*(?:vars|set_fact|ansible\.builtin\.set_fact)\s*:\s*\n((?:[ \t]+.+\n?)+)/gi;
        let m;
        while ((m = blockRe.exec(trimmed)) !== null) {
            const body = m[1];
            const keyRe = /^[ \t]+([A-Za-z_][\w]*)\s*:/gm;
            let km;
            while ((km = keyRe.exec(body)) !== null) {
                vars.add(km[1]);
                if (isSecretKeyName(km[1]))
                    secrets.add(km[1]);
            }
        }
        const vfRe = /vars_files\s*:\s*\n((?:[ \t]+-\s*.+\n?)+)/gi;
        let vm;
        while ((vm = vfRe.exec(trimmed)) !== null) {
            const itemRe = /-\s*["']?([^\s"'#]+)/g;
            let im;
            while ((im = itemRe.exec(vm[1])) !== null)
                varsFiles.add(im[1]);
        }
    }
    return {
        vars: [...vars],
        secretKeyNames: [...secrets],
        varsFiles: [...varsFiles],
    };
}
function looksLikeAnsible(text) {
    return (/\bhosts\s*:/i.test(text) ||
        /\broles\s*:/i.test(text) ||
        /\btasks\s*:/i.test(text) ||
        /\bgather_facts\s*:/i.test(text) ||
        /\bbecome\s*:/i.test(text) ||
        /\bansible\./i.test(text) ||
        /\bimport_role\b/i.test(text) ||
        /\binclude_role\b/i.test(text) ||
        /\bset_fact\b/i.test(text) ||
        /\bvars_files\s*:/i.test(text));
}
function hasPlaintextPassword(text) {
    // password/secret/token keys with literal non-Jinja string values
    return /(?:password|passwd|secret|token|api[_-]?key)\s*:\s*["']?(?![|"'{]*\{\{)[^\s"'#]{3,}/i.test(text);
}
function shellWithoutCreates(text) {
    // Look for shell:/command: modules without creates: nearby
    const taskRe = /(?:^|\n)[ \t]*-\s*(?:name\s*:\s*.+\n[ \t]+)?(?:ansible\.builtin\.)?(shell|command)\s*:\s*(?:\|[^\n]*\n(?:[ \t]+.+\n)+|.+)/gi;
    let m;
    let found = false;
    // Simpler: if shell or command appears and creates does not appear in same task window
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
        if (/\b(?:ansible\.builtin\.)?(shell|command)\s*:/.test(lines[i])) {
            // window of next ~12 lines or until next task -
            let window = lines[i];
            for (let j = i + 1; j < Math.min(i + 14, lines.length); j++) {
                if (/^[ \t]*-\s+(?:name\s*:|ansible\.|\w+\s*:)/.test(lines[j]) && j > i) {
                    // new list item at same or less indent might be next task
                    const indent = (lines[j].match(/^([ \t]*)/) || ["", ""])[1].length;
                    const baseIndent = (lines[i].match(/^([ \t]*)/) || ["", ""])[1].length;
                    if (indent <= baseIndent && /^\s*-\s/.test(lines[j]))
                        break;
                }
                window += "\n" + lines[j];
            }
            if (!/\bcreates\s*:/.test(window) && !/\bcreates\s*=/.test(window)) {
                found = true;
                break;
            }
        }
    }
    void taskRe;
    return found;
}
function becomeWithoutBecomeUser(text) {
    if (!/\bbecome\s*:\s*(yes|true)\b/i.test(text))
        return false;
    // If become: yes/true exists but become_user never appears
    return !/\bbecome_user\s*:/i.test(text);
}
function allHostsWithDangerousModules(text) {
    const hasAll = /\bhosts\s*:\s*["']?all["']?\b/i.test(text) ||
        /\bhosts\s*:\s*all\s*$/im.test(text);
    if (!hasAll)
        return false;
    return /\b(?:ansible\.builtin\.)?(shell|command|raw|script)\s*:/i.test(text);
}
function anyPlayMissingHosts(text) {
    const plays = extractPlays(text);
    if (plays.length > 0) {
        return plays.some((p) => !p.hosts);
    }
    // Looks like playbook tasks but no hosts
    if (/\btasks\s*:/i.test(text) && !/\bhosts\s*:/i.test(text))
        return true;
    return false;
}
export function lintAnsible(text) {
    const findings = [];
    const trimmed = (text ?? "").trim();
    if (!trimmed) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Provide non-empty Ansible playbook YAML text. This tool only analyzes the string you pass — it never reads the filesystem or runs ansible.",
        });
        return findings;
    }
    if (!looksLikeAnsible(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "empty_source",
            advice: "No clear Ansible playbook patterns found (hosts, tasks, roles, become, gather_facts). Paste playbook YAML text. Educational tip only.",
        });
        return findings;
    }
    if (anyPlayMissingHosts(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "missing_hosts",
            advice: "One or more plays appear to lack a `hosts:` target. Every play should declare inventory hosts or groups. Educational tip only — this tool never runs ansible.",
        });
    }
    if (shellWithoutCreates(trimmed)) {
        findings.push({
            severity: "info",
            rule: "shell_command_without_creates",
            advice: "`shell` / `command` tasks without a `creates:` (or similar) guard may re-run on every playbook pass. Prefer idempotent modules when possible. Educational tip only.",
        });
    }
    if (hasPlaintextPassword(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "plaintext_password",
            advice: "Possible plaintext password/secret/token literal in YAML. Prefer Ansible Vault, lookups, or CI secrets — never commit credentials. Key/value heuristic only (not an exploit guide).",
        });
    }
    if (becomeWithoutBecomeUser(trimmed)) {
        findings.push({
            severity: "info",
            rule: "become_without_become_user",
            advice: "`become: true/yes` without an explicit `become_user` relies on the default (often root). Confirm the intended privilege user. Educational tip only.",
        });
    }
    if (allHostsWithDangerousModules(trimmed)) {
        findings.push({
            severity: "info",
            rule: "all_hosts_dangerous_modules_tip",
            advice: "Play targets `hosts: all` and uses shell/command/raw/script-style modules. Double-check blast radius and prefer narrower host groups. Educational tip only — not an exploit guide.",
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
