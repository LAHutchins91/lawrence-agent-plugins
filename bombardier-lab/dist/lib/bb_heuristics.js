/**
 * Best-effort bombardier CLI text heuristics.
 * No bombardier runtime, no network, no filesystem follow, no eval.
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
const URL_RE = /https?:\/\/[^\s"'`<>\\]+/gi;
const INVOCATION_RE = /(^|[;&|]\s*)((?:[\w./~-]*\/)?bombardier(?:\.exe)?)\b(.*)$/i;
function looksLikeUrl(tok) {
    if (!tok)
        return false;
    const t = tok.replace(/[),.;]+$/, "");
    return /^https?:\/\//i.test(t) || /^[a-z][a-z0-9+.-]*:\/\//i.test(t);
}
function cleanUrl(tok) {
    return tok.replace(/[),.;]+$/, "").replace(/^['"`]|['"`]$/g, "");
}
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
    "--connections": "-c",
    "--requests": "-n",
    "--duration": "-d",
    "--method": "-m",
    "--body": "-b",
    "--header": "-H",
    "--latencies": "-l",
    "--print": "-p",
    "--rate": "-r",
    "--timeout": "-t",
    "--body-file": "-f",
    "--stream": "-s",
    "--insecure": "-k",
    "--no-print": "-q",
    "--format": "-o",
    "--help": "--help",
    "--version": "--version",
    "--cert": "--cert",
    "--key": "--key",
    "--fasthttp": "--fasthttp",
    "--http1": "--http1",
    "--http2": "--http2",
};
const BOOL_FLAGS = new Set([
    "-l",
    "-s",
    "-k",
    "-q",
    "--latencies",
    "--stream",
    "--insecure",
    "--no-print",
    "--fasthttp",
    "--http1",
    "--http2",
    "--help",
    "--version",
    "-h",
]);
const VALUE_SHORT = new Set(["c", "n", "d", "m", "b", "H", "p", "r", "t", "f", "o"]);
function normalizeFlag(rawFlag) {
    return LONG_TO_SHORT[rawFlag] ?? rawFlag;
}
const KNOWN_LONG = new Set(Object.keys(LONG_TO_SHORT));
function parseFlagTokens(args, absBase, push) {
    const tokens = tokenizeArgs(args);
    let cursor = 0;
    for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        const tokIndex = args.indexOf(tok, cursor);
        const idx = absBase + (tokIndex >= 0 ? tokIndex : cursor);
        if (tokIndex >= 0)
            cursor = tokIndex + tok.length;
        if (tok.startsWith("--")) {
            const eq = tok.indexOf("=");
            const rawFlag = eq === -1 ? tok : tok.slice(0, eq);
            let value = eq === -1 ? undefined : tok.slice(eq + 1);
            if (!KNOWN_LONG.has(rawFlag) && rawFlag !== "--help" && rawFlag !== "--version") {
                // still record unknown long flags
            }
            const flag = normalizeFlag(rawFlag);
            const isBool = BOOL_FLAGS.has(rawFlag) || BOOL_FLAGS.has(flag);
            if (!isBool && value === undefined) {
                const nxt = tokens[i + 1];
                if (nxt !== undefined && !nxt.startsWith("-")) {
                    value = nxt;
                    i++;
                }
            }
            push(flag, value, idx);
            continue;
        }
        if (tok.startsWith("-") && tok.length >= 2 && tok[1] !== "-") {
            // -c / -c125 / -l
            const letter = tok[1];
            const rawFlag = "-" + letter;
            const glued = tok.slice(2);
            const flag = normalizeFlag(rawFlag);
            const isBool = BOOL_FLAGS.has(rawFlag) || BOOL_FLAGS.has(flag);
            let value;
            if (glued) {
                value = glued;
            }
            else if (!isBool) {
                const nxt = tokens[i + 1];
                if (nxt !== undefined && !nxt.startsWith("-")) {
                    value = nxt;
                    i++;
                }
            }
            push(flag, value, idx);
        }
    }
}
/**
 * List target URLs from bombardier invocations / trailing URLs.
 */
