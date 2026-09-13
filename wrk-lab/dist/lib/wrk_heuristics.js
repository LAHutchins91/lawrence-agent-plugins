/**
 * Best-effort wrk / wrk2 Lua script + CLI text heuristics.
 * No wrk runtime, no network, no filesystem follow, no eval / no Lua VM.
 */
/** Strip Lua -- line comments and --[[ ]] block comments; leave strings roughly intact. */
export function stripLuaComments(raw) {
    const src = (raw ?? "").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
    let out = "";
    let i = 0;
    const n = src.length;
    let inString = false;
    let quote = "";
    let longClose = ""; // for [[...]] / [=[...]=]
    while (i < n) {
        const ch = src[i];
        const next = i + 1 < n ? src[i + 1] : "";
        if (longClose) {
            if (src.startsWith(longClose, i)) {
                out += longClose;
                i += longClose.length;
                longClose = "";
                continue;
            }
            out += ch;
            i++;
            continue;
        }
        if (inString) {
            out += ch;
            if (ch === "\\" && i + 1 < n) {
                out += src[i + 1];
                i += 2;
                continue;
            }
            if (ch === quote)
                inString = false;
            i++;
            continue;
        }
        // long string [[ or [=[
        if (ch === "[") {
            const long = src.slice(i).match(/^\[(=*)\[/);
            if (long) {
                longClose = "]" + long[1] + "]";
                out += long[0];
                i += long[0].length;
                continue;
            }
        }
        if (ch === '"' || ch === "'") {
            inString = true;
            quote = ch;
            out += ch;
            i++;
            continue;
        }
        // --[[ block ]] or -- comment
        if (ch === "-" && next === "-") {
            const after = src.slice(i + 2);
            const block = after.match(/^\[(=*)\[/);
            if (block) {
                const close = "]" + block[1] + "]";
                i += 2 + block[0].length;
                const end = src.indexOf(close, i);
                if (end === -1) {
                    i = n;
                }
                else {
                    i = end + close.length;
                }
                continue;
            }
            i += 2;
            while (i < n && src[i] !== "\n")
                i++;
            continue;
        }
        // shell # comments when scanning mixed CLI+Lua pastes
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
const KNOWN_HOOKS = ["setup", "init", "request", "response", "done"];
/**
 * List wrk Lua hook function definitions: setup / init / request / response / done.
 */
export function listHooks(text) {
    const cleaned = stripLuaComments(text ?? "");
    const hooks = [];
    const seen = new Set();
    const push = (name, index) => {
        const key = `${name}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        hooks.push({ name });
    };
    // function setup( / function init(args) / local function request()
    const fnRe = /\b(?:local\s+)?function\s+([A-Za-z_][\w]*)\s*\(/g;
    let m;
    while ((m = fnRe.exec(cleaned))) {
        const name = m[1];
        if (KNOWN_HOOKS.includes(name) ||
            /^(setup|init|request|response|done)_/.test(name)) {
            push(name, m.index);
        }
    }
    // Assigned form: request = function( / done = function(
    const assignRe = /\b(setup|init|request|response|done)\s*=\s*function\s*\(/g;
    while ((m = assignRe.exec(cleaned))) {
        push(m[1], m.index);
    }
    return { hooks, count: hooks.length };
}
const KNOWN_WRK_APIS = [
    "wrk.method",
    "wrk.headers",
    "wrk.body",
    "wrk.format",
    "wrk.scheme",
    "wrk.host",
    "wrk.port",
    "wrk.path",
    "wrk.query",
    "wrk.thread",
    "wrk.lookup",
    "wrk.connect",
];
/**
 * List wrk.* API uses from Lua script text.
 */
export function listWrkUses(text) {
    const cleaned = stripLuaComments(text ?? "");
    const wrkUses = [];
    const seen = new Set();
    const push = (api, index) => {
        const key = `${api}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        wrkUses.push({ api });
    };
    for (const api of KNOWN_WRK_APIS) {
        const re = new RegExp(String.raw `\b${api.replace(".", "\\.")}\b`, "g");
        let m;
        while ((m = re.exec(cleaned))) {
            push(api, m.index);
        }
    }
    // wrk.headers["X"] / wrk.headers['X'] / wrk.headers.X — already covered by wrk.headers
    // Generic wrk.<ident> not in known list
    const generic = /\bwrk\.([A-Za-z_][\w]*)\b/g;
    let m;
    while ((m = generic.exec(cleaned))) {
        const api = `wrk.${m[1]}`;
        if (!KNOWN_WRK_APIS.includes(api)) {
            push(api, m.index);
        }
    }
    return { wrkUses, count: wrkUses.length };
}
/** Known short and long CLI flags for wrk / wrk2. */
const FLAG_MAP = [
    { re: /(?:^|[\s;|&])(?:-c|--connections)\b/, flag: "-c" },
    { re: /(?:^|[\s;|&])(?:-d|--duration)\b/, flag: "-d" },
    { re: /(?:^|[\s;|&])(?:-t|--threads)\b/, flag: "-t" },
    { re: /(?:^|[\s;|&])(?:-R|--rate)\b/, flag: "-R" },
    { re: /(?:^|[\s;|&])(?:-s|--script)\b/, flag: "-s" },
    { re: /(?:^|[\s;|&])(?:-H|--header)\b/, flag: "-H" },
    { re: /(?:^|[\s;|&])(?:-L|--latency)\b/, flag: "-L" },
    { re: /(?:^|[\s;|&])(?:-v|--version)\b/, flag: "-v" },
    { re: /(?:^|[\s;|&])(?:-h|--help)\b/, flag: "-h" },
    { re: /(?:^|[\s;|&])--timeout\b/, flag: "--timeout" },
];
/**
 * Extract CLI options from shell/CLI lines invoking wrk / wrk2.
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
    // Scan line-by-line; only parse lines that look like wrk / wrk2 invocations
    const lines = raw.split("\n");
    let offset = 0;
    for (const line of lines) {
        const cleanedLine = line.replace(/(^|\s)#.*$/, "$1"); // strip shell comments
        const inv = cleanedLine.match(/(^|[;&|]\s*|^\s*)((?:[\w./-]*\/)?wrk2?(?:\.exe)?)\b(.*)$/i);
        if (inv) {
            const args = inv[3] ?? "";
            const absBase = offset + cleanedLine.indexOf(inv[2]);
            // Tokenize flags: -c 100, -c100, --connections=100, --connections 100, -s script.lua
            const flagRe = /(?:^|\s)(-[cHdtsTvLhR]|--(?:connections|duration|threads|script|header|timeout|latency|rate|version|help))(?:=|\s+)?([^\s-][^\s]*)?/g;
            let m;
            while ((m = flagRe.exec(args))) {
                const rawFlag = m[1];
                let value = m[2];
                // Normalize long → short where applicable
                const flag = rawFlag === "--connections"
                    ? "-c"
                    : rawFlag === "--duration"
                        ? "-d"
                        : rawFlag === "--threads"
                            ? "-t"
                            : rawFlag === "--script"
                                ? "-s"
                                : rawFlag === "--rate"
                                    ? "-R"
                                    : rawFlag === "--header"
                                        ? "-H"
                                        : rawFlag === "--latency"
                                            ? "-L"
                                            : rawFlag === "--version"
                                                ? "-v"
                                                : rawFlag === "--help"
                                                    ? "-h"
                                                    : rawFlag;
                // -L / -v / -h often take no value; if value looks like another flag, drop it
                if (value && /^-/.test(value))
                    value = undefined;
                // Combined short form already handled via (?:=|\s+)?; also -c100 style:
                if (!m[2] && /^-[cHdtsTR]$/.test(rawFlag)) {
                    // check glued digits after flag in original: -c100
                    const glued = args
                        .slice(m.index)
                        .match(new RegExp(String.raw `(?:^|\s)${rawFlag}(\d[\w.]*)`));
                    if (glued)
                        value = glued[1];
                }
                push(flag, value, absBase + (m.index ?? 0));
            }
            // Also catch bare -L (latency report) with no value
            if (/(?:^|\s)-L(?:\s|$)/.test(args) && !options.some((o) => o.flag === "-L")) {
                push("-L", undefined, absBase);
            }
        }
        else {
            // Fallback: if the whole text is a single CLI-ish paste without clear binary path,
            // still harvest flags when "wrk" appears somewhere nearby in the same paragraph.
            void FLAG_MAP;
        }
        offset += line.length + 1;
    }
    // If no invocation lines matched but text clearly has wrk CLI flags, harvest globally
    if (options.length === 0 && /\bwrk2?\b/i.test(raw)) {
        const flagRe = /(?:^|[\s;|&])(-[cHdtsTvLhR]|--(?:connections|duration|threads|script|header|timeout|latency|rate))(?:=|\s+)?([^\s-][^\s]*)?/g;
        let m;
        while ((m = flagRe.exec(raw))) {
            const rawFlag = m[1];
            let value = m[2];
            const flag = rawFlag === "--connections"
                ? "-c"
                : rawFlag === "--duration"
                    ? "-d"
                    : rawFlag === "--threads"
                        ? "-t"
                        : rawFlag === "--script"
                            ? "-s"
                            : rawFlag === "--rate"
                                ? "-R"
                                : rawFlag === "--header"
                                    ? "-H"
                                    : rawFlag === "--latency"
                                        ? "-L"
                                        : rawFlag === "--timeout"
                                            ? "--timeout"
                                            : rawFlag;
            if (value && /^-/.test(value))
                value = undefined;
            push(flag, value, m.index);
        }
    }
    return { options, count: options.length };
}
function hasWrkSignal(cleaned) {
    return (/\bwrk2?\b/i.test(cleaned) ||
        /\bfunction\s+(?:setup|init|request|response|done)\s*\(/.test(cleaned) ||
        /\b(?:setup|init|request|response|done)\s*=\s*function\s*\(/.test(cleaned) ||
        /\bwrk\.(?:method|headers|body|format|scheme|host|port|path)\b/.test(cleaned) ||
        listHooks(cleaned).count > 0 ||
        listWrkUses(cleaned).count > 0 ||
        listOptions(cleaned).count > 0);
}
export function lintWrk(text) {
    const findings = [];
    const raw = text ?? "";
    if (!raw.trim()) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Source text is empty. Paste a wrk/wrk2 Lua script (e.g. `function request()` / `wrk.method`) and/or a CLI line (`wrk -c 10 -d 30s -t 2 …`).",
        });
        return findings;
    }
    const cleaned = stripLuaComments(raw);
    const { hooks } = listHooks(cleaned);
    const { wrkUses } = listWrkUses(cleaned);
    const { options } = listOptions(raw);
    if (!hasWrkSignal(cleaned) && options.length === 0) {
        findings.push({
            severity: "warn",
            rule: "no_wrk_detected",
            advice: "No wrk/wrk2 signals detected (`function request()` / `wrk.method` / `wrk -c` / `wrk2 -R`, etc.). Confirm this is wrk Lua script or CLI text.",
        });
    }
    const hasCli = options.length > 0 || /\bwrk2?\b/i.test(raw);
    const flags = new Set(options.map((o) => o.flag));
    const hasC = flags.has("-c");
    const hasT = flags.has("-t");
    const hasD = flags.has("-d");
    const hasS = flags.has("-s");
    const hasR = flags.has("-R");
    // missing -c / -t tip when a wrk CLI line is present
    if (hasCli && /\bwrk2?\b/i.test(raw) && (!hasC || !hasT)) {
        const missing = [!hasC ? "-c/--connections" : null, !hasT ? "-t/--threads" : null]
            .filter(Boolean)
            .join(" and ");
        findings.push({
            severity: "info",
            rule: "missing_ct_tip",
            advice: `wrk/wrk2 CLI signals without ${missing} in this text. Set connections (\`-c\`) and threads (\`-t\`) explicitly so load shape is reproducible.`,
        });
    }
    // unbounded duration tip: CLI without -d, or -d 0 / missing
    if (hasCli && /\bwrk2?\b/i.test(raw) && !hasD) {
        findings.push({
            severity: "info",
            rule: "unbounded_duration_tip",
            advice: "wrk/wrk2 CLI without `-d` / `--duration` in this text. Prefer an explicit duration (e.g. `-d 30s`) so the run cannot continue unbounded.",
        });
    }
    else if (hasD) {
        const dur = options.find((o) => o.flag === "-d");
        if (dur?.value && /^(0|0s|0m|0h)$/i.test(dur.value)) {
            findings.push({
                severity: "warn",
                rule: "unbounded_duration_tip",
                advice: `Duration \`${dur.value}\` looks like zero — wrk may not bound the run usefully. Prefer a positive duration such as \`30s\`.`,
            });
        }
    }
    // no script tip: CLI present, Lua hooks absent, no -s
    const hasLua = hooks.length > 0 ||
        wrkUses.length > 0 ||
        /\bfunction\s+(?:request|response|done|init|setup)\s*\(/.test(cleaned);
    if (hasCli && /\bwrk2?\b/i.test(raw) && !hasS && !hasLua) {
        findings.push({
            severity: "info",
            rule: "no_script_tip",
            advice: "wrk/wrk2 CLI without `-s` / `--script` and no Lua hook definitions in this text. A Lua script is useful for custom method/headers/body (`wrk.method`, `wrk.headers`, `function request()`).",
        });
    }
    // wrk2 without rate
    if (/\bwrk2\b/i.test(raw) && hasCli && !hasR) {
        findings.push({
            severity: "info",
            rule: "wrk2_missing_rate_tip",
            advice: "`wrk2` without `-R` / `--rate` in this text. wrk2’s constant-throughput mode usually wants an explicit request rate (`-R`).",
        });
    }
    // Lua script with response/done missing when request present
    if (hooks.some((h) => h.name === "request") && !hooks.some((h) => h.name === "done")) {
        findings.push({
            severity: "info",
            rule: "missing_done_hook_tip",
            advice: "`function request()` without `function done(...)` in this text. A `done` hook is useful for printing latency percentiles / custom summaries.",
        });
    }
    // hardcoded credentials tip
    const credPatterns = [
        /\b(?:password|passwd|pwd|secret|api[_-]?key|token|authorization)\s*[=:]\s*["'][^"']{3,}["']/i,
        /\bwrk\.headers\s*[\[.]["']?Authorization["']?\s*[=,\]]\s*["'][^"']+["']/i,
        /\bBearer\s+[A-Za-z0-9\-._~+/]+=*/,
        /-H\s+["']Authorization:\s*[^"']+["']/i,
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
            advice: `Found ${credHits}× likely hardcoded credential / Authorization pattern(s). Prefer env-injected headers or a secrets manager so tokens stay out of Lua/CLI text.`,
        });
    }
    // method set but no body for POST/PUT/PATCH
    const methodUse = wrkUses.find((u) => u.api === "wrk.method");
    if (methodUse) {
        const methodAssign = cleaned.match(/\bwrk\.method\s*=\s*["'](POST|PUT|PATCH|DELETE)["']/i);
        const hasBody = /\bwrk\.body\s*=/.test(cleaned) || wrkUses.some((u) => u.api === "wrk.body");
        if (methodAssign && !hasBody && methodAssign[1] !== "DELETE") {
            findings.push({
                severity: "info",
                rule: "post_without_body_tip",
                advice: `\`wrk.method = "${methodAssign[1]}"\` without \`wrk.body\` in this text. POST/PUT/PATCH scripts usually set a body (and often \`Content-Type\` via \`wrk.headers\`).`,
            });
        }
    }
    return findings;
}
