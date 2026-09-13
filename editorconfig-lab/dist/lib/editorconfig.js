/**
 * Shared .editorconfig text helpers.
 * Pure string analysis — no network, no filesystem walks beyond pasted text.
 *
 * EditorConfig is INI-like: optional root=true, [#|;] comments, [glob] sections,
 * key = value properties. Glob matching is best-effort EditorConfig rules.
 */
const KNOWN_KEYS = new Set([
    "indent_style",
    "indent_size",
    "tab_width",
    "end_of_line",
    "charset",
    "trim_trailing_whitespace",
    "insert_final_newline",
    "max_line_length",
    "root",
]);
const VALID_INDENT_STYLE = new Set(["tab", "space"]);
const VALID_END_OF_LINE = new Set(["lf", "cr", "crlf"]);
const VALID_CHARSET = new Set([
    "latin1",
    "utf-8",
    "utf-8-bom",
    "utf-16be",
    "utf-16le",
]);
const VALID_BOOL = new Set(["true", "false"]);
function stripComment(line) {
    let inEscape = false;
    for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (inEscape) {
            inEscape = false;
            continue;
        }
        if (c === "\\") {
            inEscape = true;
            continue;
        }
        if (c === "#" || c === ";") {
            return line.slice(0, i).trimEnd();
        }
    }
    return line;
}
/**
 * Parse INI-like .editorconfig text into root flag + sections.
 */
