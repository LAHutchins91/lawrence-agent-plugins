/**
 * Best-effort siege CLI / urls.txt / .siegerc text heuristics.
 * No siege runtime, no network, no filesystem follow, no eval.
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
const INVOCATION_RE = /(^|[;&|]\s*)((?:[\w./~-]*\/)?siege(?:\.exe)?)\b(.*)$/i;
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
    "--concurrent": "-c",
    "--reps": "-r",
    "--time": "-t",
    "--delay": "-d",
    "--file": "-f",
    "--internet": "-i",
    "--benchmark": "-b",
    "--get": "-g",
    "--url": "-u",
    "--header": "-H",
    "--user-agent": "-A",
    "--content-type": "-T",
    "--log": "-l",
    "--mark": "-m",
    "--rc": "-R",
    "--verbose": "-v",
    "--quiet": "-q",
    "--json-output": "-j",
    "--no-parser": "-n",
    "--no-follow": "--no-follow",
    "--help": "--help",
    "--version": "-V",
    "--config": "-C",
};
const BOOL_FLAGS = new Set([
    "-i",
    "-b",
    "-v",
    "-q",
    "-j",
    "-n",
    "-g",
    "-C",
    "-V",
    "--internet",
    "--benchmark",
    "--verbose",
    "--quiet",
    "--json-output",
    "--no-parser",
    "--no-follow",
    "--get",
    "--help",
    "--version",
    "--config",
    "-h",
]);
const VALUE_SHORT = new Set([
    "c",
    "r",
    "t",
    "d",
    "f",
    "u",
    "H",
    "A",
    "T",
    "l",
    "m",
    "R",
    "g",
]);
function normalizeFlag(rawFlag) {
    return LONG_TO_SHORT[rawFlag] ?? rawFlag;
}
const KNOWN_LONG = new Set(Object.keys(LONG_TO_SHORT));
/** .siegerc key → short CLI flag */
const RC_KEY_TO_FLAG = {
    concurrent: "-c",
    reps: "-r",
    time: "-t",
    delay: "-d",
    file: "-f",
    internet: "-i",
    benchmark: "-b",
    verbose: "-v",
    quiet: "-q",
    logfile: "-l",
    "log-file": "-l",
    url: "-u",
    "user-agent": "-A",
    protocol: "--protocol",
    connection: "--connection",
    timeout: "--timeout",
    parser: "-n",
    cache: "--cache",
    header: "-H",
};
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
            // -g can take optional URL
            if (flag === "-g" && value === undefined) {
                const nxt = tokens[i + 1];
                if (nxt !== undefined && looksLikeUrl(nxt)) {
                    value = cleanUrl(nxt);
                    i++;
                }
            }
            push(flag, value, idx);
            continue;
        }
        if (tok.startsWith("-") && tok.length >= 2 && tok[1] !== "-") {
            // -c / -c25 / -b / -gURL
            const letter = tok[1];
            const rawFlag = "-" + letter;
            const glued = tok.slice(2);
            const flag = normalizeFlag(rawFlag);
            const isBool = BOOL_FLAGS.has(rawFlag) || BOOL_FLAGS.has(flag);
            let value;
            if (glued) {
                value = glued;
            }
            else if (!isBool || letter === "g") {
                const nxt = tokens[i + 1];
                if (nxt !== undefined && !nxt.startsWith("-")) {
                    // for bool -g, only take next if URL-like
                    if (letter === "g") {
                        if (looksLikeUrl(nxt)) {
                            value = cleanUrl(nxt);
                            i++;
                        }
                    }
                    else {
                        value = nxt;
                        i++;
                    }
                }
            }
            push(flag, value, idx);
        }
    }
}
/** Detect urls.txt-style content (lines that look like URL list, not siege CLI). */
function looksLikeUrlsFile(raw) {
    const lines = raw
        .replace(/^\uFEFF/, "")
        .replace(/\r\n/g, "\n")
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith("#"));
    if (lines.length === 0)
        return false;
    if (/\bsiege(?:\.exe)?\b/i.test(raw))
        return false;
    // majority of non-empty lines look like URLs or METHOD URL
    let urlish = 0;
    for (const l of lines) {
        if (/^https?:\/\//i.test(l) ||
            /^(GET|POST|PUT|DELETE|PATCH|HEAD)\s+https?:\/\//i.test(l) ||
            looksLikeUrl(l.split(/\s+/)[0] ?? "")) {
            urlish++;
        }
    }
    return urlish >= 1 && urlish >= Math.ceil(lines.length * 0.5);
}
/**
 * List URLs from urls.txt lines or siege CLI invocations.
 */
