/**
 * Best-effort Prisma schema.prisma text heuristics.
 * No Prisma CLI, no network, no DB, no filesystem follow.
 */
const SCALAR_TYPES = new Set([
    "String",
    "Boolean",
    "Int",
    "BigInt",
    "Float",
    "Decimal",
    "DateTime",
    "Json",
    "Bytes",
    "Unsupported",
]);
/** Strip line and block comments; leave strings roughly intact for attrs. */
export function stripComments(raw) {
    const src = (raw ?? "").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
    let out = "";
    let i = 0;
    const n = src.length;
    let inString = false;
    let quote = "";
    while (i < n) {
        const ch = src[i];
        const next = i + 1 < n ? src[i + 1] : "";
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
        if (c === '"' || c === "'") {
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
const BLOCK_RE = /\b(model|enum|datasource|generator|type|view)\s+([A-Za-z_][A-Za-z0-9_]*)\s*\{/g;
export function parseBlocks(text) {
    const cleaned = stripComments(text ?? "");
    const blocks = [];
    BLOCK_RE.lastIndex = 0;
    let m;
    while ((m = BLOCK_RE.exec(cleaned))) {
        const kind = m[1];
        const name = m[2];
        const openAbs = m.index + m[0].length - 1;
        const closeAbs = findMatchingBrace(cleaned, openAbs);
        if (closeAbs < 0) {
            blocks.push({ kind, name, body: "" });
            continue;
        }
        const body = cleaned.slice(openAbs + 1, closeAbs);
        BLOCK_RE.lastIndex = Math.max(BLOCK_RE.lastIndex, closeAbs + 1);
        blocks.push({ kind, name, body });
    }
    return blocks;
}
/** Split model body into field lines and @@ attribute lines (best-effort). */
function splitModelLines(body) {
    const fields = [];
    const blockAttrs = [];
    // Join continued lines loosely: treat each non-empty line as a unit
    const lines = body.split("\n");
    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line)
            continue;
        if (line.startsWith("@@")) {
            blockAttrs.push(line);
            continue;
        }
        // Skip lone @ attrs that somehow appear (field attrs stay on field line)
        if (line.startsWith("@") && !/^[A-Za-z_]/.test(line))
            continue;
        fields.push(line);
    }
    return { fields, blockAttrs };
}
/**
 * Parse a field line: name Type modifiers? @attrs...
 * Examples:
 *   id String @id @default(cuid())
 *   posts Post[]
 *   author User? @relation(fields: [authorId], references: [id])
 *   authorId Int
 */
export function parseFieldLine(line) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("@@") || trimmed.startsWith("//"))
        return null;
    // name + type (with optional [] ? and Unsupported("..."))
    const m = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\s+(Unsupported\s*\(\s*"[^"]*"\s*\)|[A-Za-z_][A-Za-z0-9_]*(?:\s*\[\s*\])?\??)(.*)$/);
    if (!m)
        return null;
    const name = m[1];
    let type = m[2].replace(/\s+/g, "");
    const rest = (m[3] ?? "").trim();
    const attrs = [];
    if (rest) {
        // Capture @attr and @attr(...) including nested parens best-effort
        const attrRe = /@([A-Za-z_][A-Za-z0-9_]*)(?:\s*\((?:[^()]|\([^()]*\))*\))?/g;
        let am;
        while ((am = attrRe.exec(rest))) {
            attrs.push(am[0].replace(/\s+/g, " ").trim());
        }
    }
    const field = { name, type };
    if (attrs.length)
        field.attrs = attrs;
    return field;
}
export function parseEnumValues(body) {
    const values = [];
    for (const rawLine of body.split("\n")) {
        const line = rawLine.trim();
        if (!line || line.startsWith("@@") || line.startsWith("@") || line.startsWith("//")) {
            continue;
        }
        const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)/);
        if (m)
            values.push(m[1]);
    }
    return values;
}
function parseKv(body) {
    const out = {};
    for (const rawLine of body.split("\n")) {
        const line = rawLine.trim();
        if (!line || line.startsWith("//"))
            continue;
        const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/);
        if (!m)
            continue;
        out[m[1]] = m[2].trim();
    }
    return out;
}
/**
 * Redact URL values to provider/env-ref hints — never echo full connection secrets.
 */