export function listTargets(text) {
    const raw = (text ?? "").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
    const targets = [];
    const seen = new Set();
    const push = (url) => {
        const u = url?.trim();
        if (!u)
            return;
        if (seen.has(u))
            return;
        seen.add(u);
        targets.push({ url: u });
    };
    const lines = raw.split("\n");
    for (const line of lines) {
        const cleanedLine = line.replace(/(^|\s)#.*$/, "$1");
        const inv = cleanedLine.match(INVOCATION_RE);
        if (inv) {
            const args = inv[3] ?? "";
            // trailing positional URL (last non-flag token that looks like a URL)
            const tokens = tokenizeArgs(args);
            for (let i = tokens.length - 1; i >= 0; i--) {
                const tok = tokens[i];
                if (tok.startsWith("-"))
                    continue;
                const prev = tokens[i - 1];
                const prevIsValueFlag = prev !== undefined &&
                    (/^--[A-Za-z][\w-]*$/.test(prev) ||
                        (/^-[cnmdbHprtfo]$/.test(prev) && VALUE_SHORT.has(prev.slice(1))));
                if (prevIsValueFlag && !looksLikeUrl(tok))
                    continue;
                if (looksLikeUrl(tok) || /^https?:\/\//i.test(tok)) {
                    push(cleanUrl(tok));
                    break;
                }
            }
            // any http(s) URLs in the invocation args
            let um;
            const urlRe = new RegExp(URL_RE.source, "gi");
            while ((um = urlRe.exec(args))) {
                push(cleanUrl(um[0]));
            }
        }
    }
    // Fallback: if bombardier appears, harvest any http(s) URLs in the text
    if (targets.length === 0 && /\bbombardier(?:\.exe)?\b/i.test(raw)) {
        const cleaned = stripComments(raw);
        let um;
        const urlRe = new RegExp(URL_RE.source, "gi");
        while ((um = urlRe.exec(cleaned))) {
            push(cleanUrl(um[0]));
        }
    }
    return { targets, count: targets.length };
}
/**
 * Extract CLI options from bombardier invocations.
 */
export function listOptions(text) {
    const raw = (text ?? "").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
    const options = [];
    const seen = new Set();
    const push = (flag, value, index) => {
        const key = `${flag}|${value ?? ""}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        const entry = { flag };
        if (value !== undefined && value !== "")
            entry.value = value;
        options.push(entry);
    };
    const lines = raw.split("\n");
    let offset = 0;
    for (const line of lines) {
        const cleanedLine = line.replace(/(^|\s)#.*$/, "$1");
        const inv = cleanedLine.match(INVOCATION_RE);
        if (inv) {
            const args = inv[3] ?? "";
            const absBase = offset + cleanedLine.indexOf(inv[2]);
            parseFlagTokens(args, absBase, push);
        }
        offset += line.length + 1;
    }
    if (options.length === 0 && /\bbombardier(?:\.exe)?\b/i.test(raw)) {
        parseFlagTokens(stripComments(raw), 0, push);
    }
    return { options, count: options.length };
}
/**
 * Latency / print related flags: printLatencies, -l, -p, …
 */
export function listLatency(text) {
    const raw = (text ?? "").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
    const cleaned = stripComments(raw);
    const latency = [];
    const seen = new Set();
    const push = (kind, index) => {
        const key = `${kind}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        latency.push({ kind });
    };
    const patterns = [
        { kind: "printLatencies", re: /\bprintLatencies\b/g },
        { kind: "-l", re: /(?:^|[\s;|&])-l(?:\s|$|=)/g },
        { kind: "-l", re: /(?:^|[\s;|&])--latencies\b/g },
        { kind: "printLatencies", re: /(?:^|[\s;|&])(?:-l|--latencies)\b/g },
        { kind: "-p", re: /(?:^|[\s;|&])-p(?:\s|$|=)/g },
        { kind: "-p", re: /(?:^|[\s;|&])--print\b/g },
        { kind: "--no-print", re: /(?:^|[\s;|&])(?:-q|--no-print)\b/g },
        { kind: "WithLatencies", re: /\bWithLatencies\b/g },
    ];
    // Prefer scanning invocation lines; fall back to whole text if bombardier present
    const lines = cleaned.split("\n");
    let offset = 0;
    let scannedInv = false;
    for (const line of lines) {
        if (INVOCATION_RE.test(line) || /\bbombardier(?:\.exe)?\b/i.test(line)) {
            scannedInv = true;
            for (const { kind, re } of patterns) {
                const r = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
                let m;
                while ((m = r.exec(line))) {
                    push(kind, offset + m.index);
                }
            }
        }
        offset += line.length + 1;
    }
    if (!scannedInv && /\bbombardier(?:\.exe)?\b/i.test(cleaned)) {
        for (const { kind, re } of patterns) {
            const r = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
            let m;
            while ((m = r.exec(cleaned))) {
                push(kind, m.index);
            }
        }
    }
    // Go-style config / comments mentioning printLatencies even without a CLI line
    if (latency.length === 0) {
        const ident = /\bprintLatencies\b/g;
        let m;
        while ((m = ident.exec(cleaned))) {
            push("printLatencies", m.index);
        }
    }
    return { latency, count: latency.length };
}
function hasBombardierSignal(raw, cleaned) {
    return (/\bbombardier(?:\.exe)?\b/i.test(raw) ||
        /\bprintLatencies\b/.test(cleaned) ||
        listOptions(raw).count > 0 ||
        listTargets(raw).count > 0);
}
export function lintBombardier(text) {
    const findings = [];
    const raw = text ?? "";
    if (!raw.trim()) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Source text is empty. Paste a bombardier CLI line (e.g. `bombardier -c 125 -n 10000 -d 10s -l https://example.com/`).",
        });
        return findings;
    }
    const cleaned = stripComments(raw);
    const { options } = listOptions(raw);
    const { targets } = listTargets(raw);
    const { latency } = listLatency(raw);
    if (!hasBombardierSignal(raw, cleaned)) {
        findings.push({
            severity: "warn",
            rule: "no_bombardier_detected",
            advice: "No bombardier signals detected (`bombardier -c` / `-n` / trailing `https://…`, etc.). Confirm this is bombardier CLI text.",
        });
    }
    const hasCli = options.length > 0 || /\bbombardier(?:\.exe)?\b/i.test(raw);
    const flags = new Set(options.map((o) => o.flag));
    const hasC = flags.has("-c");
    const hasN = flags.has("-n");
    const hasD = flags.has("-d");
    const hasL = flags.has("-l") || latency.some((l) => l.kind === "-l" || l.kind === "printLatencies");
    if (hasCli && /\bbombardier(?:\.exe)?\b/i.test(raw) && (!hasC || !hasN)) {
        const missing = [!hasC ? "-c/--connections" : null, !hasN ? "-n/--requests" : null]
            .filter(Boolean)
            .join(" and ");
        findings.push({
            severity: "info",
            rule: "missing_cn_tip",
            advice: `bombardier CLI signals without ${missing} in this text. Set connections (\`-c\`) and request count (\`-n\`) explicitly so load shape is reproducible.`,
        });
    }
    if (hasCli && /\bbombardier(?:\.exe)?\b/i.test(raw) && !hasD && !hasN) {
        findings.push({
            severity: "info",
            rule: "unbounded_duration_tip",
            advice: "bombardier CLI without `-d` / `--duration` and without `-n` / `--requests` in this text. Prefer an explicit duration (e.g. `-d 10s`) or request count so the run cannot continue unbounded.",
        });
    }
    else if (hasD) {
        const dur = options.find((o) => o.flag === "-d");
        if (dur?.value && /^(0|0s|0m|0h|0ms)$/i.test(dur.value)) {
            findings.push({
                severity: "warn",
                rule: "unbounded_duration_tip",
                advice: `Duration \`${dur.value}\` looks like zero — bombardier may not bound the run usefully. Prefer a positive duration such as \`10s\`.`,
            });
        }
    }
    if (hasCli && /\bbombardier(?:\.exe)?\b/i.test(raw) && targets.length === 0) {
        findings.push({
            severity: "info",
            rule: "no_url_tip",
            advice: "bombardier CLI without a trailing target URL in this text. bombardier requires a positional URL (`bombardier [flags] <url>`).",
        });
    }
    if (hasCli && /\bbombardier(?:\.exe)?\b/i.test(raw) && !hasL) {
        findings.push({
            severity: "info",
            rule: "missing_latencies_tip",
            advice: "bombardier CLI without `-l` / `--latencies` (`printLatencies`) in this text. Add `-l` to print latency distribution percentiles.",
        });
    }
    const credPatterns = [
        /\b(?:password|passwd|pwd|secret|api[_-]?key|token|authorization)\s*[=:]\s*["'][^"']{3,}["']/i,
        /\bBearer\s+[A-Za-z0-9\-._~+/]+=*/,
        /-H\s+["']Authorization:\s*[^"']+["']/i,
        /--header(?:=|\s+)["']Authorization:\s*[^"']+["']/i,
    ];
    let credHits = 0;
    for (const re of credPatterns) {
        credHits += countOccurrences(cleaned, re);
        credHits += countOccurrences(raw, re);
    }
    if (credHits >= 1) {
        findings.push({
            severity: "warn",
            rule: "hardcoded_credentials_tip",
            advice: `Found ${credHits}× likely hardcoded credential / Authorization pattern(s). Prefer env-injected headers so tokens stay out of CLI text.`,
        });
    }
    const conn = options.find((o) => o.flag === "-c");
    if (conn?.value && /^\d+$/.test(conn.value) && Number(conn.value) >= 10000) {
        findings.push({
            severity: "info",
            rule: "high_connections_tip",
            advice: `\`-c ${conn.value}\` is very high. Confirm the client and target can sustain that many concurrent connections (heuristic only; does not run bombardier).`,
        });
    }
    if (targets.some((t) => t.url && /^http:\/\//i.test(t.url))) {
        findings.push({
            severity: "info",
            rule: "http_target_tip",
            advice: "http:// target (non-TLS) — prefer https:// when possible (info only; does not run bombardier).",
        });
    }
    return findings;
}
