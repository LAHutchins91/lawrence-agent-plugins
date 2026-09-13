/**
 * Shared Procfile text helpers.
 * String heuristics only — no network, no process spawn.
 *
 * Procfile lines: `name: command` (Heroku / Foreman / honcho style).
 * Blank lines and `#` comments are skipped.
 */
/** Common process type names seen on Heroku / 12-factor apps. */
const COMMON_TYPES = ["web", "worker"];
/** Names treated as web-like for $PORT heuristics. */
const WEB_LIKE = new Set([
    "web",
    "www",
    "http",
    "https",
    "api",
    "server",
    "app",
    "frontend",
    "backend",
]);
/** Valid process type name: letter start, then alnum / underscore. */
const NAME_RE = /^[A-Za-z][A-Za-z0-9_]*$/;
const ENV_REF_RE = /\$\{([A-Za-z_][A-Za-z0-9_]*)\}|\$([A-Za-z_][A-Za-z0-9_]*)/g;
function normalizeNewlines(text) {
    return (text ?? "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}
function stripInlineComment(line) {
    // Procfile comments are full-line `#` only in practice; still strip trailing
    // `# …` when not inside a simple single-quoted / double-quoted span.
    let out = "";
    let quote = null;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (quote) {
            out += ch;
            if (ch === "\\" && quote === '"') {
                out += line[i + 1] ?? "";
                i++;
                continue;
            }
            if (ch === quote)
                quote = null;
            continue;
        }
        if (ch === '"' || ch === "'") {
            quote = ch;
            out += ch;
            continue;
        }
        if (ch === "#")
            break;
        out += ch;
    }
    return out;
}
function hasPortRef(command) {
    return /\$\{PORT\}|\$PORT\b/.test(command);
}
function looksLikeBarePython(command) {
    // Leading or after separators: python / python3 / python3.x without -m gunicorn etc.
    // Heuristic: command mentions python binary and looks like a simple script/server.
    const trimmed = command.trim();
    if (!/(^|[\s;/\\])python(\d+(\.\d+)*)?(\s|$)/.test(" " + trimmed))
        return false;
    // Exclude common WSGI/ASGI runners that usually take a bind flag elsewhere
    if (/\b(gunicorn|uvicorn|hypercorn|daphne|waitress|uwsgi)\b/i.test(trimmed)) {
        return false;
    }
    return true;
}
function collectEnvRefs(command, processName) {
    const refs = [];
    const seen = new Set();
    ENV_REF_RE.lastIndex = 0;
    let m;
    while ((m = ENV_REF_RE.exec(command))) {
        const name = (m[1] ?? m[2] ?? "").trim();
        if (!name)
            continue;
        const raw = m[0];
        const key = `${processName ?? ""}|${name}|${raw}`;
        if (seen.has(key))
            continue;
        seen.add(key);
        const ref = { name };
        if (processName)
            ref.process = processName;
        ref.raw = raw;
        refs.push(ref);
    }
    return refs;
}
export function parseProcfileText(text) {
    const raw = normalizeNewlines(text ?? "");
    const lines = raw.split("\n");
    const entries = [];
    const findings = [];
    const refs = [];
    const nameLines = new Map();
    let contentish = false;
    let hasTab = false;
    for (let i = 0; i < lines.length; i++) {
        const lineNo = i + 1;
        const line = lines[i];
        if (line.includes("\t"))
            hasTab = true;
        const trimmedFull = line.trim();
        if (!trimmedFull)
            continue;
        if (trimmedFull.startsWith("#"))
            continue;
        contentish = true;
        const stripped = stripInlineComment(line).replace(/\s+$/, "");
        const trimmed = stripped.trim();
        if (!trimmed)
            continue;
        const colon = trimmed.indexOf(":");
        if (colon < 0) {
            findings.push({
                severity: "error",
                rule: "missing_colon",
                advice: `Line ${lineNo}: expected \`name: command\` but found no colon.`,
            });
            continue;
        }
        const name = trimmed.slice(0, colon).trim();
        const command = trimmed.slice(colon + 1).trim();
        if (!name) {
            findings.push({
                severity: "error",
                rule: "empty_name",
                advice: `Line ${lineNo}: process type name is empty before the colon.`,
            });
            continue;
        }
        if (!NAME_RE.test(name)) {
            findings.push({
                severity: "error",
                rule: "invalid_name_chars",
                advice: `Line ${lineNo}: process type "${name}" has invalid characters (use letters, digits, underscore; must start with a letter).`,
            });
        }
        if (!command) {
            findings.push({
                severity: "warning",
                rule: "empty_command",
                advice: `Line ${lineNo}: process type "${name}" has an empty command.`,
            });
        }
        entries.push({ name, command, line: lineNo });
        const seen = nameLines.get(name) ?? [];
        seen.push(lineNo);
        nameLines.set(name, seen);
        for (const r of collectEnvRefs(command, name)) {
            refs.push(r);
        }
    }
    const empty = !contentish;
    if (empty) {
        findings.push({
            severity: "info",
            rule: "empty_file",
            advice: "Procfile text is empty or comment-only — nothing to parse.",
        });
    }
    if (hasTab) {
        findings.push({
            severity: "warning",
            rule: "tabs",
            advice: "Procfile contains tab characters. Prefer spaces; some runners are picky about whitespace around `name:`.",
        });
    }
    for (const [name, lineNos] of nameLines) {
        if (lineNos.length > 1) {
            findings.push({
                severity: "error",
                rule: "duplicate_process",
                advice: `Process type "${name}" is declared more than once (lines ${lineNos.join(", ")}). Later runners usually keep only one.`,
            });
        }
    }
    if (!empty) {
        const names = new Set(entries.map((e) => e.name));
        const missingCommon = COMMON_TYPES.filter((n) => !names.has(n));
        if (missingCommon.length === COMMON_TYPES.length) {
            findings.push({
                severity: "info",
                rule: "missing_common_types",
                advice: "No `web` or `worker` process types found. Many 12-factor apps declare at least one of these (info only).",
            });
        }
        else if (missingCommon.includes("web") && !names.has("web")) {
            findings.push({
                severity: "info",
                rule: "missing_web",
                advice: "No `web` process type found. Platforms that expect an HTTP dyno often use the name `web` (info only).",
            });
        }
    }
    for (const entry of entries) {
        const webLike = WEB_LIKE.has(entry.name.toLowerCase());
        const port = hasPortRef(entry.command);
        if (webLike && entry.command && !port) {
            findings.push({
                severity: "warning",
                rule: "missing_port",
                advice: `Process "${entry.name}" looks web-like but its command does not reference $PORT / \${PORT}. Bind to the platform-assigned port when deploying.`,
            });
        }
        const serverish = webLike ||
            /http\.server|SimpleHTTPServer|flask\s+run|manage\.py\s+runserver/i.test(entry.command);
        if (looksLikeBarePython(entry.command) && !port && serverish) {
            findings.push({
                severity: "warning",
                rule: "bare_python_no_port",
                advice: `Process "${entry.name}" runs bare python without $PORT / \${PORT}. Prefer an explicit bind (e.g. \`python -m http.server $PORT\`) or a proper app server.`,
            });
        }
    }
    return { entries, refs, findings, empty };
}
export function parseEntries(text) {
    const parsed = parseProcfileText(text);
    return { entries: parsed.entries, count: parsed.entries.length };
}
export function listProcesses(text) {
    const parsed = parseProcfileText(text);
    const processes = parsed.entries.map((e) => e.name);
    return { processes, count: processes.length };
}
export function listEnvRefs(text) {
    const parsed = parseProcfileText(text);
    const unique = [];
    const seen = new Set();
    for (const r of parsed.refs) {
        if (!seen.has(r.name)) {
            seen.add(r.name);
            unique.push(r.name);
        }
    }
    return { refs: parsed.refs, unique, count: parsed.refs.length };
}
export function lintProcfile(text) {
    return parseProcfileText(text).findings;
}
