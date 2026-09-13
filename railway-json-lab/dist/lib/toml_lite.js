export const TOML_LIMITATIONS_NOTE = "Not a full TOML 1.0 parser. Supported: bare/quoted/dotted keys; basic and literal strings (including multiline); integers and floats (underscores, scientific, +/−); booleans; arrays of those values; inline tables; [tables]; [[arrays of tables]]; # comments. Not supported / incomplete: hex/oct/bin integers, +inf/−inf/nan, native date-time types (ISO-ish tokens are kept as strings), strict array type homogeneity, table-redefinition / dotted-key merge edge cases, Unicode escape validation, and other TOML 1.0 corner cases.";
class TomlError extends Error {
    line;
    constructor(message, line) {
        super(message);
        this.line = line;
    }
}
class Scanner {
    src;
    i = 0;
    line = 1;
    constructor(src) {
        this.src = src;
    }
    eof() {
        return this.i >= this.src.length;
    }
    peek(n = 0) {
        return this.src[this.i + n] ?? "";
    }
    startsWith(s) {
        return this.src.startsWith(s, this.i);
    }
    next() {
        const c = this.src[this.i++] ?? "";
        if (c === "\n")
            this.line += 1;
        return c;
    }
    skipInlineWs() {
        while (!this.eof()) {
            const c = this.peek();
            if (c === " " || c === "\t")
                this.next();
            else
                break;
        }
    }
    skipComment() {
        if (this.peek() !== "#")
            return;
        while (!this.eof() && this.peek() !== "\n")
            this.next();
    }
    skipWsAndComments() {
        while (!this.eof()) {
            const c = this.peek();
            if (c === " " || c === "\t" || c === "\r" || c === "\n") {
                this.next();
                continue;
            }
            if (c === "#") {
                this.skipComment();
                continue;
            }
            break;
        }
    }
    expect(ch) {
        if (this.peek() !== ch) {
            throw new TomlError(`Expected '${ch}'`, this.line);
        }
        this.next();
    }
}
function isBareKeyChar(c) {
    return /[A-Za-z0-9_-]/.test(c);
}
function isDigit(c) {
    return c >= "0" && c <= "9";
}
function parseBasicEscapes(s) {
    const c = s.next();
    switch (c) {
        case "b":
            return "\b";
        case "t":
            return "\t";
        case "n":
            return "\n";
        case "f":
            return "\f";
        case "r":
            return "\r";
        case '"':
            return '"';
        case "\\":
            return "\\";
        case "u":
        case "U": {
            const n = c === "u" ? 4 : 8;
            let hex = "";
            for (let i = 0; i < n; i++) {
                const h = s.next();
                if (!/[0-9A-Fa-f]/.test(h)) {
                    throw new TomlError("Invalid unicode escape", s.line);
                }
                hex += h;
            }
            return String.fromCodePoint(parseInt(hex, 16));
        }
        default:
            throw new TomlError(`Unknown escape \\${c}`, s.line);
    }
}
function parseString(s) {
    if (s.startsWith('"""')) {
        s.next();
        s.next();
        s.next();
        if (s.peek() === "\n")
            s.next();
        else if (s.peek() === "\r" && s.peek(1) === "\n") {
            s.next();
            s.next();
        }
        let out = "";
        while (!s.eof()) {
            if (s.startsWith('"""')) {
                s.next();
                s.next();
                s.next();
                return out;
            }
            if (s.peek() === "\\") {
                s.next();
                if (s.peek() === "\n" || s.peek() === "\r") {
                    while (!s.eof() && /[ \t\r\n]/.test(s.peek()))
                        s.next();
                    continue;
                }
                out += parseBasicEscapes(s);
                continue;
            }
            out += s.next();
        }
        throw new TomlError("Unclosed multiline basic string", s.line);
    }
    if (s.startsWith("'''")) {
        s.next();
        s.next();
        s.next();
        if (s.peek() === "\n")
            s.next();
        else if (s.peek() === "\r" && s.peek(1) === "\n") {
            s.next();
            s.next();
        }
        let out = "";
        while (!s.eof()) {
            if (s.startsWith("'''")) {
                s.next();
                s.next();
                s.next();
                return out;
            }
            out += s.next();
        }
        throw new TomlError("Unclosed multiline literal string", s.line);
    }
    if (s.peek() === '"') {
        s.next();
        let out = "";
        while (!s.eof()) {
            const c = s.peek();
            if (c === '"') {
                s.next();
                return out;
            }
            if (c === "\n") {
                throw new TomlError("Unclosed basic string", s.line);
            }
            if (c === "\\") {
                s.next();
                out += parseBasicEscapes(s);
                continue;
            }
            out += s.next();
        }
        throw new TomlError("Unclosed basic string", s.line);
    }
    if (s.peek() === "'") {
        s.next();
        let out = "";
        while (!s.eof()) {
            const c = s.peek();
            if (c === "'") {
                s.next();
                return out;
            }
            if (c === "\n") {
                throw new TomlError("Unclosed literal string", s.line);
            }
            out += s.next();
        }
        throw new TomlError("Unclosed literal string", s.line);
    }
    throw new TomlError("Expected string", s.line);
}
function parseBareOrQuotedKey(s) {
    s.skipInlineWs();
    if (s.peek() === '"' || s.peek() === "'") {
        return parseString(s);
    }
    let key = "";
    while (!s.eof() && isBareKeyChar(s.peek())) {
        key += s.next();
    }
    if (!key) {
        throw new TomlError("Expected key", s.line);
    }
    return key;
}
function parseKeyPath(s) {
    const parts = [];
    parts.push(parseBareOrQuotedKey(s));
    s.skipInlineWs();
    while (s.peek() === ".") {
        s.next();
        parts.push(parseBareOrQuotedKey(s));
        s.skipInlineWs();
    }
    return parts;
}
function parseBool(s) {
    if (s.startsWith("true")) {
        s.i += 4;
        return true;
    }
    if (s.startsWith("false")) {
        s.i += 5;
        return false;
    }
    throw new TomlError("Expected boolean", s.line);
}
function parseNumberOrDatetime(s) {
    const start = s.i;
    const startLine = s.line;
    // datetime-ish: YYYY-MM-DD… or HH:MM:SS
    const rest = s.src.slice(s.i);
    const dt = rest.match(/^(\d{4}-\d{2}-\d{2}(?:[Tt ]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:[Zz]|[+-]\d{2}:\d{2})?)?|\d{2}:\d{2}:\d{2}(?:\.\d+)?)/);
    if (dt) {
        s.i += dt[0].length;
        return dt[0];
    }
    let sign = "";
    if (s.peek() === "+" || s.peek() === "-")
        sign = s.next();
    if (!isDigit(s.peek())) {
        throw new TomlError("Invalid number", startLine);
    }
    let raw = sign;
    let sawDot = false;
    let sawExp = false;
    while (!s.eof()) {
        const c = s.peek();
        if (isDigit(c) || c === "_") {
            raw += s.next();
            continue;
        }
        if (c === "." && !sawDot && !sawExp) {
            sawDot = true;
            raw += s.next();
            continue;
        }
        if ((c === "e" || c === "E") && !sawExp) {
            sawExp = true;
            raw += s.next();
            if (s.peek() === "+" || s.peek() === "-")
                raw += s.next();
            continue;
        }
        break;
    }
    const cleaned = raw.replace(/_/g, "");
    if (!cleaned || cleaned === "+" || cleaned === "-" || cleaned.endsWith(".") || /[eE][+-]?$/.test(cleaned)) {
        s.i = start;
        throw new TomlError("Invalid number", startLine);
    }
    const n = Number(cleaned);
    if (!Number.isFinite(n)) {
        throw new TomlError("Invalid number", startLine);
    }
    return n;
}
function parseArray(s) {
    s.expect("[");
    const items = [];
    s.skipWsAndComments();
    if (s.peek() === "]") {
        s.next();
        return items;
    }
    while (!s.eof()) {
        items.push(parseValue(s));
        s.skipWsAndComments();
        if (s.peek() === ",") {
            s.next();
            s.skipWsAndComments();
            if (s.peek() === "]")
                break;
            continue;
        }
        break;
    }
    s.skipWsAndComments();
    s.expect("]");
    return items;
}
function parseInlineTable(s) {
    s.expect("{");
    const obj = {};
    s.skipInlineWs();
    if (s.peek() === "}") {
        s.next();
        return obj;
    }
    while (!s.eof()) {
        const keys = parseKeyPath(s);
        s.skipInlineWs();
        s.expect("=");
        const value = parseValue(s);
        setPath(obj, keys, value, s.line);
        s.skipInlineWs();
        if (s.peek() === ",") {
            s.next();
            s.skipInlineWs();
            continue;
        }
        break;
    }
    s.skipInlineWs();
    s.expect("}");
    return obj;
}
function parseValue(s) {
    s.skipInlineWs();
    const c = s.peek();
    if (c === '"' || c === "'")
        return parseString(s);
    if (c === "[")
        return parseArray(s);
    if (c === "{")
        return parseInlineTable(s);
    if (c === "t" || c === "f")
        return parseBool(s);
    if (c === "+" || c === "-" || isDigit(c))
        return parseNumberOrDatetime(s);
    throw new TomlError("Expected value", s.line);
}
function asTable(v, line, ctx) {
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
        return v;
    }
    throw new TomlError(`Cannot use '${ctx}' as a table`, line);
}
function lastArrayEl(v, line, ctx) {
    if (!Array.isArray(v) || v.length === 0) {
        throw new TomlError(`Expected array of tables at '${ctx}'`, line);
    }
    return asTable(v[v.length - 1], line, ctx);
}
function setPath(root, keys, value, line) {
    let cur = root;
    for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        const last = i === keys.length - 1;
        if (last) {
            if (Object.prototype.hasOwnProperty.call(cur, k)) {
                throw new TomlError(`Duplicate key '${k}'`, line);
            }
            cur[k] = value;
            return;
        }
        if (!Object.prototype.hasOwnProperty.call(cur, k)) {
            cur[k] = {};
        }
        const next = cur[k];
        if (Array.isArray(next)) {
            cur = lastArrayEl(next, line, k);
        }
        else {
            cur = asTable(next, line, k);
        }
    }
}
function ensureTable(root, keys, line) {
    let cur = root;
    for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        const last = i === keys.length - 1;
        if (!Object.prototype.hasOwnProperty.call(cur, k)) {
            cur[k] = {};
        }
        const next = cur[k];
        if (Array.isArray(next)) {
            cur = lastArrayEl(next, line, k);
        }
        else {
            cur = asTable(next, line, k);
        }
        if (last)
            return cur;
    }
    return cur;
}
function ensureArrayTable(root, keys, line) {
    let cur = root;
    for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        const last = i === keys.length - 1;
        if (last) {
            if (!Object.prototype.hasOwnProperty.call(cur, k)) {
                cur[k] = [];
            }
            const arr = cur[k];
            if (!Array.isArray(arr)) {
                throw new TomlError(`'${k}' is not an array of tables`, line);
            }
            const obj = {};
            arr.push(obj);
            return obj;
        }
        if (!Object.prototype.hasOwnProperty.call(cur, k)) {
            cur[k] = {};
        }
        const next = cur[k];
        if (Array.isArray(next)) {
            cur = lastArrayEl(next, line, k);
        }
        else {
            cur = asTable(next, line, k);
        }
    }
    throw new TomlError("Empty table header", line);
}
function parseDocument(text) {
    const s = new Scanner(text);
    const root = {};
    let current = root;
    while (!s.eof()) {
        s.skipWsAndComments();
        if (s.eof())
            break;
        if (s.peek() === "[") {
            const line = s.line;
            let isArray = false;
            s.next();
            if (s.peek() === "[") {
                isArray = true;
                s.next();
            }
            s.skipInlineWs();
            const keys = parseKeyPath(s);
            s.skipInlineWs();
            s.expect("]");
            if (isArray)
                s.expect("]");
            current = isArray ? ensureArrayTable(root, keys, line) : ensureTable(root, keys, line);
            s.skipInlineWs();
            s.skipComment();
            continue;
        }
        const line = s.line;
        const keys = parseKeyPath(s);
        s.skipInlineWs();
        s.expect("=");
        const value = parseValue(s);
        setPath(current, keys, value, line);
        s.skipInlineWs();
        s.skipComment();
    }
    return root;
}
export function tomlParseLite(input) {
    const text = String(input.text ?? "");
    try {
        const data = parseDocument(text);
        return { ok: true, data, limitationsNote: TOML_LIMITATIONS_NOTE };
    }
    catch (err) {
        if (err instanceof TomlError) {
            return {
                ok: false,
                errors: [{ line: err.line, message: err.message }],
                limitationsNote: TOML_LIMITATIONS_NOTE,
            };
        }
        const msg = err instanceof Error ? err.message : String(err);
        return {
            ok: false,
            errors: [{ message: msg }],
            limitationsNote: TOML_LIMITATIONS_NOTE,
        };
    }
}