export function urlHintFromValue(raw) {
    if (!raw)
        return undefined;
    const v = raw.trim();
    // env("DATABASE_URL") or env('...')
    const envM = v.match(/^env\s*\(\s*["']([^"']+)["']\s*\)$/i);
    if (envM)
        return `env:${envM[1]}`;
    // Quoted string URL
    const strM = v.match(/^["'](.+)["']$/);
    if (strM) {
        const url = strM[1];
        // protocol://...
        const proto = url.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):\/\//);
        if (proto) {
            // try host after @ or after ://
            const afterAt = url.split("@").pop() ?? url;
            const hostPart = afterAt.replace(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//, "").split("/")[0] ?? "";
            const host = hostPart.split(":")[0] || "redacted-host";
            return `${proto[1]}://***@${host}/***`;
        }
        return "literal:***";
    }
    // Unquoted env-ish
    if (/^env\b/i.test(v))
        return "env:(unparsed)";
    return "redacted";
}
export function listModels(text) {
    const blocks = parseBlocks(text);
    const models = [];
    const enums = [];
    for (const b of blocks) {
        if (b.kind === "model") {
            const { fields: fieldLines, blockAttrs } = splitModelLines(b.body);
            const fields = [];
            for (const fl of fieldLines) {
                const f = parseFieldLine(fl);
                if (f)
                    fields.push(f);
            }
            const model = { name: b.name, fields };
            if (blockAttrs.length)
                model["@@attrs"] = blockAttrs;
            models.push(model);
        }
        else if (b.kind === "enum") {
            enums.push({ name: b.name, values: parseEnumValues(b.body) });
        }
    }
    const result = {
        models,
        count: models.length,
    };
    if (enums.length)
        result.enums = enums;
    return result;
}
export function listDatasources(text) {
    const blocks = parseBlocks(text);
    const datasources = [];
    const generators = [];
    for (const b of blocks) {
        if (b.kind === "datasource") {
            const kv = parseKv(b.body);
            const ds = { name: b.name };
            if (kv.provider) {
                ds.provider = kv.provider.replace(/^["']|["']$/g, "");
            }
            if (kv.url) {
                ds.urlHint = urlHintFromValue(kv.url);
            }
            else if (kv.directUrl) {
                ds.urlHint = urlHintFromValue(kv.directUrl);
            }
            datasources.push(ds);
        }
        else if (b.kind === "generator") {
            const kv = parseKv(b.body);
            const g = { name: b.name };
            if (kv.provider) {
                g.provider = kv.provider.replace(/^["']|["']$/g, "");
            }
            generators.push(g);
        }
    }
    const result = { datasources };
    if (generators.length)
        result.generators = generators;
    return result;
}
function baseTypeName(type) {
    return type.replace(/\?/g, "").replace(/\[\]/g, "").trim();
}
function isListType(type) {
    return /\[\s*\]/.test(type);
}
function isOptionalType(type) {
    return type.includes("?");
}
export function listRelations(text) {
    const blocks = parseBlocks(text);
    const modelNames = new Set(blocks.filter((b) => b.kind === "model").map((b) => b.name));
    const relations = [];
    for (const b of blocks) {
        if (b.kind !== "model")
            continue;
        const { fields: fieldLines } = splitModelLines(b.body);
        for (const fl of fieldLines) {
            const f = parseFieldLine(fl);
            if (!f)
                continue;
            const base = baseTypeName(f.type);
            const hasRelationAttr = (f.attrs ?? []).some((a) => a.startsWith("@relation"));
            const looksRelational = hasRelationAttr || (modelNames.has(base) && !SCALAR_TYPES.has(base));
            if (!looksRelational)
                continue;
            let kind;
            if (hasRelationAttr) {
                const relAttr = (f.attrs ?? []).find((a) => a.startsWith("@relation"));
                if (relAttr && /fields\s*:/.test(relAttr))
                    kind = "relation-fields";
                else if (isListType(f.type))
                    kind = "one-to-many";
                else
                    kind = "relation";
            }
            else if (isListType(f.type)) {
                kind = "one-to-many";
            }
            else if (isOptionalType(f.type)) {
                kind = "optional-to-one";
            }
            else {
                kind = "to-one";
            }
            const rel = {
                from: b.name,
                field: f.name,
            };
            if (modelNames.has(base) || hasRelationAttr)
                rel.to = base;
            if (kind)
                rel.kind = kind;
            relations.push(rel);
        }
    }
    return { relations, count: relations.length };
}
export function lintSchema(text) {
    const findings = [];
    const raw = text ?? "";
    if (!raw.trim()) {
        findings.push({
            severity: "error",
            rule: "empty_schema",
            advice: "Schema text is empty. Paste a schema.prisma with at least a datasource and one model.",
        });
        return findings;
    }
    const blocks = parseBlocks(raw);
    const datasources = blocks.filter((b) => b.kind === "datasource");
    const generators = blocks.filter((b) => b.kind === "generator");
    const models = blocks.filter((b) => b.kind === "model");
    const enums = blocks.filter((b) => b.kind === "enum");
    if (datasources.length === 0) {
        findings.push({
            severity: "error",
            rule: "missing_datasource",
            advice: 'No `datasource` block found. Add e.g. `datasource db { provider = "postgresql" url = env("DATABASE_URL") }`.',
        });
    }
    if (generators.length === 0) {
        findings.push({
            severity: "warn",
            rule: "missing_generator",
            advice: 'No `generator` block found. Add e.g. `generator client { provider = "prisma-client-js" }`.',
        });
    }
    if (models.length === 0 && enums.length === 0) {
        findings.push({
            severity: "warn",
            rule: "no_models_or_enums",
            advice: "No `model` or `enum` blocks found. Schema may be incomplete for client generation.",
        });
    }
    // Plaintext URL in schema (quoted connection string with ://)
    const plaintextUrlRe = /\burl\s*=\s*["']([a-zA-Z][a-zA-Z0-9+.-]*):\/\/[^"']+["']/;
    if (plaintextUrlRe.test(stripComments(raw))) {
        findings.push({
            severity: "error",
            rule: "plaintext_url_in_schema",
            advice: 'Datasource `url` looks like a plaintext connection string. Prefer `url = env("DATABASE_URL")` and keep secrets out of schema.prisma.',
        });
    }
    // previewFeatures notes
    if (/previewFeatures\s*=/.test(raw)) {
        findings.push({
            severity: "info",
            rule: "preview_features_present",
            advice: "`previewFeatures` is set — confirm each flag is still needed for your Prisma version; preview APIs can change between releases.",
        });
    }
    for (const b of models) {
        const { fields: fieldLines, blockAttrs } = splitModelLines(b.body);
        const fields = fieldLines
            .map(parseFieldLine)
            .filter((f) => !!f);
        const hasId = fields.some((f) => (f.attrs ?? []).some((a) => a === "@id" || a.startsWith("@id(")));
        const hasCompoundId = blockAttrs.some((a) => a.startsWith("@@id"));
        if (!hasId && !hasCompoundId) {
            findings.push({
                severity: "warn",
                rule: "model_missing_id",
                advice: `Model "${b.name}" has no @id field or @@id — Prisma models usually need a primary key.`,
            });
        }
        // String ids without @id (field named id of type String lacking @id)
        for (const f of fields) {
            const base = baseTypeName(f.type);
            if (f.name === "id" &&
                base === "String" &&
                !(f.attrs ?? []).some((a) => a === "@id" || a.startsWith("@id("))) {
                findings.push({
                    severity: "warn",
                    rule: "string_id_without_at_id",
                    advice: `Model "${b.name}" has String field "id" without @id. Add @id (and usually @default(cuid()) / uuid()).`,
                });
            }
        }
        // missing @@map tip when model name is PascalCase multi-word without @@map
        const hasMap = blockAttrs.some((a) => a.startsWith("@@map"));
        if (!hasMap && /[a-z][A-Z]/.test(b.name)) {
            findings.push({
                severity: "info",
                rule: "missing_map_tip",
                advice: `Model "${b.name}" has no @@map — consider @@map("snake_case_table") if the DB table name differs from the Prisma model name.`,
            });
        }
        if (fields.length === 0) {
            findings.push({
                severity: "warn",
                rule: "empty_model",
                advice: `Model "${b.name}" has no fields.`,
            });
        }
    }
    // Duplicate model names
    const seen = new Map();
    for (const b of models) {
        seen.set(b.name, (seen.get(b.name) ?? 0) + 1);
    }
    for (const [name, count] of seen) {
        if (count > 1) {
            findings.push({
                severity: "error",
                rule: "duplicate_model_name",
                advice: `Model name "${name}" appears ${count} times.`,
            });
        }
    }
    return findings;
}