export function listUrls(text) {
    const raw = (text ?? "").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
    const urls = [];
    const seen = new Set();
    const push = (url) => {
        const u = url?.trim();
        if (!u)
            return;
        if (seen.has(u))
            return;
        seen.add(u);
        urls.push(u);
    };
    // urls.txt style: one URL (or METHOD URL …) per line
    if (looksLikeUrlsFile(raw) || (!/\bsiege(?:\.exe)?\b/i.test(raw) && /https?:\/\//i.test(raw))) {
        for (const line of raw.split("\n")) {
            const cleaned = line.replace(/(^|\s)#.*$/, "$1").trim();
            if (!cleaned)
                continue;
            // METHOD URL [body…]
            const methodUrl = cleaned.match(/^(?:GET|POST|PUT|DELETE|PATCH|HEAD)\s+(https?:\/\/\S+)/i);
            if (methodUrl) {
                push(cleanUrl(methodUrl[1]));
                continue;
            }
            if (looksLikeUrl(cleaned.split(/\s+/)[0] ?? "")) {
                push(cleanUrl(cleaned.split(/\s+/)[0]));
                continue;
            }
            let um;
            const urlRe = new RegExp(URL_RE.source, "gi");
            while ((um = urlRe.exec(cleaned))) {
                push(cleanUrl(um[0]));
            }
        }
    }
    // siege CLI invocations
    const lines = raw.split("\n");
    for (const line of lines) {
        const cleanedLine = line.replace(/(^|\s)#.*$/, "$1");
        const inv = cleanedLine.match(INVOCATION_RE);
        if (inv) {
            const args = inv[3] ?? "";
            const tokens = tokenizeArgs(args);
            // -g URL / --get URL / -u URL
            for (let i = 0; i < tokens.length; i++) {
                const tok = tokens[i];
                if (/^--get(?:=|$)/.test(tok) || tok === "-g" || /^--url(?:=|$)/.test(tok) || tok === "-u") {
                    const eq = tok.indexOf("=");
                    if (eq !== -1) {
                        push(cleanUrl(tok.slice(eq + 1)));
                    }
                    else {
                        const nxt = tokens[i + 1];
                        if (nxt && looksLikeUrl(nxt))
                            push(cleanUrl(nxt));
                    }
                }
                if (/^-g.+/.test(tok) && looksLikeUrl(tok.slice(2))) {
                    push(cleanUrl(tok.slice(2)));
                }
            }
            // trailing positional URL
            for (let i = tokens.length - 1; i >= 0; i--) {
                const tok = tokens[i];
                if (tok.startsWith("-"))
                    continue;
                const prev = tokens[i - 1];
                const prevIsValueFlag = prev !== undefined &&
                    (/^--[A-Za-z][\w-]*$/.test(prev) ||
                        (/^-[crtdfuHATlmRg]$/.test(prev) && VALUE_SHORT.has(prev.slice(1))));
                if (prevIsValueFlag && !looksLikeUrl(tok))
                    continue;
                if (looksLikeUrl(tok)) {
                    push(cleanUrl(tok));
                    break;
                }
            }
            let um;
            const urlRe = new RegExp(URL_RE.source, "gi");
            while ((um = urlRe.exec(args))) {
                push(cleanUrl(um[0]));
            }
        }
    }
    // Fallback: if siege appears and still empty, harvest any http(s) URLs
    if (urls.length === 0 && /\bsiege(?:\.exe)?\b/i.test(raw)) {
        const cleaned = stripComments(raw);
        let um;
        const urlRe = new RegExp(URL_RE.source, "gi");
        while ((um = urlRe.exec(cleaned))) {
            push(cleanUrl(um[0]));
        }
    }
    return { urls, count: urls.length };
}
/** Parse .siegerc-style `key = value` lines into option-like entries. */
function listSiegercOptions(text, push) {
    const raw = (text ?? "").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
    const lines = raw.split("\n");
    let offset = 0;
    for (const line of lines) {
        const cleaned = line.replace(/(^|\s)#.*$/, "$1").trim();
        const m = cleaned.match(/^([A-Za-z][\w-]*)\s*=\s*(.+?)\s*$/);
        if (m) {
            const key = m[1].toLowerCase();
            let value = m[2].trim().replace(/^['"]|['"]$/g, "");
            const flag = RC_KEY_TO_FLAG[key] ?? ("--" + key);
            // boolean true/false for internet/benchmark → flag without value when true
            if ((key === "internet" || key === "benchmark" || key === "verbose" || key === "quiet") &&
                /^(true|on|yes|1)$/i.test(value)) {
                push(flag, undefined, offset);
            }
            else if ((key === "internet" || key === "benchmark") &&
                /^(false|off|no|0)$/i.test(value)) {
                // skip false bools
            }
            else {
                push(flag, value, offset);
            }
        }
        offset += line.length + 1;
    }
}
function looksLikeSiegerc(raw) {
    if (/\bsiege(?:\.exe)?\b/i.test(raw) && INVOCATION_RE.test(raw)) {
        // mixed pastes may include both
    }
    const keys = /^\s*(concurrent|reps|time|delay|file|internet|benchmark|verbose|quiet|logfile|protocol|connection|timeout)\s*=/im;
    return keys.test(raw);
}
/**
 * Extract CLI options from siege invocations and/or .siegerc key = value.
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
    let foundInv = false;
    for (const line of lines) {
        const cleanedLine = line.replace(/(^|\s)#.*$/, "$1");
        const inv = cleanedLine.match(INVOCATION_RE);
        if (inv) {
            foundInv = true;
            const args = inv[3] ?? "";
            const absBase = offset + cleanedLine.indexOf(inv[2]);
            parseFlagTokens(args, absBase, push);
        }
        offset += line.length + 1;
    }
    if (looksLikeSiegerc(raw)) {
        listSiegercOptions(raw, push);
    }
    if (!foundInv && options.length === 0 && /\bsiege(?:\.exe)?\b/i.test(raw)) {
        parseFlagTokens(stripComments(raw), 0, push);
    }
    return { options, count: options.length };
}
function coerceNumOrStr(v) {
    if (/^\d+$/.test(v))
        return Number(v);
    if (/^\d+\.\d+$/.test(v))
        return Number(v);
    return v;
}
/**
 * Extract concurrency-related settings: concurrent / reps / time.
 */
export function concurrencyHint(text) {
    const { options } = listOptions(text);
    const out = {};
    const c = options.find((o) => o.flag === "-c");
    const r = options.find((o) => o.flag === "-r");
    const t = options.find((o) => o.flag === "-t");
    if (c?.value !== undefined)
        out.concurrent = coerceNumOrStr(c.value);
    if (r?.value !== undefined)
        out.reps = coerceNumOrStr(r.value);
    if (t?.value !== undefined)
        out.time = String(t.value);
    // Also scan .siegerc keys directly if options missed them
    if (out.concurrent === undefined || out.reps === undefined || out.time === undefined) {
        const cleaned = stripComments(text ?? "");
        const pairs = [
            ["concurrent", /^\s*concurrent\s*=\s*(\S+)/im],
            ["reps", /^\s*reps\s*=\s*(\S+)/im],
            ["time", /^\s*time\s*=\s*(\S+)/im],
        ];
        for (const [key, re] of pairs) {
            if (out[key] !== undefined)
                continue;
            const m = cleaned.match(re);
            if (m) {
                const v = m[1].replace(/^['"]|['"]$/g, "");
                if (key === "time")
                    out.time = v;
                else
                    out[key] = coerceNumOrStr(v);
            }
        }
    }
    return out;
}
function hasSiegeSignal(raw, cleaned) {
    return (/\bsiege(?:\.exe)?\b/i.test(raw) ||
        looksLikeSiegerc(raw) ||
        looksLikeUrlsFile(raw) ||
        listOptions(raw).count > 0 ||
        listUrls(raw).count > 0 ||
        /^\s*(concurrent|reps|time|delay)\s*=/im.test(cleaned));
}
export function lintSiege(text) {
    const findings = [];
    const raw = text ?? "";
    if (!raw.trim()) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Source text is empty. Paste a siege CLI line (e.g. `siege -c 25 -r 10 -d 1 -f urls.txt`), urls.txt contents, or `.siegerc` `key = value` lines.",
        });
        return findings;
    }
    const cleaned = stripComments(raw);
    const { options } = listOptions(raw);
    const { urls } = listUrls(raw);
    const conc = concurrencyHint(raw);
    if (!hasSiegeSignal(raw, cleaned)) {
        findings.push({
            severity: "warn",
            rule: "no_siege_detected",
            advice: "No siege signals detected (`siege -c` / `-f urls.txt` / `.siegerc` `concurrent = …`, etc.). Confirm this is siege CLI, urls.txt, or .siegerc text.",
        });
    }
    const hasCli = options.length > 0 || /\bsiege(?:\.exe)?\b/i.test(raw);
    const flags = new Set(options.map((o) => o.flag));
    const hasC = flags.has("-c") || conc.concurrent !== undefined;
    const hasR = flags.has("-r") || conc.reps !== undefined;
    const hasT = flags.has("-t") || conc.time !== undefined;
    const hasD = flags.has("-d");
    const hasB = flags.has("-b");
    const hasF = flags.has("-f");
    const hasG = flags.has("-g");
    const isUrlsOnly = looksLikeUrlsFile(raw) && !/\bsiege(?:\.exe)?\b/i.test(raw);
    if (hasCli &&
        /\bsiege(?:\.exe)?\b/i.test(raw) &&
        !hasC &&
        !isUrlsOnly) {
        findings.push({
            severity: "info",
            rule: "missing_c_tip",
            advice: "siege CLI signals without `-c` / `--concurrent` (or `.siegerc` `concurrent =`) in this text. Set concurrent users explicitly so load shape is reproducible.",
        });
    }
    if (hasCli &&
        /\bsiege(?:\.exe)?\b/i.test(raw) &&
        !hasR &&
        !hasT &&
        !isUrlsOnly) {
        findings.push({
            severity: "info",
            rule: "missing_rt_tip",
            advice: "siege CLI without `-r` / `--reps` and without `-t` / `--time` in this text. Prefer an explicit repetition count or duration so the run cannot continue unbounded (heuristic only).",
        });
    }
    if (hasB && !hasD) {
        findings.push({
            severity: "info",
            rule: "benchmark_without_delay_tip",
            advice: "`-b` / `--benchmark` (or `benchmark = true`) removes inter-request delay. For load testing (not pure throughput benchmarking), prefer an explicit `-d` / `--delay` instead of `-b` (educational tip only; does not run siege).",
        });
    }
    if (hasCli &&
        /\bsiege(?:\.exe)?\b/i.test(raw) &&
        urls.length === 0 &&
        !hasF &&
        !hasG) {
        findings.push({
            severity: "info",
            rule: "no_url_tip",
            advice: "siege CLI without a trailing URL, `-g` / `--get`, or `-f` / `--file` (urls.txt) in this text. siege needs a URL, get target, or URL file.",
        });
    }
    if (isUrlsOnly && urls.length === 0) {
        findings.push({
            severity: "info",
            rule: "no_url_tip",
            advice: "urls.txt-style text without parseable http(s) URLs. List one URL per line (optional `METHOD URL`).",
        });
    }
    const credPatterns = [
        /\b(?:password|passwd|pwd|secret|api[_-]?key|token|authorization)\s*[=:]\s*["'][^"']{3,}["']/i,
        /\bBearer\s+[A-Za-z0-9\-._~+/]+=*/,
        /-H\s+["']Authorization:\s*[^"']+["']/i,
        /--header(?:=|\s+)["']Authorization:\s*[^"']+["']/i,
        /^\s*header\s*=\s*Authorization:/im,
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
            advice: `Found ${credHits}× likely hardcoded credential / Authorization pattern(s). Prefer env-injected headers so tokens stay out of CLI / .siegerc text.`,
        });
    }
    if (typeof conc.concurrent === "number" &&
        conc.concurrent >= 10000) {
        findings.push({
            severity: "info",
            rule: "high_concurrent_tip",
            advice: `\`-c ${conc.concurrent}\` / concurrent=${conc.concurrent} is very high. Confirm the client and target can sustain that many concurrent users (heuristic only; does not run siege).`,
        });
    }
    if (urls.some((u) => /^http:\/\//i.test(u))) {
        findings.push({
            severity: "info",
            rule: "http_target_tip",
            advice: "http:// target (non-TLS) — prefer https:// when possible (info only; does not run siege).",
        });
    }
    return findings;
}
