/**
 * Best-effort Mongoose schema JS/TS text heuristics.
 * No mongoose/mongo runtime, no network, no filesystem follow, no eval.
 */
/** Strip line and block comments; leave strings roughly intact. */
export function stripComments(raw) {
    const src = (raw ?? "").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
    let out = "";
    let i = 0;
    const n = src.length;
    let inString = false;
    let quote = "";
    let inTemplate = false;
    let templateDepth = 0;
    while (i < n) {
        const ch = src[i];
        const next = i + 1 < n ? src[i + 1] : "";
        if (inTemplate) {
            out += ch;
            if (ch === "`" && templateDepth === 0) {
                inTemplate = false;
                i++;
                continue;
            }
            if (ch === "$" && next === "{") {
                templateDepth++;
                out += next;
                i += 2;
                continue;
            }
            if (ch === "}" && templateDepth > 0) {
                templateDepth--;
                i++;
                continue;
            }
            if (ch === "\\" && i + 1 < n) {
                out += src[i + 1];
                i += 2;
                continue;
            }
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
        if (ch === "`") {
            inTemplate = true;
            templateDepth = 0;
            out += ch;
            i++;
            continue;
        }
        if (ch === '"' || ch === "'") {
            inString = true;
            quote = ch;
            out += ch;
            i++;
            continue;
        }
        if (ch === "/" && next === "/") {
            i += 2;
            while (i < n && src[i] !== "\n")
                i++;
            continue;
        }
        if (ch === "/" && next === "*") {
            i += 2;
            while (i + 1 < n && !(src[i] === "*" && src[i + 1] === "/"))
                i++;
            i = Math.min(n, i + 2);
            continue;
        }
        out += ch;
        i++;
    }
    return out;
}
function findMatchingBrace(s, openBraceIndex) {
    let depth = 0;
    let inString = false;
    let quote = "";
    for (let i = openBraceIndex; i < s.length; i++) {
        const c = s[i];
        if (inString) {
            if (c === "\\" && i + 1 < s.length) {
                i++;
                continue;
            }
            if (c === quote)
                inString = false;
            continue;
        }
        if (c === '"' || c === "'" || c === "`") {
            inString = true;
            quote = c;
            continue;
        }
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
function findMatchingParen(s, openParenIndex) {
    let depth = 0;
    let inString = false;
    let quote = "";
    for (let i = openParenIndex; i < s.length; i++) {
        const c = s[i];
        if (inString) {
            if (c === "\\" && i + 1 < s.length) {
                i++;
                continue;
            }
            if (c === quote)
                inString = false;
            continue;
        }
        if (c === '"' || c === "'" || c === "`") {
            inString = true;
            quote = c;
            continue;
        }
        if (c === "(")
            depth++;
        else if (c === ")") {
            depth--;
            if (depth === 0)
                return i;
        }
    }
    return -1;
}
function findMatchingBracket(s, openBracketIndex) {
    let depth = 0;
    let inString = false;
    let quote = "";
    for (let i = openBracketIndex; i < s.length; i++) {
        const c = s[i];
        if (inString) {
            if (c === "\\" && i + 1 < s.length) {
                i++;
                continue;
            }
            if (c === quote)
                inString = false;
            continue;
        }
        if (c === '"' || c === "'" || c === "`") {
            inString = true;
            quote = c;
            continue;
        }
        if (c === "[")
            depth++;
        else if (c === "]") {
            depth--;
            if (depth === 0)
                return i;
        }
    }
    return -1;
}
function splitTopLevelCommas(s) {
    const parts = [];
    let depthParen = 0;
    let depthBrace = 0;
    let depthBracket = 0;
    let inString = false;
    let quote = "";
    let cur = "";
    for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (inString) {
            cur += c;
            if (c === "\\" && i + 1 < s.length) {
                cur += s[i + 1];
                i++;
                continue;
            }
            if (c === quote)
                inString = false;
            continue;
        }
        if (c === '"' || c === "'" || c === "`") {
            inString = true;
            quote = c;
            cur += c;
            continue;
        }
        if (c === "(")
            depthParen++;
        if (c === ")")
            depthParen--;
        if (c === "{")
            depthBrace++;
        if (c === "}")
            depthBrace--;
        if (c === "[")
            depthBracket++;
        if (c === "]")
            depthBracket--;
        if (c === "," &&
            depthParen === 0 &&
            depthBrace === 0 &&
            depthBracket === 0) {
            parts.push(cur.trim());
            cur = "";
            continue;
        }
        cur += c;
    }
    if (cur.trim())
        parts.push(cur.trim());
    return parts;
}
function unquote(s) {
    const m = s.trim().match(/^['"`]([^'"`]+)['"`]$/);
    return m ? m[1] : undefined;
}
/** Extract schema variable names from `const x = new Schema(` / `new mongoose.Schema(`. */
export function listSchemaVars(text) {
    const cleaned = stripComments(text ?? "");
    const names = [];
    const seen = new Set();
    // Prefer explicit new Schema / new mongoose.Schema assignments
    const assignRe = /(?:const|let|var)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*new\s+(?:mongoose\s*\.\s*)?Schema\s*\(/g;
    let m;
    while ((m = assignRe.exec(cleaned))) {
        const n = m[1];
        if (!seen.has(n)) {
            seen.add(n);
            names.push(n);
        }
    }
    return names;
}
/**
 * List mongoose.model('Name', ...) / model('Name', ...) registrations.
 * Optional 3rd string arg → collection.
 */
export function listModels(text) {
    const cleaned = stripComments(text ?? "");
    const models = [];
    const seen = new Set();
    // mongoose.model( / model( — but avoid Schema.Types / connection.model variants loosely
    const modelCallRe = /(?:(?:mongoose|connection|db|conn)\s*\.\s*)?\bmodel\s*\(/g;
    let m;
    while ((m = modelCallRe.exec(cleaned))) {
        const open = m.index + m[0].length - 1;
        // Skip if this looks like Schema.Types... no — model( is fine
        // Guard: don't match somethingModel( — \bmodel already handles word boundary
        const close = findMatchingParen(cleaned, open);
        if (close < 0)
            continue;
        const args = cleaned.slice(open + 1, close);
        const parts = splitTopLevelCommas(args);
        if (parts.length === 0)
            continue;
        const name = unquote(parts[0]);
        if (!name)
            continue;
        // Deduplicate by name (first wins)
        if (seen.has(name))
            continue;
        seen.add(name);
        const info = { name };
        if (parts.length >= 3) {
            const coll = unquote(parts[2]);
            if (coll)
                info.collection = coll;
        }
        // Also check options object with collection: '...'
        if (!info.collection && parts.length >= 3) {
            const collOpt = parts[2].match(/\bcollection\s*:\s*['"`]([^'"`]+)['"`]/);
            if (collOpt)
                info.collection = collOpt[1];
        }
        if (!info.collection && parts.length >= 2) {
            // Sometimes model('Name', schema, { collection: 'x' })
            const optPart = parts.find((p) => /\bcollection\s*:/.test(p));
            if (optPart) {
                const collOpt = optPart.match(/\bcollection\s*:\s*['"`]([^'"`]+)['"`]/);
                if (collOpt)
                    info.collection = collOpt[1];
            }
        }
        models.push(info);
    }
    const schemas = listSchemaVars(cleaned);
    const result = { models, count: models.length };
    if (schemas.length)
        result.schemas = schemas;
    return result;
}
/**
 * Find top-level object-literal bodies passed to `new Schema({ ... }` / `new mongoose.Schema({`.
 */
function extractSchemaDefinitionBodies(text) {
    const cleaned = stripComments(text ?? "");
    const bodies = [];
    const re = /new\s+(?:mongoose\s*\.\s*)?Schema\s*\(/g;
    let m;
    while ((m = re.exec(cleaned))) {
        const openParen = m.index + m[0].length - 1;
        const closeParen = findMatchingParen(cleaned, openParen);
        if (closeParen < 0)
            continue;
        const args = cleaned.slice(openParen + 1, closeParen);
        // First arg should be object literal { ... }
        let i = 0;
        while (i < args.length && /\s/.test(args[i]))
            i++;
        if (args[i] !== "{")
            continue;
        const closeBrace = findMatchingBrace(args, i);
        if (closeBrace < 0)
            continue;
        bodies.push(args.slice(i + 1, closeBrace));
    }
    return bodies;
}
function parseBoolOpt(obj, key) {
    const re = new RegExp(`\\b${key}\\s*:\\s*(true|false)\\b`);
    const m = obj.match(re);
    if (!m)
        return undefined;
    return m[1] === "true";
}
function parseTypeFromPathValue(val) {
    const v = val.trim();
    // { type: String, ... } or { type: Schema.Types.ObjectId }
    const typeM = v.match(/\btype\s*:\s*((?:Schema\s*\.\s*)?Types\s*\.\s*[A-Za-z_][A-Za-z0-9_]*|[A-Za-z_][A-Za-z0-9_.]*)/);
    if (typeM) {
        return typeM[1].replace(/\s+/g, "");
    }
    // Shorthand: String / Number / Boolean / Date / Buffer / Map / Mixed / ObjectId
    // or [String] or [{ type: ... }]
    if (v.startsWith("[")) {
        const close = findMatchingBracket(v, 0);
        if (close >= 0) {
            const inner = v.slice(1, close).trim();
            if (/^\{/.test(inner)) {
                const innerType = parseTypeFromPathValue(inner);
                return innerType ? `[${innerType}]` : "Array";
            }
            const simple = inner.match(/^((?:Schema\s*\.\s*)?Types\s*\.\s*[A-Za-z_][A-Za-z0-9_]*|[A-Za-z_][A-Za-z0-9_.]*)$/);
            if (simple)
                return `[${simple[1].replace(/\s+/g, "")}]`;
            return "Array";
        }
        return "Array";
    }
    // Bare identifier type
    const bare = v.match(/^((?:Schema\s*\.\s*)?Types\s*\.\s*[A-Za-z_][A-Za-z0-9_]*|[A-Za-z_][A-Za-z0-9_.]*)$/);
    if (bare)
        return bare[1].replace(/\s+/g, "");
    // Object without type — might still have ref etc.
    if (v.startsWith("{"))
        return undefined;
    return undefined;
}
function parseRef(val) {
    const m = val.match(/\bref\s*:\s*['"`]([^'"`]+)['"`]/);
    return m ? m[1] : undefined;
}
/**
 * Parse path definitions from Schema object-literal style bodies.
 */
export function listPaths(text) {
    const bodies = extractSchemaDefinitionBodies(text);
    const paths = [];
    const seen = new Set();
    for (const body of bodies) {
        const entries = splitTopLevelCommas(body);
        for (const entry of entries) {
            if (!entry.trim())
                continue;
            // name: value
            const kv = entry.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*([\s\S]+)$/);
            if (!kv)
                continue;
            const name = kv[1];
            // Skip option-like keys that sometimes appear wrongly; Schema paths are field names.
            // Also skip if this is nested inside options — we're only looking at first-arg body.
            if (seen.has(name))
                continue;
            // Common non-path keys that appear in schema options (2nd arg), not first — but
            // if someone put timestamps in first arg wrongly, still skip reserved option names.
            if (name === "timestamps" ||
                name === "strict" ||
                name === "collection" ||
                name === "versionKey" ||
                name === "toJSON" ||
                name === "toObject") {
                continue;
            }
            const val = kv[2].trim();
            // Skip method-like or function values
            if (/^(async\s+)?function\b/.test(val) || /^(\([^)]*\)|[A-Za-z_]+)\s*=>/.test(val)) {
                continue;
            }
            seen.add(name);
            const path = { name };
            const typ = parseTypeFromPathValue(val);
            if (typ)
                path.type = typ;
            const req = parseBoolOpt(val, "required");
            if (req !== undefined)
                path.required = req;
            // required: [true, 'msg'] style
            if (path.required === undefined && /\brequired\s*:\s*\[\s*true\b/.test(val)) {
                path.required = true;
            }
            const uniq = parseBoolOpt(val, "unique");
            if (uniq !== undefined)
                path.unique = uniq;
            const ref = parseRef(val);
            if (ref)
                path.ref = ref;
            paths.push(path);
        }
    }
    return { paths, count: paths.length };
}
/**
 * Indexes from schema.index({...}, opts?) and path-level index:true / unique:true.
 */
export function listIndexes(text) {
    const cleaned = stripComments(text ?? "");
    const indexes = [];
    // schema.index( / xxxSchema.index(
    const indexCallRe = /\.index\s*\(/g;
    let m;
    while ((m = indexCallRe.exec(cleaned))) {
        const open = m.index + m[0].length - 1;
        const close = findMatchingParen(cleaned, open);
        if (close < 0)
            continue;
        const args = cleaned.slice(open + 1, close);
        const parts = splitTopLevelCommas(args);
        if (parts.length === 0)
            continue;
        const fieldsArg = parts[0].trim();
        const info = {};
        if (fieldsArg.startsWith("{")) {
            const closeB = findMatchingBrace(fieldsArg, 0);
            const body = closeB >= 0 ? fieldsArg.slice(1, closeB) : fieldsArg.slice(1);
            const fieldNames = [];
            for (const ent of splitTopLevelCommas(body)) {
                const fm = ent.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:/);
                if (fm)
                    fieldNames.push(fm[1]);
            }
            if (fieldNames.length)
                info.fields = fieldNames.join(",");
        }
        else {
            const single = unquote(fieldsArg);
            if (single)
                info.fields = single;
        }
        const opts = parts[1] ?? "";
        const uniq = parseBoolOpt(opts, "unique");
        if (uniq !== undefined)
            info.unique = uniq;
        const sparse = parseBoolOpt(opts, "sparse");
        if (sparse !== undefined)
            info.sparse = sparse;
        indexes.push(info);
    }
    // Path-level index: true / unique: true inside Schema definition bodies
    const bodies = extractSchemaDefinitionBodies(cleaned);
    for (const body of bodies) {
        const entries = splitTopLevelCommas(body);
        for (const entry of entries) {
            const kv = entry.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*([\s\S]+)$/);
            if (!kv)
                continue;
            const name = kv[1];
            const val = kv[2];
            const hasIndex = parseBoolOpt(val, "index") === true;
            const hasUnique = parseBoolOpt(val, "unique") === true;
            if (!hasIndex && !hasUnique)
                continue;
            const info = { fields: name };
            if (hasUnique)
                info.unique = true;
            // sparse on path
            const sparse = parseBoolOpt(val, "sparse");
            if (sparse !== undefined)
                info.sparse = sparse;
            indexes.push(info);
        }
    }
    // Compound / schema-level index option in 2nd Schema arg: { indexes: [...] } — best-effort skip
    // Also: schema.set('autoIndex', ...) not an index definition
    return { indexes, count: indexes.length };
}
function hasPlaintextMongoUri(text) {
    // mongodb:// or mongodb+srv:// with optional user:pass@
    return /['"`]mongodb(?:\+srv)?:\/\/[^'"`]+['"`]/.test(text);
}
function hasMixedOveruse(text, pathCount) {
    const mixedRe = /(?:Schema\s*\.\s*)?Types\s*\.\s*Mixed\b|\bMixed\b/g;
    let count = 0;
    let m;
    const cleaned = stripComments(text);
    while ((m = mixedRe.exec(cleaned))) {
        // Avoid matching word Mixed in comments (already stripped) and in import names loosely
        count++;
    }
    if (count >= 3)
        return true;
    if (pathCount > 0 && count >= 2 && count / pathCount >= 0.4)
        return true;
    return false;
}
function hasTimestampsOption(text) {
    return (/\btimestamps\s*:\s*true\b/.test(text) ||
        /\btimestamps\s*:\s*\{/.test(text));
}
function hasSchemaDefinition(text) {
    return /new\s+(?:mongoose\s*\.\s*)?Schema\s*\(/.test(text);
}
function hasSyncIndexesSmell(text) {
    return (/\.syncIndexes\s*\(/.test(text) ||
        /\bautoIndex\s*:\s*true\b/.test(text) ||
        /\.set\s*\(\s*['"`]autoIndex['"`]\s*,\s*true\s*\)/.test(text));
}
export function lintMongoose(text) {
    const findings = [];
    const raw = text ?? "";
    if (!raw.trim()) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Source text is empty. Paste Mongoose schema / model JS or TS (e.g. new Schema({...}) and mongoose.model(...)).",
        });
        return findings;
    }
    const cleaned = stripComments(raw);
    const { models, schemas } = listModels(cleaned);
    const { paths } = listPaths(cleaned);
    const schemaDefs = hasSchemaDefinition(cleaned);
    // model() with missing/empty name
    const emptyNameRe = /(?:(?:mongoose|connection|db|conn)\s*\.\s*)?\bmodel\s*\(\s*(?:['"`]\s*['"`]|,\s*)/;
    if (/\bmodel\s*\(\s*[,)]/.test(cleaned) || emptyNameRe.test(cleaned)) {
        // More precise: model() with empty string name
        const badName = /\bmodel\s*\(\s*['"`]\s*['"`]/.test(cleaned);
        const noName = /\bmodel\s*\(\s*[,)]/.test(cleaned);
        if (badName || noName) {
            findings.push({
                severity: "error",
                rule: "missing_model_name",
                advice: "`model()` appears to be called without a model name string. Use mongoose.model('ModelName', schema).",
            });
        }
    }
    if (models.length === 0 && schemaDefs) {
        findings.push({
            severity: "warn",
            rule: "schema_without_model",
            advice: "Found `new Schema(...)` but no `mongoose.model('Name', ...)` / `model(...)` registration. Export a model or register one.",
        });
    }
    if (models.length === 0 && !schemaDefs) {
        findings.push({
            severity: "warn",
            rule: "no_models_or_schemas",
            advice: "No `mongoose.model(...)` / `model(...)` or `new Schema(...)` detected. Confirm this is Mongoose schema source.",
        });
    }
    if (hasPlaintextMongoUri(cleaned)) {
        findings.push({
            severity: "error",
            rule: "plaintext_mongo_uri",
            advice: "Plaintext `mongodb://` / `mongodb+srv://` connection string literal detected. Prefer env vars (e.g. process.env.MONGODB_URI) and keep secrets out of source.",
        });
    }
    if (hasSyncIndexesSmell(cleaned)) {
        findings.push({
            severity: "info",
            rule: "syncindexes_tip",
            advice: "`syncIndexes` / `autoIndex: true` detected — fine in development; in production prefer controlled index creation and avoid blocking sync on every boot.",
        });
    }
    if (hasMixedOveruse(cleaned, paths.length)) {
        findings.push({
            severity: "warn",
            rule: "mixed_overuse",
            advice: "Multiple `Schema.Types.Mixed` (or Mixed) usages detected. Prefer explicit paths/subdocuments for queryability and validation.",
        });
    }
    if (schemaDefs && !hasTimestampsOption(cleaned)) {
        findings.push({
            severity: "info",
            rule: "no_timestamps_tip",
            advice: "No `timestamps: true` (or timestamps options object) detected on Schema. Consider `{ timestamps: true }` if you need createdAt/updatedAt.",
        });
    }
    // listModels already dedupes — check raw calls for duplicates
    const rawNames = [];
    const modelCallRe = /(?:(?:mongoose|connection|db|conn)\s*\.\s*)?\bmodel\s*\(/g;
    let mm;
    while ((mm = modelCallRe.exec(cleaned))) {
        const open = mm.index + mm[0].length - 1;
        const close = findMatchingParen(cleaned, open);
        if (close < 0)
            continue;
        const args = cleaned.slice(open + 1, close);
        const parts = splitTopLevelCommas(args);
        const name = parts[0] ? unquote(parts[0]) : undefined;
        if (name)
            rawNames.push(name);
    }
    const rawSeen = new Map();
    for (const n of rawNames) {
        rawSeen.set(n, (rawSeen.get(n) ?? 0) + 1);
    }
    for (const [name, count] of rawSeen) {
        if (count > 1) {
            findings.push({
                severity: "warn",
                rule: "duplicate_model_name",
                advice: `Model name "${name}" is registered ${count} times via model() — OverwriteModelError risk if the same connection recompiles it.`,
            });
        }
    }
    if (paths.length === 0 && schemaDefs) {
        findings.push({
            severity: "info",
            rule: "empty_schema_paths",
            advice: "`new Schema(...)` found but no object-literal paths parsed. Schemas built only via `schema.add()` or non-literal args may not be visible to these heuristics.",
        });
    }
    // schemas unused var tip — if schema vars exist but never passed to model
    if (schemas && schemas.length > 0 && models.length > 0) {
        // soft: nothing mandatory
    }
    return findings;
}
