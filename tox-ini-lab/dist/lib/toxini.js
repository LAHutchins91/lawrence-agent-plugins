/**
 * Shared tox.ini text helpers.
 * String heuristics only — no tox binary, no network, no venv.
 */
/** Strip inline comments carefully: # starts comment unless inside quotes (best-effort). */
function stripInlineComment(line) {
    let inSingle = false;
    let inDouble = false;
    for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === "'" && !inDouble)
            inSingle = !inSingle;
        else if (c === '"' && !inSingle)
            inDouble = !inDouble;
        else if (c === "#" && !inSingle && !inDouble) {
            return line.slice(0, i).trimEnd();
        }
    }
    return line;
}
/**
 * Parse tox.ini-ish INI text into sections with multiline values.
 * Continuation: blank-leading (space/tab) lines append to the current key.
 */
export function parseToxIni(text) {
    const raw = text ?? "";
    if (!raw.trim()) {
        return { sections: [], empty: true };
    }
    const lines = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
    const sections = [];
    let current = null;
    let currentKey = null;
    for (let i = 0; i < lines.length; i++) {
        const lineNo = i + 1;
        const rawLine = lines[i];
        const stripped = stripInlineComment(rawLine);
        const trimmed = stripped.trim();
        // Section header
        const secMatch = trimmed.match(/^\[([^\]]+)\]$/);
        if (secMatch && !/^\s/.test(rawLine)) {
            const name = secMatch[1].trim();
            current = {
                name,
                key: name.toLowerCase(),
                props: {},
                line: lineNo,
            };
            sections.push(current);
            currentKey = null;
            continue;
        }
        if (!current)
            continue;
        // Continuation of previous value (indented / leading whitespace)
        if (/^\s/.test(rawLine) && currentKey) {
            if (!trimmed)
                continue; // blank continuation line — skip
            const prev = current.props[currentKey] ?? "";
            current.props[currentKey] = prev ? prev + "\n" + trimmed : trimmed;
            continue;
        }
        if (!trimmed) {
            // blank non-continuation — do not clear key (tox allows blank between?)
            // Keep currentKey so a following indented line still continues; tox usually
            // uses indentation immediately. Clearing is safer for next bare key.
            continue;
        }
        // key = value  OR  key=
        const eq = trimmed.indexOf("=");
        if (eq === -1)
            continue;
        const key = trimmed.slice(0, eq).trim().toLowerCase();
        const value = trimmed.slice(eq + 1).trim();
        if (!key)
            continue;
        currentKey = key;
        current.props[key] = value;
    }
    return { sections, empty: false };
}
export function getSection(parsed, name) {
    const k = name.toLowerCase();
    return parsed.sections.find((s) => s.key === k);
}
export function getToxSection(parsed) {
    return getSection(parsed, "tox");
}
/** All [testenv] and [testenv:NAME] sections */
export function getTestenvSections(parsed) {
    return parsed.sections.filter((s) => s.key === "testenv" || s.key.startsWith("testenv:"));
}
/** Friendly env name: [testenv] → "testenv", [testenv:py310] → "py310" */
export function testenvName(section) {
    if (section.key === "testenv")
        return "testenv";
    if (section.key.startsWith("testenv:"))
        return section.name.slice("testenv:".length);
    return section.name;
}
/**
 * Split a tox list value on commas, respecting braces for factors.
 * Also splits on newlines (each non-empty line is a token, then comma-split).
 */
export function splitToxList(value) {
    if (!value || !value.trim())
        return [];
    const tokens = [];
    for (const line of value.split("\n")) {
        const t = line.trim();
        if (!t || t === "\\")
            continue;
        // remove trailing backslash continuations used in some tox files
        const cleaned = t.replace(/\\$/, "").trim();
        if (!cleaned)
            continue;
        tokens.push(...splitCommaRespectingBraces(cleaned));
    }
    return tokens.filter(Boolean);
}
function splitCommaRespectingBraces(s) {
    const out = [];
    let depth = 0;
    let cur = "";
    for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (c === "{")
            depth++;
        else if (c === "}")
            depth = Math.max(0, depth - 1);
        if (c === "," && depth === 0) {
            const t = cur.trim();
            if (t)
                out.push(t);
            cur = "";
            continue;
        }
        cur += c;
    }
    const t = cur.trim();
    if (t)
        out.push(t);
    return out;
}
/**
 * Best-effort expand simple factor forms like py{310,311} or
 * py3{9,10}-django{42,50} (cartesian over brace groups).
 */
export function expandFactors(token) {
    const t = token.trim();
    if (!t)
        return [];
    if (!t.includes("{"))
        return [t];
    const m = t.match(/\{([^{}]+)\}/);
    if (!m || m.index === undefined)
        return [t];
    const parts = m[1].split(",").map((x) => x.trim()).filter(Boolean);
    if (parts.length === 0)
        return [t];
    const before = t.slice(0, m.index);
    const after = t.slice(m.index + m[0].length);
    const results = [];
    for (const p of parts) {
        for (const rest of expandFactors(before + p + after)) {
            results.push(rest);
        }
    }
    // de-dupe while preserving order
    const seen = new Set();
    const uniq = [];
    for (const r of results) {
        if (!seen.has(r)) {
            seen.add(r);
            uniq.push(r);
        }
    }
    return uniq;
}
export function expandEnvlist(raw) {
    const envlist = splitToxList(raw);
    const expanded = [];
    const seen = new Set();
    for (const tok of envlist) {
        for (const e of expandFactors(tok)) {
            if (!seen.has(e)) {
                seen.add(e);
                expanded.push(e);
            }
        }
    }
    return { envlist, expanded };
}
/** Split multiline command/deps values into individual items (one per non-empty line, or comma for single-line). */
export function splitMultilineItems(value) {
    if (!value || !value.trim())
        return [];
    const lines = value.split("\n").map((l) => l.trim()).filter(Boolean);
    // If single line with commas and no spaces-as-commands heuristic — keep as one
    // item unless it looks like a dep list (handled by caller). For commands, tox
    // uses one command per line when multiline; single-line is one command.
    return lines;
}
export function splitDepsItems(value) {
    if (!value || !value.trim())
        return [];
    const items = [];
    for (const line of value.split("\n")) {
        const t = line.trim();
        if (!t)
            continue;
        // deps can be comma-separated on one line
        if (t.includes(",") && !t.includes("{")) {
            for (const part of t.split(",")) {
                const p = part.trim();
                if (p)
                    items.push(p);
            }
        }
        else {
            items.push(t);
        }
    }
    return items;
}
const SECRET_PASSENV_RE = /^(.*_)?(PASSWORD|SECRET|TOKEN|API_?KEY|ACCESS_?KEY|PRIVATE_?KEY|CREDENTIALS?|AUTH|PASSWD)$/i;
export function looksLikeSecretPassenv(name) {
    const n = name.trim();
    if (!n)
        return false;
    if (SECRET_PASSENV_RE.test(n))
        return true;
    // also catch embedded smells: FOO_SECRET_BAR
    if (/(PASSWORD|SECRET|TOKEN|API_?KEY|PRIVATE_?KEY)/i.test(n))
        return true;
    return false;
}
export function parsePassenv(value) {
    if (!value || !value.trim())
        return [];
    const names = [];
    for (const line of value.split("\n")) {
        const t = line.trim();
        if (!t)
            continue;
        for (const part of t.split(/[\s,]+/)) {
            const p = part.trim();
            if (p)
                names.push(p);
        }
    }
    return names;
}
