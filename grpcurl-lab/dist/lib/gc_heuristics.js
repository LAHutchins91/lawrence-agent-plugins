/**
 * Best-effort grpcurl CLI text heuristics.
 * No grpcurl/gRPC runtime, no network, no filesystem follow, no eval.
 */
/** Strip BOM, normalize newlines, drop # / // comments (quote-aware; keep ://). */
export function stripComments(raw) {
    const src = (raw ?? "").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
    let out = "";
    let i = 0;
    const n = src.length;
    let inSingle = false;
    let inDouble = false;
    let escape = false;
    while (i < n) {
        const ch = src[i];
        const next = i + 1 < n ? src[i + 1] : "";
        if (escape) {
            out += ch;
            escape = false;
            i++;
            continue;
        }
        if (inSingle) {
            if (ch === "\\") {
                escape = true;
                out += ch;
                i++;
                continue;
            }
            if (ch === "'")
                inSingle = false;
            out += ch;
            i++;
            continue;
        }
        if (inDouble) {
            if (ch === "\\") {
                escape = true;
                out += ch;
                i++;
                continue;
            }
            if (ch === '"')
                inDouble = false;
            out += ch;
            i++;
            continue;
        }
        if (ch === "'") {
            inSingle = true;
            out += ch;
            i++;
            continue;
        }
        if (ch === '"') {
            inDouble = true;
            out += ch;
            i++;
            continue;
        }
        // // comments, but not URL scheme ://
        if (ch === "/" && next === "/" && out[out.length - 1] !== ":") {
            i += 2;
            while (i < n && src[i] !== "\n")
                i++;
            continue;
        }
        if (ch === "#" && (i === 0 || src[i - 1] === "\n" || /\s/.test(src[i - 1]))) {
            i++;
            while (i < n && src[i] !== "\n")
                i++;
            continue;
        }
        out += ch;
        i++;
    }
    return out;
}
function countOccurrences(text, re) {
    let n = 0;
    const r = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    while (r.exec(text))
        n++;
    return n;
}
const INVOCATION_RE = /(^|[;&|]\s*)((?:[\w./~-]*\/)?grpcurl(?:\.exe)?)\b(.*)$/i;
function tokenizeArgs(args) {
    const tokens = [];
    const re = /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'|[^\s]+/g;
    let m;
    while ((m = re.exec(args))) {
        const raw = m[0];
        if ((raw.startsWith('"') && raw.endsWith('"')) ||
            (raw.startsWith("'") && raw.endsWith("'"))) {
            tokens.push(raw.slice(1, -1));
        }
        else {
            tokens.push(raw);
        }
    }
    return tokens;
}
const LONG_TO_SHORT = {
    "--plaintext": "-plaintext",
    "--insecure": "-insecure",
    "--proto": "-proto",
    "--protoset": "-protoset",
    "--use-reflection": "-use-reflection",
    "--import-path": "-import-path",
    "--data": "-d",
    "--format": "-format",
    "--emit-defaults": "-emit-defaults",
    "--allow-unknown-fields": "-allow-unknown-fields",
    "--expand-headers": "-expand-headers",
    "--authority": "-authority",
    "--user-agent": "-user-agent",
    "--max-time": "-max-time",
    "--connect-timeout": "-connect-timeout",
    "--keepalive-time": "-keepalive-time",
    "--cacert": "-cacert",
    "--cert": "-cert",
    "--key": "-key",
    "--servername": "-servername",
    "--verbose": "-v",
    "--help": "--help",
    "--version": "--version",
    "--rpc-header": "-rpc-header",
    "--reflect-metadata": "-reflect-metadata",
    "--reflect-header": "-reflect-metadata",
    "--header": "-H",
};
const BOOL_FLAGS = new Set([
    "-plaintext",
    "-insecure",
    "-use-reflection",
    "-emit-defaults",
    "-allow-unknown-fields",
    "-expand-headers",
    "-v",
    "-vv",
    "-help",
    "--help",
    "--version",
    "-h",
    "--plaintext",
    "--insecure",
    "--use-reflection",
    "--emit-defaults",
    "--allow-unknown-fields",
    "--expand-headers",
    "--verbose",
]);
const VALUE_FLAGS = new Set([
    "-proto",
    "-protoset",
    "-protoset-out",
    "-import-path",
    "-d",
    "-format",
    "-authority",
    "-user-agent",
    "-max-time",
    "-connect-timeout",
    "-keepalive-time",
    "-cacert",
    "-cert",
    "-key",
    "-servername",
    "-H",
    "-rpc-header",
    "-reflect-metadata",
    "-msg-template",
    "-unix",
]);
function normalizeFlag(rawFlag) {
    return LONG_TO_SHORT[rawFlag] ?? rawFlag;
}
function looksLikeHost(tok) {
    if (!tok || tok.startsWith("-"))
        return false;
    const t = tok.replace(/[),.;]+$/, "");
    // host:port, [ipv6]:port, dns:///..., unix:..., https?://host:port
    if (/^https?:\/\//i.test(t))
        return true;
    if (/^dns:\/\//i.test(t))
        return true;
    if (/^unix:\/\//i.test(t) || /^unix:/.test(t))
        return true;
    if (/^\[[0-9a-fA-F:]+\]:\d+$/.test(t))
        return true;
    if (/^[A-Za-z0-9._-]+:\d+$/.test(t))
        return true;
    if (/^\d{1,3}(?:\.\d{1,3}){3}:\d+$/.test(t))
        return true;
    return false;
}
function cleanHost(tok) {
    return tok.replace(/[),.;]+$/, "").replace(/^['"`]|['"`]$/g, "");
}
/** Fully-qualified method: package.Service/Method or Service/Method */
const METHOD_RE = /\b([A-Za-z_][\w.]*(?:\.[A-Za-z_][\w.]*)+)\/([A-Za-z_][\w]*)\b/g;
/** Service-ish name: package.Service or bare PascalCase service */
function looksLikeService(tok) {
    if (!tok || tok.startsWith("-"))
        return false;
    if (/^(list|describe|help|version)$/i.test(tok))
        return false;
    if (looksLikeHost(tok))
        return false;
    if (tok.includes("/"))
        return false;
    // package.Service or grpc.health.v1.Health
    if (/^[A-Za-z_][\w]*(?:\.[A-Za-z_][\w]*)+$/.test(tok))
        return true;
    return false;
}
function looksLikeMethodSymbol(tok) {
    if (!tok || tok.startsWith("-"))
        return false;
    return /^[A-Za-z_][\w.]*(?:\.[A-Za-z_][\w.]*)+\/[A-Za-z_][\w]*$/.test(tok);
}
function parseInvocationArgs(args) {
    const tokens = tokenizeArgs(args);
    const flags = [];
    const positionals = [];
    for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        if (tok.startsWith("--")) {
            const eq = tok.indexOf("=");
            const rawFlag = eq === -1 ? tok : tok.slice(0, eq);
            let value = eq === -1 ? undefined : tok.slice(eq + 1);
            const flag = normalizeFlag(rawFlag);
            const isBool = BOOL_FLAGS.has(rawFlag) || BOOL_FLAGS.has(flag);
            if (!isBool && value === undefined) {
                const nxt = tokens[i + 1];
                if (nxt !== undefined && !nxt.startsWith("-")) {
                    value = nxt;
                    i++;
                }
            }
            flags.push(value !== undefined ? { flag, value } : { flag });
            continue;
        }
        if (tok.startsWith("-") && tok.length > 1) {
            // grpcurl uses mostly long-ish single-dash flags: -plaintext, -H, -d, -vv
            const eq = tok.indexOf("=");
            let rawFlag = eq === -1 ? tok : tok.slice(0, eq);
            let value = eq === -1 ? undefined : tok.slice(eq + 1);
            // glued short: -d'{}' already handled by tokenize; -vv is bool
            if (rawFlag === "-vv") {
                flags.push({ flag: "-vv" });
                continue;
            }
            const flag = normalizeFlag(rawFlag);
            const isBool = BOOL_FLAGS.has(rawFlag) || BOOL_FLAGS.has(flag);
            const needsValue = VALUE_FLAGS.has(flag) ||
                VALUE_FLAGS.has(rawFlag) ||
                (!isBool &&
                    (rawFlag === "-H" ||
                        rawFlag === "-d" ||
                        rawFlag.startsWith("-rpc") ||
                        rawFlag.startsWith("-reflect") ||
                        rawFlag.startsWith("-proto") ||
                        rawFlag === "-import-path" ||
                        rawFlag === "-format" ||
                        rawFlag === "-authority" ||
                        rawFlag === "-user-agent" ||
                        rawFlag === "-max-time" ||
                        rawFlag === "-connect-timeout" ||
                        rawFlag === "-keepalive-time" ||
                        rawFlag === "-cacert" ||
                        rawFlag === "-cert" ||
                        rawFlag === "-key" ||
                        rawFlag === "-servername" ||
                        rawFlag === "-msg-template"));
            if (needsValue && value === undefined) {
                const nxt = tokens[i + 1];
                if (nxt !== undefined && !nxt.startsWith("-")) {
                    value = nxt;
                    i++;
                }
            }
            else if (!isBool && !needsValue && value === undefined) {
                // unknown dash flag: try consume next non-flag as value
                const nxt = tokens[i + 1];
                if (nxt !== undefined &&
                    !nxt.startsWith("-") &&
                    !looksLikeHost(nxt) &&
                    !looksLikeMethodSymbol(nxt) &&
                    !/^(list|describe)$/i.test(nxt)) {
                    // leave as bool-ish unknown
                }
            }
            flags.push(value !== undefined ? { flag, value } : { flag });
            continue;
        }
        positionals.push(tok);
    }
    return { flags, positionals };
}
function joinContinuations(raw) {
    return (raw ?? "").replace(/\\[ \t]*\n/g, " ");
}
function parseAllInvocations(text) {
    const raw = joinContinuations((text ?? "").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n"));
    const out = [];
    for (const line of raw.split("\n")) {
        const cleanedLine = line.replace(/(^|\s)#.*$/, "$1");
        const inv = cleanedLine.match(INVOCATION_RE);
        if (inv) {
            out.push(parseInvocationArgs(inv[3] ?? ""));
        }
    }
    // Fallback: whole text if grpcurl mentioned but no line matched
    if (out.length === 0 && /\bgrpcurl(?:\.exe)?\b/i.test(raw)) {
        const cleaned = stripComments(raw).replace(/\bgrpcurl(?:\.exe)?\b/gi, " ");
        out.push(parseInvocationArgs(cleaned));
    }
    return out;
}
function extractHostFromPositional(pos) {
    for (const p of pos) {
        if (looksLikeHost(p))
            return cleanHost(p);
    }
    return undefined;
}
const AUTH_VALUE_RE = /^(authorization|proxy-authorization|x-api-key|api-key|x-auth-token|cookie|set-cookie)\s*:/i;
function looksAuthMetadata(value) {
    const v = value.trim();
    if (AUTH_VALUE_RE.test(v))
        return true;
    if (/\bBearer\s+[A-Za-z0-9\-._~+/]+=*/i.test(v))
        return true;
    if (/\bBasic\s+[A-Za-z0-9+/=]+/i.test(v))
        return true;
    if (/\b(password|passwd|secret|token|api[_-]?key)\b\s*[=:]/i.test(v))
        return true;
    return false;
}
function redactAuthValue(value) {
    let v = value;
    // Authorization: Bearer xxx → Authorization: Bearer ***
    v = v.replace(/^((?:authorization|proxy-authorization)\s*:\s*Bearer\s+)\S+/i, "$1***");
    v = v.replace(/^((?:authorization|proxy-authorization)\s*:\s*Basic\s+)\S+/i, "$1***");
    v = v.replace(/^((?:authorization|proxy-authorization|x-api-key|api-key|x-auth-token|cookie|set-cookie)\s*:\s*)(.+)$/i, (_, p1, rest) => {
        if (/\*\*\*/.test(rest))
            return p1 + rest;
        return p1 + "***";
    });
    v = v.replace(/\bBearer\s+[A-Za-z0-9\-._~+/]+=*/gi, "Bearer ***");
    v = v.replace(/\bBasic\s+[A-Za-z0-9+/=]+/gi, "Basic ***");
    if (v === value && looksAuthMetadata(value)) {
        // generic redact of trailing secret-looking segment
        const colon = v.indexOf(":");
        if (colon !== -1)
            return v.slice(0, colon + 1) + " ***";
        return "***";
    }
    return v;
}
/**
 * List targets (hosts) and service names from grpcurl invocations / list / service names.
 */
export function listServices(text) {
    const targets = [];
    const services = [];
    const seenHost = new Set();
    const seenSvc = new Set();
    const pushHost = (host) => {
        const h = host?.trim();
        if (!h || seenHost.has(h))
            return;
        seenHost.add(h);
        targets.push({ host: h });
    };
    const pushSvc = (svc) => {
        const s = svc?.trim();
        if (!s || seenSvc.has(s))
            return;
        if (/^(list|describe)$/i.test(s))
            return;
        seenSvc.add(s);
        services.push(s);
    };
    const invs = parseAllInvocations(text);
    for (const inv of invs) {
        pushHost(extractHostFromPositional(inv.positionals));
        // list / describe ServiceName
        for (let i = 0; i < inv.positionals.length; i++) {
            const p = inv.positionals[i];
            if (/^(list|describe)$/i.test(p)) {
                const nxt = inv.positionals[i + 1];
                if (nxt && looksLikeService(nxt))
                    pushSvc(nxt);
                continue;
            }
            if (looksLikeMethodSymbol(p)) {
                const m = p.match(/^(.+)\/([^/]+)$/);
                if (m)
                    pushSvc(m[1]);
            }
            else if (looksLikeService(p) && !looksLikeHost(p)) {
                // positional service after host (e.g. list already handled; bare service rare)
                // Only treat as service if a host already appeared earlier in positionals
                const hostIdx = inv.positionals.findIndex(looksLikeHost);
                const myIdx = i;
                if (hostIdx !== -1 && myIdx > hostIdx)
                    pushSvc(p);
            }
        }
    }
    // Also harvest method FQNs / service names from free text (list output style)
    const cleaned = stripComments(text ?? "");
    let mm;
    const methodRe = new RegExp(METHOD_RE.source, "g");
    while ((mm = methodRe.exec(cleaned))) {
        pushSvc(mm[1]);
    }
    // Lines that look like grpcurl list output: package.Service
    if (/\bgrpcurl\b/i.test(text ?? "") || invs.length > 0 || /\/[A-Za-z_]/.test(cleaned)) {
        for (const line of cleaned.split("\n")) {
            const t = line.trim();
            if (!t || t.startsWith("-"))
                continue;
            if (looksLikeService(t) && t.includes("."))
                pushSvc(t);
        }
    }
    return { targets, services, count: services.length };
}
/**
 * Extract fully-qualified method calls: package.Service/Method.
 */
export function listMethods(text) {
    const methods = [];
    const seen = new Set();
    const push = (service, method) => {
        const key = `${service ?? ""}/${method ?? ""}`;
        if (!service && !method)
            return;
        if (seen.has(key))
            return;
        seen.add(key);
        const entry = {};
        if (service)
            entry.service = service;
        if (method)
            entry.method = method;
        methods.push(entry);
    };
    const invs = parseAllInvocations(text);
    for (const inv of invs) {
        for (const p of inv.positionals) {
            if (looksLikeMethodSymbol(p)) {
                const m = p.match(/^(.+)\/([^/]+)$/);
                if (m)
                    push(m[1], m[2]);
            }
        }
    }
    const cleaned = stripComments(text ?? "");
    let mm;
    const methodRe = new RegExp(METHOD_RE.source, "g");
    while ((mm = methodRe.exec(cleaned))) {
        push(mm[1], mm[2]);
    }
    return { methods, count: methods.length };
}
/**
 * Extract -H / -rpc-header / -reflect-metadata values (auth-looking values redacted).
 */
export function listMetadata(text) {
    const metadata = [];
    const seen = new Set();
    const META_FLAGS = new Set([
        "-H",
        "-rpc-header",
        "-reflect-metadata",
        "--rpc-header",
        "--reflect-metadata",
        "--reflect-header",
        "--header",
    ]);
    const push = (flag, value) => {
        const norm = flag === "--header"
            ? "-H"
            : flag === "--rpc-header"
                ? "-rpc-header"
                : flag === "--reflect-header" || flag === "--reflect-metadata"
                    ? "-reflect-metadata"
                    : normalizeFlag(flag);
        let v = value;
        if (v !== undefined && looksAuthMetadata(v)) {
            v = redactAuthValue(v);
        }
        const key = `${norm}|${v ?? ""}`;
        if (seen.has(key))
            return;
        seen.add(key);
        const entry = { flag: norm };
        if (v !== undefined && v !== "")
            entry.value = v;
        metadata.push(entry);
    };
    const invs = parseAllInvocations(text);
    for (const inv of invs) {
        for (const f of inv.flags) {
            if (META_FLAGS.has(f.flag) || META_FLAGS.has(normalizeFlag(f.flag))) {
                push(f.flag, f.value);
            }
        }
    }
    // Regex fallback for pastes without clean invocation parse
    if (metadata.length === 0) {
        const cleaned = stripComments(text ?? "");
        const re = /(?:^|\s)(-H|--header|-rpc-header|--rpc-header|-reflect-metadata|--reflect-metadata|--reflect-header)(?:=|\s+)(?:"([^"]*)"|'([^']*)'|(\S+))/gi;
        let m;
        while ((m = re.exec(cleaned))) {
            push(m[1], m[2] ?? m[3] ?? m[4]);
        }
    }
    return { metadata, count: metadata.length };
}
function listFlags(text) {
    const all = [];
    for (const inv of parseAllInvocations(text)) {
        all.push(...inv.flags);
    }
    return all;
}
function hasGrpcurlSignal(raw) {
    return (/\bgrpcurl(?:\.exe)?\b/i.test(raw) ||
        listServices(raw).count > 0 ||
        listMethods(raw).count > 0 ||
        listMetadata(raw).count > 0 ||
        /-(?:plaintext|insecure|proto|protoset|use-reflection|rpc-header|reflect-metadata)\b/i.test(raw));
}
export function lintGrpcurl(text) {
    const findings = [];
    const raw = text ?? "";
    if (!raw.trim()) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Source text is empty. Paste a grpcurl CLI line (e.g. `grpcurl -plaintext localhost:50051 list` or `grpcurl -d '{}' host:443 package.Service/Method`).",
        });
        return findings;
    }
    const cleaned = stripComments(raw);
    const flags = listFlags(raw);
    const flagSet = new Set(flags.map((f) => f.flag));
    const { targets, services } = listServices(raw);
    const { methods } = listMethods(raw);
    const hasCli = /\bgrpcurl(?:\.exe)?\b/i.test(raw) || flags.length > 0;
    if (!hasGrpcurlSignal(raw)) {
        findings.push({
            severity: "warn",
            rule: "no_grpcurl_detected",
            advice: "No grpcurl signals detected (`grpcurl -plaintext host:port list`, `package.Service/Method`, `-H` / `-rpc-header`, etc.). Confirm this is grpcurl CLI text.",
        });
    }
    const hasPlaintext = flagSet.has("-plaintext");
    const hasInsecure = flagSet.has("-insecure");
    if (hasCli && (hasPlaintext || hasInsecure)) {
        findings.push({
            severity: "info",
            rule: "plaintext_insecure_tip",
            advice: hasPlaintext && hasInsecure
                ? "`-plaintext` disables TLS and `-insecure` skips cert verification. Prefer proper TLS (`-cacert` / `-cert` / `-key`) for non-local targets (educational tip only; does not run grpcurl)."
                : hasPlaintext
                    ? "`-plaintext` uses HTTP/2 without TLS. Fine for local lab ports; prefer TLS for anything beyond localhost (info only; does not run grpcurl)."
                    : "`-insecure` skips server certificate verification. Prefer a real CA / `-cacert` instead of disabling verification (info only; does not run grpcurl).",
        });
    }
    const hasProto = flagSet.has("-proto");
    const hasProtoset = flagSet.has("-protoset");
    const hasUseReflection = flagSet.has("-use-reflection");
    if (hasCli &&
        /\bgrpcurl(?:\.exe)?\b/i.test(raw) &&
        !hasProto &&
        !hasProtoset &&
        !hasUseReflection) {
        findings.push({
            severity: "info",
            rule: "missing_proto_tip",
            advice: "grpcurl CLI without `-proto` / `-protoset` / `-use-reflection` in this text. Server reflection may still work by default, but prefer an explicit descriptor source (`-proto` / `-protoset`) or `-use-reflection` so the call shape is reproducible offline.",
        });
    }
    const credPatterns = [
        /\b(?:password|passwd|pwd|secret|api[_-]?key|token|authorization)\s*[=:]\s*["'][^"']{3,}["']/i,
        /\bBearer\s+[A-Za-z0-9\-._~+/]+=*/,
        /-H\s+["']Authorization:\s*[^"']+["']/i,
        /--header(?:=|\s+)["']Authorization:\s*[^"']+["']/i,
        /-rpc-header(?:=|\s+)["'][^"']*Authorization:\s*[^"']+["']/i,
        /-reflect-metadata(?:=|\s+)["'][^"']*(?:Authorization|Bearer|api[_-]?key)[^"']*["']/i,
    ];
    let credHits = 0;
    for (const re of credPatterns) {
        credHits += countOccurrences(cleaned, re);
        credHits += countOccurrences(raw, re);
    }
    // Deduplicate double-count from cleaned+raw roughly
    if (credHits >= 1) {
        findings.push({
            severity: "warn",
            rule: "hardcoded_bearer_tip",
            advice: `Found likely hardcoded Bearer / Authorization / credential pattern(s) in grpcurl metadata flags. Prefer env-expanded headers (e.g. \`-H "Authorization: Bearer $TOKEN"\`) so secrets stay out of pasted CLI text.`,
        });
    }
    if (hasCli &&
        /\bgrpcurl(?:\.exe)?\b/i.test(raw) &&
        targets.length === 0) {
        // list/describe without host is incomplete
        const invs = parseAllInvocations(raw);
        const hasSymbol = invs.some((inv) => inv.positionals.some((p) => /^(list|describe)$/i.test(p) ||
            looksLikeMethodSymbol(p) ||
            looksLikeService(p)));
        if (hasSymbol || methods.length > 0 || services.length > 0 || invs.length > 0) {
            findings.push({
                severity: "info",
                rule: "missing_target_tip",
                advice: "grpcurl CLI without a host:port (or dns:/// / unix:) target in this text. grpcurl needs an address before `list` / `describe` / `package.Service/Method`.",
            });
        }
    }
    return findings;
}
