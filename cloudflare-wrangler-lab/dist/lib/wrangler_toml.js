/**
 * wrangler.toml text helpers.
 * Best-effort TOML subset + regex fallback. No wrangler CLI, no network, no filesystem follow.
 */
export function asMap(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value;
    }
    return null;
}
function stringOrUndef(v) {
    if (typeof v === "string") {
        const t = v.trim();
        return t || undefined;
    }
    return undefined;
}
function boolOrUndef(v) {
    if (typeof v === "boolean")
        return v;
    if (typeof v === "string") {
        const t = v.trim().toLowerCase();
        if (t === "true")
            return true;
        if (t === "false")
            return false;
    }
    return undefined;
}
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
    if (!cleaned ||
        cleaned === "+" ||
        cleaned === "-" ||
        cleaned.endsWith(".") ||
        /[eE][+-]?$/.test(cleaned)) {
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
        setPath(obj, keys, value, s.line, true);
        s.skipInlineWs();
        if (s.peek() === ",") {
            s.next();
            s.skipInlineWs();
            if (s.peek() === "}")
                break;
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
    if (s.startsWith("true") || s.startsWith("false"))
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
function setPath(root, keys, value, line, allowOverwrite = false) {
    let cur = root;
    for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        const last = i === keys.length - 1;
        if (last) {
            if (!allowOverwrite && Object.prototype.hasOwnProperty.call(cur, k)) {
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
            current = isArray
                ? ensureArrayTable(root, keys, line)
                : ensureTable(root, keys, line);
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
function regexQuoted(block, key) {
    const re = new RegExp(`(?:^|\\n)\\s*${key}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i");
    const m = block.match(re);
    return m?.[1] ?? m?.[2] ?? undefined;
}
function regexBool(block, key) {
    const re = new RegExp(`(?:^|\\n)\\s*${key}\\s*=\\s*(true|false)\\b`, "i");
    const m = block.match(re);
    if (!m)
        return undefined;
    return m[1].toLowerCase() === "true";
}
function regexStringArray(block, key) {
    const re = new RegExp(`(?:^|\\n)\\s*${key}\\s*=\\s*\\[([^\\]]*)\\]`, "i");
    const m = block.match(re);
    if (!m)
        return undefined;
    const inner = m[1];
    const out = [];
    const itemRe = /"([^"]*)"|'([^']*)'/g;
    let im;
    while ((im = itemRe.exec(inner))) {
        const v = im[1] ?? im[2] ?? "";
        if (v)
            out.push(v);
    }
    return out;
}
function topLevelPreamble(text) {
    const idx = text.search(/\n\s*\[/);
    return idx === -1 ? text : text.slice(0, idx);
}
function regexFallbackNameMain(text) {
    const block = topLevelPreamble(text);
    const out = {};
    const name = regexQuoted(block, "name");
    const main = regexQuoted(block, "main");
    const compatibility_date = regexQuoted(block, "compatibility_date");
    const account_id = regexQuoted(block, "account_id");
    const workers_dev = regexBool(block, "workers_dev");
    const compatibility_flags = regexStringArray(block, "compatibility_flags");
    if (name !== undefined)
        out.name = name;
    if (main !== undefined)
        out.main = main;
    if (compatibility_date !== undefined)
        out.compatibility_date = compatibility_date;
    if (account_id !== undefined)
        out.account_id = account_id;
    if (workers_dev !== undefined)
        out.workers_dev = workers_dev;
    if (compatibility_flags && compatibility_flags.length) {
        out.compatibility_flags = compatibility_flags;
    }
    return out;
}
export function parseWranglerTomlText(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed) {
        return { raw: null, format: "empty", source: text ?? "" };
    }
    try {
        const data = parseDocument(trimmed);
        return { raw: data, format: "toml", source: trimmed };
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const line = err instanceof TomlError ? ` (line ${err.line})` : "";
        return {
            raw: null,
            format: "unknown",
            parseError: `Invalid wrangler.toml TOML${line}: ${msg}`,
            source: trimmed,
        };
    }
}
function stringArrayFromUnknown(v) {
    if (!Array.isArray(v))
        return undefined;
    const out = [];
    for (const item of v) {
        if (typeof item === "string" && item.trim())
            out.push(item.trim());
    }
    return out.length ? out : undefined;
}
export function extractNameMain(raw, source) {
    const out = {};
    if (raw) {
        const name = stringOrUndef(raw.name);
        const main = stringOrUndef(raw.main);
        const compatibility_date = stringOrUndef(raw.compatibility_date);
        const account_id = stringOrUndef(raw.account_id);
        const workers_dev = boolOrUndef(raw.workers_dev);
        const flags = stringArrayFromUnknown(raw.compatibility_flags);
        if (name !== undefined)
            out.name = name;
        if (main !== undefined)
            out.main = main;
        if (compatibility_date !== undefined)
            out.compatibility_date = compatibility_date;
        if (account_id !== undefined)
            out.account_id = account_id;
        if (workers_dev !== undefined)
            out.workers_dev = workers_dev;
        if (flags)
            out.compatibility_flags = flags;
        if (Object.keys(out).length > 0)
            return out;
    }
    if (source)
        return regexFallbackNameMain(source);
    return out;
}
function routeFromMap(map) {
    const entry = {};
    const pattern = stringOrUndef(map.pattern);
    const zone_name = stringOrUndef(map.zone_name);
    const zone_id = stringOrUndef(map.zone_id);
    const custom_domain = boolOrUndef(map.custom_domain);
    if (pattern !== undefined)
        entry.pattern = pattern;
    if (zone_name !== undefined)
        entry.zone_name = zone_name;
    if (zone_id !== undefined)
        entry.zone_id = zone_id;
    if (custom_domain !== undefined)
        entry.custom_domain = custom_domain;
    if (entry.pattern !== undefined ||
        entry.zone_name !== undefined ||
        entry.zone_id !== undefined ||
        entry.custom_domain !== undefined) {
        return entry;
    }
    return null;
}
function collectRoutesFromTable(table, out) {
    if (Array.isArray(table.routes)) {
        for (const item of table.routes) {
            if (typeof item === "string") {
                const pattern = item.trim();
                if (pattern)
                    out.push({ pattern });
                continue;
            }
            const map = asMap(item);
            if (!map)
                continue;
            const r = routeFromMap(map);
            if (r)
                out.push(r);
        }
    }
    const singular = table.route;
    if (typeof singular === "string" && singular.trim()) {
        out.push({ pattern: singular.trim() });
    }
    else {
        const map = asMap(singular);
        if (map) {
            const r = routeFromMap(map);
            if (r)
                out.push(r);
        }
    }
}
function regexCollectRoutes(text) {
    const routes = [];
    const aot = text.matchAll(/\[\[(?:env\.[A-Za-z0-9_-]+\.)?routes\]\]\s*([\s\S]*?)(?=\n\s*\[|\s*$)/g);
    for (const m of aot) {
        const block = m[1] ?? "";
        const pattern = regexQuoted(block, "pattern");
        const zone_name = regexQuoted(block, "zone_name");
        const zone_id = regexQuoted(block, "zone_id");
        const custom_domain = regexBool(block, "custom_domain");
        const entry = {};
        if (pattern !== undefined)
            entry.pattern = pattern;
        if (zone_name !== undefined)
            entry.zone_name = zone_name;
        if (zone_id !== undefined)
            entry.zone_id = zone_id;
        if (custom_domain !== undefined)
            entry.custom_domain = custom_domain;
        if (Object.keys(entry).length)
            routes.push(entry);
    }
    const inline = text.matchAll(/\{\s*pattern\s*=\s*(?:"([^"]*)"|'([^']*)')([^}]*)\}/g);
    for (const m of inline) {
        const pattern = (m[1] ?? m[2] ?? "").trim();
        const rest = m[3] ?? "";
        const entry = {};
        if (pattern)
            entry.pattern = pattern;
        const zn = rest.match(/zone_name\s*=\s*(?:"([^"]*)"|'([^']*)')/);
        const zi = rest.match(/zone_id\s*=\s*(?:"([^"]*)"|'([^']*)')/);
        const cd = rest.match(/custom_domain\s*=\s*(true|false)/);
        if (zn)
            entry.zone_name = zn[1] ?? zn[2];
        if (zi)
            entry.zone_id = zi[1] ?? zi[2];
        if (cd)
            entry.custom_domain = cd[1] === "true";
        if (entry.pattern)
            routes.push(entry);
    }
    return routes;
}
export function extractRoutes(raw, source) {
    const routes = [];
    if (raw) {
        collectRoutesFromTable(raw, routes);
        const env = asMap(raw.env);
        if (env) {
            for (const key of Object.keys(env)) {
                const table = asMap(env[key]);
                if (table)
                    collectRoutesFromTable(table, routes);
            }
        }
    }
    if (routes.length === 0 && source) {
        routes.push(...regexCollectRoutes(source));
    }
    return { routes, count: routes.length };
}
const SECRET_KEY_RE = /(secret|password|passwd|pwd|token|api[_-]?key|private[_-]?key|access[_-]?key|auth[_-]?key|credential|client[_-]?secret|signing[_-]?key)/i;
function pushUnique(set, ...vals) {
    for (const v of vals) {
        if (typeof v === "string") {
            const t = v.trim();
            if (t)
                set.add(t);
        }
    }
}
function labelsFromBindingItems(items, extraKeys) {
    const set = new Set();
    if (!Array.isArray(items))
        return [];
    for (const item of items) {
        const map = asMap(item);
        if (!map)
            continue;
        pushUnique(set, stringOrUndef(map.binding), stringOrUndef(map.name), ...extraKeys.map((k) => stringOrUndef(map[k])));
    }
    return Array.from(set);
}
function collectBindingsFromTable(table, acc) {
    for (const s of labelsFromBindingItems(table.kv_namespaces, ["id"])) {
        acc.kv.add(s);
    }
    for (const s of labelsFromBindingItems(table.r2_buckets, [
        "bucket_name",
        "preview_bucket_name",
    ])) {
        acc.r2.add(s);
    }
    for (const s of labelsFromBindingItems(table.d1_databases, [
        "database_name",
        "database_id",
    ])) {
        acc.d1.add(s);
    }
    for (const s of labelsFromBindingItems(table.services, ["service"])) {
        acc.services.add(s);
    }
    const vars = asMap(table.vars);
    if (vars) {
        for (const k of Object.keys(vars)) {
            acc.vars.add(k);
            if (SECRET_KEY_RE.test(k))
                acc.secrets.add(k);
        }
    }
    const secretsTable = asMap(table.secrets);
    if (secretsTable) {
        for (const k of Object.keys(secretsTable))
            acc.secrets.add(k);
    }
    const doTable = asMap(table.durable_objects);
    const doBindings = doTable ? doTable.bindings : undefined;
    const doItems = Array.isArray(doBindings)
        ? doBindings
        : Array.isArray(table.durable_objects)
            ? table.durable_objects
            : [];
    for (const s of labelsFromBindingItems(doItems, ["class_name"])) {
        acc.durable.add(s);
    }
}
function regexBindingNames(text, header, keys) {
    const set = new Set();
    const re = new RegExp(`\\[\\[(?:env\\.[A-Za-z0-9_-]+\\.)?${header}\\]\\]\\s*([\\s\\S]*?)(?=\\n\\s*\\[|\\s*$)`, "g");
    for (const m of text.matchAll(re)) {
        const block = m[1] ?? "";
        for (const k of keys) {
            const v = regexQuoted(block, k);
            if (v)
                set.add(v);
        }
    }
    const inlineRe = new RegExp(`${header}\\s*=\\s*\\[([\\s\\S]*?)\\]`, "i");
    const inline = text.match(inlineRe);
    if (inline) {
        const chunk = inline[1] ?? "";
        for (const k of keys) {
            const itemRe = new RegExp(`${k}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "g");
            for (const im of chunk.matchAll(itemRe)) {
                const v = im[1] ?? im[2];
                if (v)
                    set.add(v);
            }
        }
    }
    return Array.from(set);
}
function regexVarsKeys(text) {
    const vars = [];
    const secrets = [];
    const m = text.match(/\[vars\]\s*([\s\S]*?)(?=\n\s*\[|\s*$)/);
    if (m) {
        const block = m[1] ?? "";
        const keyRe = /(?:^|\n)\s*([A-Za-z0-9_-]+)\s*=/g;
        for (const km of block.matchAll(keyRe)) {
            const k = km[1];
            if (!k)
                continue;
            vars.push(k);
            if (SECRET_KEY_RE.test(k))
                secrets.push(k);
        }
    }
    const sm = text.match(/\[secrets\]\s*([\s\S]*?)(?=\n\s*\[|\s*$)/);
    if (sm) {
        const block = sm[1] ?? "";
        const keyRe = /(?:^|\n)\s*([A-Za-z0-9_-]+)\s*=/g;
        for (const km of block.matchAll(keyRe)) {
            if (km[1])
                secrets.push(km[1]);
        }
    }
    return { vars, secrets };
}
export function extractBindingsHint(raw, source) {
    const acc = {
        kv: new Set(),
        r2: new Set(),
        d1: new Set(),
        vars: new Set(),
        secrets: new Set(),
        services: new Set(),
        durable: new Set(),
    };
    if (raw) {
        collectBindingsFromTable(raw, acc);
        const env = asMap(raw.env);
        if (env) {
            for (const key of Object.keys(env)) {
                const table = asMap(env[key]);
                if (table)
                    collectBindingsFromTable(table, acc);
            }
        }
    }
    if (acc.kv.size +
        acc.r2.size +
        acc.d1.size +
        acc.vars.size +
        acc.secrets.size +
        acc.services.size +
        acc.durable.size ===
        0 &&
        source) {
        for (const s of regexBindingNames(source, "kv_namespaces", ["binding", "id"])) {
            acc.kv.add(s);
        }
        for (const s of regexBindingNames(source, "r2_buckets", [
            "binding",
            "bucket_name",
        ])) {
            acc.r2.add(s);
        }
        for (const s of regexBindingNames(source, "d1_databases", [
            "binding",
            "database_name",
            "database_id",
        ])) {
            acc.d1.add(s);
        }
        for (const s of regexBindingNames(source, "services", ["binding", "service"])) {
            acc.services.add(s);
        }
        for (const s of regexBindingNames(source, "durable_objects.bindings", [
            "name",
            "class_name",
        ])) {
            acc.durable.add(s);
        }
        const doInline = source.match(/\[durable_objects\][\s\S]*?bindings\s*=\s*\[([\s\S]*?)\]/);
        if (doInline) {
            const chunk = doInline[1] ?? "";
            for (const im of chunk.matchAll(/(?:name|class_name)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
                const v = im[1] ?? im[2];
                if (v)
                    acc.durable.add(v);
            }
        }
        const vk = regexVarsKeys(source);
        for (const k of vk.vars)
            acc.vars.add(k);
        for (const k of vk.secrets)
            acc.secrets.add(k);
    }
    const out = {};
    if (acc.kv.size)
        out.kv_namespaces = Array.from(acc.kv);
    if (acc.r2.size)
        out.r2_buckets = Array.from(acc.r2);
    if (acc.d1.size)
        out.d1_databases = Array.from(acc.d1);
    if (acc.vars.size)
        out.vars = Array.from(acc.vars);
    if (acc.secrets.size)
        out.secrets_hint = Array.from(acc.secrets);
    if (acc.services.size)
        out.services = Array.from(acc.services);
    if (acc.durable.size)
        out.durable_objects = Array.from(acc.durable);
    return out;
}
function parseCompatDate(value) {
    const m = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m)
        return null;
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    if (mo < 1 || mo > 12 || d < 1 || d > 31)
        return null;
    const dt = new Date(Date.UTC(y, mo - 1, d));
    if (dt.getUTCFullYear() !== y ||
        dt.getUTCMonth() !== mo - 1 ||
        dt.getUTCDate() !== d) {
        return null;
    }
    return dt;
}
function looksLikeSecretValue(v) {
    if (typeof v !== "string")
        return false;
    const t = v.trim();
    if (!t)
        return false;
    if (/^(sk-|rk-|AKIA|ghp_|github_pat_|xox[baprs]-|Bearer\s)/i.test(t)) {
        return true;
    }
    if (t.length >= 24 && /^[A-Za-z0-9/+=._-]{24,}$/.test(t) && /[0-9]/.test(t)) {
        return true;
    }
    return false;
}
export function lintWranglerToml(raw, parseError, format, source) {
    const findings = [];
    const trimmed = (source ?? "").trim();
    if (!trimmed || format === "empty") {
        findings.push({
            severity: "info",
            rule: "empty_config",
            advice: "No wrangler.toml content provided (empty input).",
        });
        return findings;
    }
    if (trimmed.startsWith("{") || /^\s*\[/.test(trimmed) && trimmed.includes('"name"')) {
        if (trimmed.startsWith("{")) {
            findings.push({
                severity: "error",
                rule: "looks_like_json",
                advice: "Input looks like JSON (wrangler.json / wrangler.jsonc). This tool expects wrangler.toml text heuristics — convert or paste TOML.",
            });
            return findings;
        }
    }
    if (parseError && !raw) {
        findings.push({
            severity: "error",
            rule: "invalid_toml",
            advice: `Could not parse wrangler.toml: ${parseError}`,
        });
        const fallback = regexFallbackNameMain(trimmed);
        if (!fallback.name) {
            findings.push({
                severity: "warn",
                rule: "missing_name",
                advice: 'Top-level name was not detected. Workers usually need name = "my-worker".',
            });
        }
        if (!fallback.main) {
            findings.push({
                severity: "warn",
                rule: "missing_main",
                advice: 'Top-level main was not detected. Workers usually need main = "src/index.ts" (Pages may use pages_build_output_dir instead).',
            });
        }
        if (!fallback.compatibility_date) {
            findings.push({
                severity: "warn",
                rule: "missing_compatibility_date",
                advice: 'compatibility_date is missing. Set compatibility_date = "YYYY-MM-DD" so the Workers runtime is pinned.',
            });
        }
        return findings;
    }
    const nameMain = extractNameMain(raw, trimmed);
    const bindings = extractBindingsHint(raw, trimmed);
    const pagesDir = raw && stringOrUndef(raw.pages_build_output_dir) !== undefined;
    if (!nameMain.name) {
        findings.push({
            severity: "warn",
            rule: "missing_name",
            advice: 'Top-level name is missing. Workers usually need name = "my-worker" (env tables may override per environment).',
        });
    }
    if (!nameMain.main && !pagesDir) {
        findings.push({
            severity: "warn",
            rule: "missing_main",
            advice: 'Top-level main is missing. Point main at the Worker entry (e.g. "src/index.ts"). Pages projects may set pages_build_output_dir instead.',
        });
    }
    if (!nameMain.compatibility_date) {
        findings.push({
            severity: "warn",
            rule: "missing_compatibility_date",
            advice: "compatibility_date is missing. Set a YYYY-MM-DD pin so deploys use a known Workers runtime.",
        });
    }
    else {
        const dt = parseCompatDate(nameMain.compatibility_date);
        if (!dt) {
            findings.push({
                severity: "warn",
                rule: "compatibility_date_format",
                advice: `compatibility_date "${nameMain.compatibility_date}" is not YYYY-MM-DD. Use a calendar date such as "2026-09-01".`,
            });
        }
        else {
            const now = new Date();
            const ageMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) -
                dt.getTime();
            const dayMs = 24 * 60 * 60 * 1000;
            if (ageMs > 365 * dayMs) {
                const months = Math.max(1, Math.floor(ageMs / (30 * dayMs)));
                findings.push({
                    severity: "info",
                    rule: "outdated_compatibility_date",
                    advice: `compatibility_date is ${nameMain.compatibility_date} (~${months} months old). Cloudflare recommends periodically bumping it after reviewing the Workers compatibility calendar — educational tip only.`,
                });
            }
        }
    }
    const varsMap = raw ? asMap(raw.vars) : null;
    const secretKeys = new Set(bindings.secrets_hint ?? []);
    if (varsMap) {
        for (const [k, v] of Object.entries(varsMap)) {
            if (SECRET_KEY_RE.test(k) || looksLikeSecretValue(v)) {
                secretKeys.add(k);
            }
        }
    }
    if (secretKeys.size > 0) {
        const keys = Array.from(secretKeys).sort();
        findings.push({
            severity: "warn",
            rule: "plaintext_secret_in_vars",
            advice: `Plaintext [vars] (or [secrets]) key(s) look like secrets: ${keys.join(", ")}. Prefer wrangler secret put / Workers Secrets for credentials — values are not shown.`,
        });
    }
    if (raw && Object.keys(raw).length === 0) {
        findings.push({
            severity: "info",
            rule: "empty_config",
            advice: "Parsed wrangler.toml object is empty — no fields detected.",
        });
    }
    if (nameMain.workers_dev === false) {
        const { count } = extractRoutes(raw, trimmed);
        if (count === 0) {
            findings.push({
                severity: "info",
                rule: "no_route_workers_dev_off",
                advice: "workers_dev is false and no routes[] / [[routes]] were detected — confirm how this Worker will be reached (custom routes or Pages).",
            });
        }
    }
    return findings;
}