export function parseEditorConfigText(text) {
    const lines = String(text ?? "").split(/\r?\n/);
    const sections = [];
    let current = null;
    let root;
    for (const rawLine of lines) {
        const trimmed = rawLine.trim();
        if (trimmed === "")
            continue;
        if (trimmed.startsWith("#") || trimmed.startsWith(";"))
            continue;
        const line = stripComment(rawLine).trim();
        if (line === "")
            continue;
        const sectionMatch = line.match(/^\[(.+)\]$/);
        if (sectionMatch) {
            const name = sectionMatch[1];
            current = {
                name: `[${name}]`,
                glob: name,
                properties: {},
            };
            sections.push(current);
            continue;
        }
        const eq = line.indexOf("=");
        if (eq === -1)
            continue;
        const key = line.slice(0, eq).trim().toLowerCase();
        let value = line.slice(eq + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        if (!current) {
            if (key === "root") {
                root = value.toLowerCase() === "true";
            }
            continue;
        }
        current.properties[key] = value;
    }
    const out = {
        sections,
        sectionCount: sections.length,
    };
    if (root !== undefined)
        out.root = root;
    return out;
}
function escapeRegex(s) {
    return s.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
}
/** Expand {a,b,c} and {1..3} brace patterns (best-effort, nested OK). */
function expandBraces(pattern) {
    const start = pattern.indexOf("{");
    if (start === -1)
        return [pattern];
    let depth = 0;
    let end = -1;
    for (let i = start; i < pattern.length; i++) {
        if (pattern[i] === "{")
            depth++;
        else if (pattern[i] === "}") {
            depth--;
            if (depth === 0) {
                end = i;
                break;
            }
        }
    }
    if (end === -1)
        return [pattern];
    const before = pattern.slice(0, start);
    const inside = pattern.slice(start + 1, end);
    const after = pattern.slice(end + 1);
    const range = inside.match(/^(-?\d+)\.\.(-?\d+)$/);
    if (range) {
        const a = Number(range[1]);
        const b = Number(range[2]);
        const outs = [];
        const step = a <= b ? 1 : -1;
        for (let n = a; step > 0 ? n <= b : n >= b; n += step) {
            for (const rest of expandBraces(before + String(n) + after))
                outs.push(rest);
        }
        return outs.length ? outs : [pattern];
    }
    const alts = [];
    let cur = "";
    let d = 0;
    for (let i = 0; i < inside.length; i++) {
        const c = inside[i];
        if (c === "{") {
            d++;
            cur += c;
        }
        else if (c === "}") {
            d--;
            cur += c;
        }
        else if (c === "," && d === 0) {
            alts.push(cur);
            cur = "";
        }
        else {
            cur += c;
        }
    }
    alts.push(cur);
    if (alts.length <= 1 && !inside.includes(",")) {
        // Not a comma/range brace group — treat braces as literals (no expand)
        return [pattern];
    }
    const outs = [];
    for (const alt of alts) {
        for (const rest of expandBraces(before + alt + after))
            outs.push(rest);
    }
    return outs;
}
function globToRegexSource(pattern) {
    let p = pattern;
    if (p.startsWith("/"))
        p = p.slice(1);
    const parts = [];
    let i = 0;
    while (i < p.length) {
        const c = p[i];
        if (c === "*") {
            if (p[i + 1] === "*") {
                if (p[i + 2] === "/") {
                    parts.push("(?:.*/)?");
                    i += 3;
                }
                else {
                    parts.push(".*");
                    i += 2;
                }
            }
            else {
                parts.push("[^/]*");
                i += 1;
            }
        }
        else if (c === "?") {
            parts.push("[^/]");
            i += 1;
        }
        else if (c === "[") {
            let j = i + 1;
            if (j < p.length && (p[j] === "!" || p[j] === "^"))
                j++;
            if (j < p.length && p[j] === "]")
                j++;
            while (j < p.length && p[j] !== "]")
                j++;
            if (j < p.length) {
                let cls = p.slice(i, j + 1);
                if (cls.startsWith("[!"))
                    cls = "[^" + cls.slice(2);
                parts.push(cls);
                i = j + 1;
            }
            else {
                parts.push("\\[");
                i += 1;
            }
        }
        else if (c === "\\") {
            if (i + 1 < p.length) {
                parts.push(escapeRegex(p[i + 1]));
                i += 2;
            }
            else {
                parts.push("\\\\");
                i += 1;
            }
        }
        else {
            parts.push(escapeRegex(c));
            i += 1;
        }
    }
    return `^${parts.join("")}$`;
}
/** Normalize path for matching. */
export function normalizeMatchPath(path) {
    let p = String(path ?? "").replace(/\\/g, "/");
    while (p.startsWith("./"))
        p = p.slice(2);
    if (p.startsWith("/"))
        p = p.slice(1);
    return p.replace(/\/+$/, "");
}
/**
 * Best-effort EditorConfig glob match.
 * Patterns without `/` match the basename; with `/` or `**` match the full relative path.
 */
export function globMatchesPath(glob, path) {
    const g = String(glob ?? "");
    const p = normalizeMatchPath(path);
    if (g === "*" || g === "**")
        return true;
    const candidates = expandBraces(g);
    for (const piece of candidates) {
        const hasPathSep = piece.includes("/") || piece.startsWith("/");
        try {
            const re = new RegExp(globToRegexSource(piece));
            if (hasPathSep || piece.includes("**")) {
                if (re.test(p))
                    return true;
            }
            else {
                const base = p.includes("/") ? p.slice(p.lastIndexOf("/") + 1) : p;
                if (re.test(base))
                    return true;
            }
        }
        catch {
            // invalid glob — no match
        }
    }
    return false;
}
/** Glob-match path against sections; later sections override earlier for same keys. */
export function resolveForPath(text, path) {
    const parsed = parseEditorConfigText(text);
    const matched = [];
    const properties = {};
    const norm = normalizeMatchPath(path);
    for (const sec of parsed.sections) {
        const glob = sec.glob ?? "*";
        if (globMatchesPath(glob, norm)) {
            matched.push({ section: sec.name, glob: sec.glob });
            for (const [k, v] of Object.entries(sec.properties)) {
                properties[k] = v;
            }
        }
    }
    return { matched, properties, path: norm };
}
/** Diff section names and property values between two configs. */
export function diffSections(textA, textB) {
    const a = parseEditorConfigText(textA);
    const b = parseEditorConfigText(textB);
    const namesA = a.sections.map((s) => s.name);
    const namesB = b.sections.map((s) => s.name);
    const setA = new Set(namesA);
    const setB = new Set(namesB);
    const onlyA = namesA.filter((n) => !setB.has(n));
    const onlyB = namesB.filter((n) => !setA.has(n));
    const mapA = new Map(a.sections.map((s) => [s.name, s]));
    const mapB = new Map(b.sections.map((s) => [s.name, s]));
    const sectionDiffs = [];
    const topChanged = [];
    if (a.root !== b.root) {
        topChanged.push({
            key: "root",
            ...(a.root !== undefined ? { a: String(a.root) } : {}),
            ...(b.root !== undefined ? { b: String(b.root) } : {}),
        });
    }
    for (const name of namesA) {
        if (!setB.has(name))
            continue;
        const sa = mapA.get(name);
        const sb = mapB.get(name);
        const keysA = Object.keys(sa.properties);
        const keysB = Object.keys(sb.properties);
        const kB = new Set(keysB);
        const kA = new Set(keysA);
        const secOnlyA = keysA.filter((k) => !kB.has(k));
        const secOnlyB = keysB.filter((k) => !kA.has(k));
        const changed = [];
        for (const k of keysA) {
            if (!kB.has(k))
                continue;
            if (sa.properties[k] !== sb.properties[k]) {
                changed.push({ key: k, a: sa.properties[k], b: sb.properties[k] });
            }
        }
        sectionDiffs.push({
            section: name,
            onlyA: secOnlyA,
            onlyB: secOnlyB,
            changed,
        });
        for (const c of changed) {
            topChanged.push({
                key: `${name}.${c.key}`,
                ...(c.a !== undefined ? { a: c.a } : {}),
                ...(c.b !== undefined ? { b: c.b } : {}),
            });
        }
        for (const k of secOnlyA) {
            topChanged.push({ key: `${name}.${k}`, a: sa.properties[k] });
        }
        for (const k of secOnlyB) {
            topChanged.push({ key: `${name}.${k}`, b: sb.properties[k] });
        }
    }
    return { onlyA, onlyB, changed: topChanged, sectionDiffs };
}
function isPositiveIntOrTab(v) {
    if (v.toLowerCase() === "tab")
        return true;
    return /^[1-9]\d*$/.test(v);
}
/** Educational heuristic lite lint for .editorconfig text. */
export function lintEditorConfig(text) {
    const findings = [];
    const raw = String(text ?? "");
    if (raw.trim() === "") {
        findings.push({
            severity: "warn",
            rule: "empty_file",
            advice: "File is empty — add root=true and at least a [*] section.",
        });
        return findings;
    }
    const parsed = parseEditorConfigText(raw);
    if (parsed.root !== true) {
        findings.push({
            severity: "warn",
            rule: "missing_root",
            advice: "Consider setting root=true at the top so editors stop searching parent directories.",
        });
    }
    if (parsed.sectionCount === 0) {
        findings.push({
            severity: "warn",
            rule: "no_sections",
            advice: "No [section] headers found — EditorConfig properties need a section such as [*].",
        });
    }
    const globCounts = new Map();
    for (const sec of parsed.sections) {
        const g = sec.glob ?? sec.name;
        globCounts.set(g, (globCounts.get(g) ?? 0) + 1);
    }
    for (const [g, n] of globCounts) {
        if (n > 1) {
            findings.push({
                severity: "warn",
                rule: "duplicate_section_glob",
                advice: `Section glob "${g}" appears ${n} times — later sections override earlier for the same keys; duplicates may be unintentional.`,
            });
        }
    }
    for (const sec of parsed.sections) {
        const props = sec.properties;
        const label = sec.name;
        if (props.indent_style !== undefined) {
            const v = props.indent_style.toLowerCase();
            if (!VALID_INDENT_STYLE.has(v)) {
                findings.push({
                    severity: "error",
                    rule: "invalid_indent_style",
                    advice: `${label}: indent_style="${props.indent_style}" is invalid — use "tab" or "space".`,
                });
            }
        }
        if (props.indent_size !== undefined) {
            const v = props.indent_size;
            if (!isPositiveIntOrTab(v)) {
                findings.push({
                    severity: "error",
                    rule: "invalid_indent_size",
                    advice: `${label}: indent_size="${v}" is invalid — use a positive integer or "tab".`,
                });
            }
            if (v.toLowerCase() === "tab") {
                const style = (props.indent_style ?? "").toLowerCase();
                if (style !== "tab") {
                    findings.push({
                        severity: "warn",
                        rule: "indent_size_tab_without_style",
                        advice: `${label}: indent_size=tab should be paired with indent_style=tab.`,
                    });
                }
            }
        }
        if (props.tab_width !== undefined && !/^[1-9]\d*$/.test(props.tab_width)) {
            findings.push({
                severity: "error",
                rule: "invalid_tab_width",
                advice: `${label}: tab_width="${props.tab_width}" is invalid — use a positive integer.`,
            });
        }
        if (props.end_of_line !== undefined) {
            const v = props.end_of_line.toLowerCase();
            if (!VALID_END_OF_LINE.has(v)) {
                findings.push({
                    severity: "error",
                    rule: "invalid_end_of_line",
                    advice: `${label}: end_of_line="${props.end_of_line}" is invalid — use lf, cr, or crlf.`,
                });
            }
        }
        if (props.charset !== undefined) {
            const v = props.charset.toLowerCase();
            if (!VALID_CHARSET.has(v)) {
                findings.push({
                    severity: "error",
                    rule: "invalid_charset",
                    advice: `${label}: charset="${props.charset}" is invalid — use latin1, utf-8, utf-8-bom, utf-16be, or utf-16le.`,
                });
            }
        }
        if (props.trim_trailing_whitespace !== undefined) {
            const v = props.trim_trailing_whitespace.toLowerCase();
            if (!VALID_BOOL.has(v)) {
                findings.push({
                    severity: "error",
                    rule: "invalid_trim_trailing_whitespace",
                    advice: `${label}: trim_trailing_whitespace="${props.trim_trailing_whitespace}" is invalid — use true or false.`,
                });
            }
        }
        if (props.insert_final_newline !== undefined) {
            const v = props.insert_final_newline.toLowerCase();
            if (!VALID_BOOL.has(v)) {
                findings.push({
                    severity: "error",
                    rule: "invalid_insert_final_newline",
                    advice: `${label}: insert_final_newline="${props.insert_final_newline}" is invalid — use true or false.`,
                });
            }
        }
        if (props.max_line_length !== undefined) {
            const v = props.max_line_length.toLowerCase();
            if (v !== "off" && !/^[1-9]\d*$/.test(props.max_line_length)) {
                findings.push({
                    severity: "error",
                    rule: "invalid_max_line_length",
                    advice: `${label}: max_line_length="${props.max_line_length}" is invalid — use a positive integer or "off".`,
                });
            }
        }
        for (const k of Object.keys(props)) {
            if (!KNOWN_KEYS.has(k)) {
                findings.push({
                    severity: "info",
                    rule: "unknown_property",
                    advice: `${label}: property "${k}" is not a core EditorConfig key (may be editor-specific).`,
                });
            }
        }
    }
    const hasStar = parsed.sections.some((s) => s.glob === "*");
    if (parsed.sectionCount > 0 && !hasStar) {
        findings.push({
            severity: "info",
            rule: "no_star_section",
            advice: "No [*] section — consider a catch-all [*] for shared defaults.",
        });
    }
    return findings;
}
export { KNOWN_KEYS };
