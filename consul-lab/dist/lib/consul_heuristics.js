/**
 * Shared Consul HCL/JSON text helpers.
 * Pure regex/string heuristics — no consul CLI, agent, network, filesystem follow, or eval.
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
/** Remove nested `{ ... }` blocks so attr extraction stays at current level. */
function stripNestedBlocks(body) {
    let out = "";
    let i = 0;
    while (i < body.length) {
        if (body[i] === "{") {
            const close = findMatchingBrace(body, i);
            if (close < 0)
                break;
            out += " ";
            i = close + 1;
            continue;
        }
        out += body[i];
        i++;
    }
    return out;
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
    const re = new RegExp(`(?:^|\\n)\\s*${key}\\s*=\\s*(-?\\d+)\\b`, "i");
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
function tryParseJson(text) {
    const trimmed = text.trim();
    if (!trimmed.startsWith("{") && !trimmed.startsWith("["))
        return null;
    try {
        return JSON.parse(trimmed);
    }
    catch {
        return null;
    }
}
function asMap(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value;
    }
    return null;
}
function strVal(v) {
    if (v === undefined || v === null)
        return undefined;
    if (typeof v === "string") {
        const s = v.trim();
        return s === "" ? undefined : s;
    }
    if (typeof v === "number" || typeof v === "boolean")
        return String(v);
    return undefined;
}
function numVal(v) {
    if (typeof v === "number" && Number.isFinite(v))
        return v;
    if (typeof v === "string" && /^-?\d+$/.test(v.trim())) {
        const n = Number(v.trim());
        return Number.isFinite(n) ? n : undefined;
    }
    return undefined;
}
function strList(v) {
    if (!Array.isArray(v))
        return [];
    const out = [];
    for (const item of v) {
        const s = strVal(item);
        if (s)
            out.push(s);
    }
    return out;
}
function serviceFromMap(m) {
    const info = {};
    const name = strVal(m.name) ?? strVal(m.Name) ?? strVal(m.ID) ?? strVal(m.id);
    if (name)
        info.name = name;
    const port = numVal(m.port) ?? numVal(m.Port);
    if (port !== undefined)
        info.port = port;
    const tags = strList(m.tags ?? m.Tags);
    if (tags.length)
        info.tags = tags;
    const kind = strVal(m.kind) ?? strVal(m.Kind);
    if (kind)
        info.kind = kind;
    return info;
}
function checkTypeFromMap(m) {
    if (m.http != null || m.HTTP != null)
        return "http";
    if (m.tcp != null || m.TCP != null)
        return "tcp";
    if (m.script != null || m.Script != null || m.args != null || m.Args != null)
        return "script";
    if (m.ttl != null || m.TTL != null)
        return "ttl";
    if (m.grpc != null || m.GRPC != null || m.gRPC != null)
        return "grpc";
    const t = strVal(m.type) ?? strVal(m.Type) ?? strVal(m.CheckType);
    return t;
}
function checkFromMap(m) {
    const info = {};
    const name = strVal(m.name) ?? strVal(m.Name) ?? strVal(m.id) ?? strVal(m.ID);
    if (name)
        info.name = name;
    const type = checkTypeFromMap(m);
    if (type)
        info.type = type;
    const interval = strVal(m.interval) ?? strVal(m.Interval) ?? strVal(m.ttl) ?? strVal(m.TTL);
    if (interval)
        info.interval = interval;
    return info;
}
function intentionFromMap(m, destFallback) {
    const info = {};
    const source = strVal(m.source) ??
        strVal(m.Source) ??
        strVal(m.SourceName) ??
        strVal(m.source_name) ??
        strVal(m.name) ??
        strVal(m.Name);
    if (source)
        info.source = source;
    const destination = strVal(m.destination) ??
        strVal(m.Destination) ??
        strVal(m.DestinationName) ??
        strVal(m.destination_name) ??
        destFallback;
    if (destination)
        info.destination = destination;
    const action = strVal(m.action) ??
        strVal(m.Action) ??
        strVal(m.permissions) ??
        strVal(m.Permissions);
    if (action)
        info.action = action.toLowerCase();
    return info;
}
function inferCheckTypeFromBody(body) {
    if (/(?:^|\n)\s*http\s*=/i.test(body))
        return "http";
    if (/(?:^|\n)\s*tcp\s*=/i.test(body))
        return "tcp";
    if (/(?:^|\n)\s*script\s*=/i.test(body) ||
        /(?:^|\n)\s*args\s*=/i.test(body))
        return "script";
    if (/(?:^|\n)\s*ttl\s*=/i.test(body))
        return "ttl";
    if (/(?:^|\n)\s*grpc\s*=/i.test(body))
        return "grpc";
    const typeAttr = extractStringAttr(body, "type");
    return typeAttr;
}
/** Extract service blocks / JSON services: name, port, tags, kind. */
export function extractServices(text) {
    const trimmed = clampText(text).trim();
    if (!trimmed)
        return [];
    const services = [];
    const seen = new Set();
    const push = (info) => {
        if (!info.name && info.port === undefined && !info.tags && !info.kind)
            return;
        const key = `${info.name ?? ""}|${info.port ?? ""}|${(info.tags ?? []).join(",")}|${info.kind ?? ""}`;
        if (seen.has(key))
            return;
        seen.add(key);
        services.push(info);
    };
    const json = tryParseJson(trimmed);
    if (json) {
        const root = asMap(json);
        if (root) {
            const svc = root.service ?? root.Service;
            if (svc) {
                if (Array.isArray(svc)) {
                    for (const s of svc) {
                        const sm = asMap(s);
                        if (sm)
                            push(serviceFromMap(sm));
                    }
                }
                else {
                    const sm = asMap(svc);
                    if (sm)
                        push(serviceFromMap(sm));
                }
            }
            const svcs = root.services ?? root.Services;
            if (Array.isArray(svcs)) {
                for (const s of svcs) {
                    const sm = asMap(s);
                    if (sm)
                        push(serviceFromMap(sm));
                }
            }
            // Bare service object: { "name": "...", "port": N }
            if (!svc &&
                !svcs &&
                (root.name != null || root.Name != null || root.port != null || root.Port != null)) {
                push(serviceFromMap(root));
            }
        }
        else if (Array.isArray(json)) {
            for (const s of json) {
                const sm = asMap(s);
                if (sm)
                    push(serviceFromMap(sm));
            }
        }
        if (services.length)
            return services;
    }
    const hcl = stripCommentsKeepStrings(trimmed);
    // service "name" { ... }
    const namedRe = /\bservice\s+"([^"]+)"\s*\{/g;
    let m;
    while ((m = namedRe.exec(hcl)) !== null) {
        const name = m[1];
        const open = m.index + m[0].length - 1;
        const close = findMatchingBrace(hcl, open);
        const body = close >= 0 ? hcl.slice(open + 1, close) : "";
        const top = stripNestedBlocks(body);
        const info = { name };
        const nameAttr = extractStringAttr(top, "name");
        if (nameAttr)
            info.name = nameAttr;
        const port = extractNumberAttr(top, "port");
        if (port !== undefined)
            info.port = port;
        const tags = extractStringList(top, "tags");
        if (tags.length)
            info.tags = tags;
        const kind = extractStringAttr(top, "kind");
        if (kind)
            info.kind = kind;
        push(info);
    }
    // service { name = "..." ... }
    const anonRe = /\bservice\s*\{/g;
    while ((m = anonRe.exec(hcl)) !== null) {
        const open = m.index + m[0].length - 1;
        const close = findMatchingBrace(hcl, open);
        const body = close >= 0 ? hcl.slice(open + 1, close) : "";
        const top = stripNestedBlocks(body);
        const info = {};
        const name = extractStringAttr(top, "name");
        if (name)
            info.name = name;
        const port = extractNumberAttr(top, "port");
        if (port !== undefined)
            info.port = port;
        const tags = extractStringList(top, "tags");
        if (tags.length)
            info.tags = tags;
        const kind = extractStringAttr(top, "kind");
        if (kind)
            info.kind = kind;
        push(info);
    }
    return services;
}
/** Extract health checks: http, tcp, script, ttl, grpc + interval. */
export function extractChecks(text) {
    const trimmed = clampText(text).trim();
    if (!trimmed)
        return [];
    const checks = [];
    const seen = new Set();
    const push = (info) => {
        if (!info.name && !info.type && !info.interval)
            return;
        const key = `${info.name ?? ""}|${info.type ?? ""}|${info.interval ?? ""}`;
        if (seen.has(key))
            return;
        seen.add(key);
        checks.push(info);
    };
    const json = tryParseJson(trimmed);
    if (json) {
        const root = asMap(json);
        if (root) {
            const collect = (v) => {
                if (Array.isArray(v)) {
                    for (const c of v) {
                        const cm = asMap(c);
                        if (cm)
                            push(checkFromMap(cm));
                    }
                }
                else {
                    const cm = asMap(v);
                    if (cm)
                        push(checkFromMap(cm));
                }
            };
            if (root.check != null)
                collect(root.check);
            if (root.Check != null)
                collect(root.Check);
            if (root.checks != null)
                collect(root.checks);
            if (root.Checks != null)
                collect(root.Checks);
            // Nested under service
            const svc = asMap(root.service ?? root.Service);
            if (svc) {
                if (svc.check != null)
                    collect(svc.check);
                if (svc.Check != null)
                    collect(svc.Check);
                if (svc.checks != null)
                    collect(svc.checks);
                if (svc.Checks != null)
                    collect(svc.Checks);
            }
        }
        else if (Array.isArray(json)) {
            for (const c of json) {
                const cm = asMap(c);
                if (cm && (cm.http != null || cm.tcp != null || cm.ttl != null || cm.grpc != null || cm.script != null || cm.HTTP != null)) {
                    push(checkFromMap(cm));
                }
            }
        }
        if (checks.length)
            return checks;
    }
    const hcl = stripCommentsKeepStrings(trimmed);
    // check "name" { ... } or check { ... }
    const namedCheckRe = /\bcheck\s+"([^"]+)"\s*\{/g;
    let m;
    while ((m = namedCheckRe.exec(hcl)) !== null) {
        const name = m[1];
        const open = m.index + m[0].length - 1;
        const close = findMatchingBrace(hcl, open);
        const body = close >= 0 ? hcl.slice(open + 1, close) : "";
        const info = { name };
        const nameAttr = extractStringAttr(body, "name");
        if (nameAttr)
            info.name = nameAttr;
        const type = inferCheckTypeFromBody(body);
        if (type)
            info.type = type;
        const interval = extractStringAttr(body, "interval") ?? extractStringAttr(body, "ttl");
        if (interval)
            info.interval = interval;
        push(info);
    }
    const anonCheckRe = /\bcheck\s*\{/g;
    while ((m = anonCheckRe.exec(hcl)) !== null) {
        const open = m.index + m[0].length - 1;
        const close = findMatchingBrace(hcl, open);
        const body = close >= 0 ? hcl.slice(open + 1, close) : "";
        const info = {};
        const name = extractStringAttr(body, "name");
        if (name)
            info.name = name;
        const type = inferCheckTypeFromBody(body);
        if (type)
            info.type = type;
        const interval = extractStringAttr(body, "interval") ?? extractStringAttr(body, "ttl");
        if (interval)
            info.interval = interval;
        push(info);
    }
    return checks;
}
/** Extract intentions / service-intentions: source, destination, action. */
export function extractIntentions(text) {
    const trimmed = clampText(text).trim();
    if (!trimmed)
        return [];
    const intentions = [];
    const seen = new Set();
    const push = (info) => {
        if (!info.source && !info.destination && !info.action)
            return;
        const key = `${info.source ?? ""}|${info.destination ?? ""}|${info.action ?? ""}`;
        if (seen.has(key))
            return;
        seen.add(key);
        intentions.push(info);
    };
    const json = tryParseJson(trimmed);
    if (json) {
        const root = asMap(json);
        if (root) {
            const collectOne = (v, dest) => {
                const im = asMap(v);
                if (im)
                    push(intentionFromMap(im, dest));
            };
            const collectMany = (v, dest) => {
                if (Array.isArray(v)) {
                    for (const i of v)
                        collectOne(i, dest);
                }
                else
                    collectOne(v, dest);
            };
            if (root.intention != null)
                collectMany(root.intention);
            if (root.Intention != null)
                collectMany(root.Intention);
            if (root.intentions != null)
                collectMany(root.intentions);
            if (root.Intentions != null)
                collectMany(root.Intentions);
            // Classic API shape
            if (root.SourceName != null || root.DestinationName != null || root.Action != null) {
                push(intentionFromMap(root));
            }
            // Config entry style: Kind = service-intentions, Name = dest, Sources = [...]
            const kind = strVal(root.Kind) ?? strVal(root.kind);
            const destName = strVal(root.Name) ?? strVal(root.name);
            if (kind &&
                /service[-_]?intentions/i.test(kind) &&
                (root.Sources != null || root.sources != null)) {
                collectMany(root.Sources ?? root.sources, destName);
            }
            // Nested ConfigEntries
            const entries = root.ConfigEntries ?? root.config_entries;
            if (Array.isArray(entries)) {
                for (const e of entries) {
                    const em = asMap(e);
                    if (!em)
                        continue;
                    const ek = strVal(em.Kind) ?? strVal(em.kind);
                    const en = strVal(em.Name) ?? strVal(em.name);
                    if (ek && /service[-_]?intentions/i.test(ek)) {
                        collectMany(em.Sources ?? em.sources, en);
                    }
                }
            }
        }
        else if (Array.isArray(json)) {
            for (const i of json) {
                const im = asMap(i);
                if (im)
                    push(intentionFromMap(im));
            }
        }
        if (intentions.length)
            return intentions;
    }
    const hcl = stripCommentsKeepStrings(trimmed);
    // intention { source = ... destination = ... action = ... }
    // intention "..." { ... }
    const namedIntRe = /\bintention\s+"([^"]+)"\s*\{/g;
    let m;
    while ((m = namedIntRe.exec(hcl)) !== null) {
        const open = m.index + m[0].length - 1;
        const close = findMatchingBrace(hcl, open);
        const body = close >= 0 ? hcl.slice(open + 1, close) : "";
        const info = {};
        const source = extractStringAttr(body, "source") ?? m[1];
        if (source)
            info.source = source;
        const destination = extractStringAttr(body, "destination");
        if (destination)
            info.destination = destination;
        const action = extractStringAttr(body, "action");
        if (action)
            info.action = action.toLowerCase();
        push(info);
    }
    const anonIntRe = /\bintention\s*\{/g;
    while ((m = anonIntRe.exec(hcl)) !== null) {
        const open = m.index + m[0].length - 1;
        const close = findMatchingBrace(hcl, open);
        const body = close >= 0 ? hcl.slice(open + 1, close) : "";
        const info = {};
        const source = extractStringAttr(body, "source");
        if (source)
            info.source = source;
        const destination = extractStringAttr(body, "destination");
        if (destination)
            info.destination = destination;
        const action = extractStringAttr(body, "action");
        if (action)
            info.action = action.toLowerCase();
        push(info);
    }
    // service_intentions "dest" { sources { name = "src" action = "allow" } }
    // service-intentions via config_entry
    const siNamedRe = /\bservice_intentions\s+"([^"]+)"\s*\{/gi;
    while ((m = siNamedRe.exec(hcl)) !== null) {
        const dest = m[1];
        const open = m.index + m[0].length - 1;
        const close = findMatchingBrace(hcl, open);
        const body = close >= 0 ? hcl.slice(open + 1, close) : "";
        // Nested source blocks: sources { name = "..." action = "..." } or source { }
        const srcBlockRe = /\b(?:sources?)\s*\{/gi;
        let sm;
        while ((sm = srcBlockRe.exec(body)) !== null) {
            const sOpen = sm.index + sm[0].length - 1;
            const sClose = findMatchingBrace(body, sOpen);
            const sBody = sClose >= 0 ? body.slice(sOpen + 1, sClose) : "";
            // May contain nested name/action pairs OR nested { name action } blocks
            const nestedRe = /\{([^{}]*)\}/g;
            let nm;
            let foundNested = false;
            while ((nm = nestedRe.exec(sBody)) !== null) {
                foundNested = true;
                const inner = nm[1];
                const info = { destination: dest };
                const source = extractStringAttr(inner, "name") ?? extractStringAttr(inner, "source");
                if (source)
                    info.source = source;
                const action = extractStringAttr(inner, "action");
                if (action)
                    info.action = action.toLowerCase();
                push(info);
            }
            if (!foundNested) {
                const info = { destination: dest };
                const source = extractStringAttr(sBody, "name") ?? extractStringAttr(sBody, "source");
                if (source)
                    info.source = source;
                const action = extractStringAttr(sBody, "action");
                if (action)
                    info.action = action.toLowerCase();
                push(info);
            }
        }
    }
    // config_entry { kind = "service-intentions" name = "dest" ... }
    const ceRe = /\bconfig_entry\s*(?:"[^"]*"\s*)?\{/gi;
    while ((m = ceRe.exec(hcl)) !== null) {
        const open = m.index + m[0].length - 1;
        const close = findMatchingBrace(hcl, open);
        const body = close >= 0 ? hcl.slice(open + 1, close) : "";
        const kind = extractStringAttr(body, "kind") ?? extractStringAttr(body, "Kind");
        if (!kind || !/service[-_]?intentions/i.test(kind))
            continue;
        const dest = extractStringAttr(body, "name") ?? extractStringAttr(body, "Name");
        const srcBlockRe = /\b(?:sources?)\s*\{/gi;
        let sm;
        while ((sm = srcBlockRe.exec(body)) !== null) {
            const sOpen = sm.index + sm[0].length - 1;
            const sClose = findMatchingBrace(body, sOpen);
            const sBody = sClose >= 0 ? body.slice(sOpen + 1, sClose) : "";
            const nestedRe = /\{([^{}]*)\}/g;
            let nm;
            let foundNested = false;
            while ((nm = nestedRe.exec(sBody)) !== null) {
                foundNested = true;
                const inner = nm[1];
                const info = {};
                if (dest)
                    info.destination = dest;
                const source = extractStringAttr(inner, "name") ?? extractStringAttr(inner, "source");
                if (source)
                    info.source = source;
                const action = extractStringAttr(inner, "action");
                if (action)
                    info.action = action.toLowerCase();
                push(info);
            }
            if (!foundNested) {
                const info = {};
                if (dest)
                    info.destination = dest;
                const source = extractStringAttr(sBody, "name") ?? extractStringAttr(sBody, "source");
                if (source)
                    info.source = source;
                const action = extractStringAttr(sBody, "action");
                if (action)
                    info.action = action.toLowerCase();
                push(info);
            }
        }
    }
    // Loose HCL attrs: SourceName / DestinationName / Action (Terraform-ish).
    // Case-sensitive for PascalCase so `action =` does not match `Action`.
    function extractExactStringAttr(body, key) {
        const re = new RegExp(`(?:^|\\n)\\s*${key}\\s*=\\s*"((?:[^"\\\\]|\\\\.)*)"`);
        const mm = re.exec(body);
        return mm ? unescapeHclString(mm[1]) : undefined;
    }
    const looseSrc = extractExactStringAttr(hcl, "SourceName") ??
        extractStringAttr(hcl, "source_name");
    const looseDst = extractExactStringAttr(hcl, "DestinationName") ??
        extractStringAttr(hcl, "destination_name");
    const looseAct = extractExactStringAttr(hcl, "Action") ??
        extractStringAttr(hcl, "action");
    // Require source or destination so bare nested `action = "allow"` is ignored
    if (looseSrc || looseDst) {
        const info = {};
        if (looseSrc)
            info.source = looseSrc;
        if (looseDst)
            info.destination = looseDst;
        if (looseAct)
            info.action = looseAct.toLowerCase();
        push(info);
    }
    return intentions;
}
function looksLikeConsul(text) {
    return (/\bservice\s*(\"[^\"]+\"\s*)?\{/.test(text) ||
        /\bcheck\s*(\"[^\"]+\"\s*)?\{/.test(text) ||
        /\bintention\s*(\"[^\"]+\"\s*)?\{/.test(text) ||
        /\bservice_intentions\b/i.test(text) ||
        /\bservice-intentions\b/i.test(text) ||
        /"SourceName"\s*:/.test(text) ||
        /"DestinationName"\s*:/.test(text) ||
        extractServices(text).length > 0 ||
        extractChecks(text).length > 0 ||
        extractIntentions(text).length > 0);
}
function hasPlaintextAclToken(text) {
    const hcl = stripCommentsKeepStrings(text);
    // token / acl_token / consul_http_token / CONSUL_HTTP_TOKEN style literals
    if (/(?:^|\n)\s*(?:acl[_-]?token|token|consul[_-]?http[_-]?token|CONSUL_HTTP_TOKEN)\s*=\s*"(?!\{\{|\$\{|env\()[^"]{8,}"/im.test(hcl)) {
        return true;
    }
    // JSON: "Token": "..." or "ACLToken": "..."
    if (/"(?:Token|ACLToken|AclToken|acl_token|CONSUL_HTTP_TOKEN)"\s*:\s*"(?!\{\{|\$\{)[^"]{8,}"/i.test(text)) {
        return true;
    }
    return false;
}
function hasAllowAllIntention(text) {
    const intentions = extractIntentions(text);
    for (const i of intentions) {
        const action = (i.action ?? "").toLowerCase();
        const src = i.source ?? "";
        const dst = i.destination ?? "";
        if (action === "allow" && (src === "*" || dst === "*"))
            return true;
    }
    // Also loose text: action = "allow" near source = "*"
    const hcl = stripCommentsKeepStrings(text);
    if (/\bsource\s*=\s*"\*"[\s\S]{0,120}\baction\s*=\s*"allow"/i.test(hcl) ||
        /\baction\s*=\s*"allow"[\s\S]{0,120}\bsource\s*=\s*"\*"/i.test(hcl) ||
        /"SourceName"\s*:\s*"\*"[\s\S]{0,120}"Action"\s*:\s*"allow"/i.test(text) ||
        /"Action"\s*:\s*"allow"[\s\S]{0,120}"SourceName"\s*:\s*"\*"/i.test(text)) {
        return true;
    }
    return false;
}
function hasScriptCheck(text) {
    const checks = extractChecks(text);
    if (checks.some((c) => (c.type ?? "").toLowerCase() === "script"))
        return true;
    const hcl = stripCommentsKeepStrings(text);
    return (/(?:^|\n)\s*script\s*=\s*"/i.test(hcl) ||
        /"script"\s*:/i.test(text) ||
        /(?:^|\n)\s*args\s*=\s*\[/i.test(hcl));
}
function hasMissingServiceName(text) {
    const services = extractServices(text);
    // Explicit empty name
    if (services.some((s) => s.name === ""))
        return true;
    // Has service-like content but no named service
    const hcl = stripCommentsKeepStrings(text);
    const hasServiceBlock = /\bservice\s*(\"[^\"]+\"\s*)?\{/.test(hcl) ||
        /"service"\s*:/.test(text) ||
        /"Services"\s*:/.test(text);
    if (!hasServiceBlock)
        return false;
    if (services.length === 0)
        return true;
    return services.some((s) => !s.name);
}
export function lintConsul(text) {
    const findings = [];
    const trimmed = clampText(text).trim();
    if (!trimmed) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Provide non-empty Consul HCL or JSON text. This tool only analyzes the string you pass — it never runs consul, talks to an agent, or reads the filesystem.",
        });
        return findings;
    }
    if (!looksLikeConsul(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "empty_source",
            advice: "No clear Consul patterns found (`service`/`check`/`intention` blocks or JSON services). Paste Consul HCL or JSON text. Educational tip only.",
        });
        return findings;
    }
    if (hasMissingServiceName(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "missing_service_name",
            advice: "A service block appears without a clear `name` (or named `service \"...\"`). Consul service definitions usually include a name for registration. Educational tip only — this tool never runs consul.",
        });
    }
    if (hasPlaintextAclToken(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "plaintext_acl_token",
            advice: "Possible plaintext ACL/token literal in Consul text (`token` / `acl_token` / `CONSUL_HTTP_TOKEN`). Prefer env vars, Vault, or file-based tokens — never commit credentials. Attribute heuristic only (not an exploit guide).",
        });
    }
    if (hasAllowAllIntention(trimmed)) {
        findings.push({
            severity: "info",
            rule: "allow_all_intention",
            advice: "Allow-all intention tip: `action = \"allow\"` with source/destination `\"*\"` permits broad mesh traffic. Prefer least-privilege intentions (specific sources/destinations). Educational tip only — not an exploit guide.",
        });
    }
    if (hasScriptCheck(trimmed)) {
        findings.push({
            severity: "info",
            rule: "script_check",
            advice: "Script check tip: script/args health checks are harder to sandbox and are discouraged in favor of http/tcp/grpc/ttl checks. Prefer protocol checks when practical. Educational tip only — not an exploit guide.",
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
