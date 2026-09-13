/**
 * Best-effort OpenAPI YAML/JSON/JSONC → Zod mapping heuristics.
 * No Zod runtime, no codegen, no network, no filesystem follow.
 */
import { parse as parseYaml } from "yaml";
const HTTP_METHODS = new Set([
    "get",
    "put",
    "post",
    "delete",
    "options",
    "head",
    "patch",
    "trace",
]);
/** Strip line and block comments from JSONC-ish text (double-quoted strings). */
export function stripJsonComments(text) {
    const src = text ?? "";
    let out = "";
    let i = 0;
    const n = src.length;
    let inString = false;
    let escape = false;
    while (i < n) {
        const ch = src[i];
        const next = i + 1 < n ? src[i + 1] : "";
        if (inString) {
            out += ch;
            if (escape) {
                escape = false;
            }
            else if (ch === "\\") {
                escape = true;
            }
            else if (ch === '"') {
                inString = false;
            }
            i++;
            continue;
        }
        if (ch === '"') {
            inString = true;
            out += ch;
            i++;
            continue;
        }
        if (ch === "/" && next === "/") {
            i += 2;
            while (i < n && src[i] !== "\n" && src[i] !== "\r")
                i++;
            continue;
        }
        if (ch === "/" && next === "*") {
            i += 2;
            while (i < n) {
                if (src[i] === "*" && i + 1 < n && src[i + 1] === "/") {
                    i += 2;
                    break;
                }
                i++;
            }
            continue;
        }
        out += ch;
        i++;
    }
    return out;
}
function stripBom(s) {
    return (s ?? "").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
}
/**
 * Parse OpenAPI text: prefer JSON, then JSONC (comment-strip), then YAML.
 */
export function parseOpenApiText(text) {
    const raw = stripBom(text ?? "");
    if (!raw.trim()) {
        return { doc: null, format: "empty" };
    }
    const trimmed = raw.trim();
    // 1) Strict JSON
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
        try {
            const v = JSON.parse(trimmed);
            if (v && typeof v === "object" && !Array.isArray(v)) {
                return { doc: v, format: "json" };
            }
            return {
                doc: null,
                format: "error",
                parseError: "OpenAPI root must be an object",
            };
        }
        catch {
            // try JSONC
            try {
                const v = JSON.parse(stripJsonComments(trimmed));
                if (v && typeof v === "object" && !Array.isArray(v)) {
                    return { doc: v, format: "jsonc" };
                }
                return {
                    doc: null,
                    format: "error",
                    parseError: "OpenAPI root must be an object",
                };
            }
            catch (e) {
                // fall through to YAML (some YAML docs start with { rarely)
            }
        }
    }
    // 2) JSONC without leading brace edge — unlikely for OpenAPI
    try {
        const stripped = stripJsonComments(trimmed);
        if (stripped.trim().startsWith("{")) {
            const v = JSON.parse(stripped);
            if (v && typeof v === "object" && !Array.isArray(v)) {
                return { doc: v, format: "jsonc" };
            }
        }
    }
    catch {
        // ignore
    }
    // 3) YAML
    try {
        const v = parseYaml(trimmed);
        if (v && typeof v === "object" && !Array.isArray(v)) {
            return { doc: v, format: "yaml" };
        }
        return {
            doc: null,
            format: "error",
            parseError: "OpenAPI YAML root must be an object",
        };
    }
    catch (e) {
        return {
            doc: null,
            format: "error",
            parseError: e instanceof Error ? e.message : String(e),
        };
    }
}
function refName(ref) {
    // #/components/schemas/User or #/definitions/User
    const m = ref.match(/\/(?:schemas|definitions)\/([^/~]+)$/);
    if (m)
        return decodeURIComponent(m[1].replace(/~1/g, "/").replace(/~0/g, "~"));
    const parts = ref.split("/");
    return parts[parts.length - 1] || undefined;
}
/**
 * Best-effort Zod type hint for a JSON Schema / OpenAPI schema node.
 */
export function zodHintForSchema(schema) {
    if (!schema || typeof schema !== "object")
        return undefined;
    if (schema.$ref && typeof schema.$ref === "string") {
        const name = refName(schema.$ref);
        return name ? name /* reference other schema */ : `/* ${schema.$ref} */`;
    }
    if (schema.const !== undefined) {
        return `z.literal(${JSON.stringify(schema.const)})`;
    }
    if (Array.isArray(schema.enum) && schema.enum.length > 0) {
        const allStrings = schema.enum.every((e) => typeof e === "string");
        if (allStrings) {
            const vals = schema.enum.map((e) => JSON.stringify(e)).join(", ");
            return `z.enum([${vals}])`;
        }
        const lits = schema.enum.map((e) => `z.literal(${JSON.stringify(e)})`).join(", ");
        return `z.union([${lits}])`;
    }
    let types = [];
    if (Array.isArray(schema.type)) {
        types = schema.type.map(String);
    }
    else if (typeof schema.type === "string") {
        types = [schema.type];
    }
    const nullable = schema.nullable === true ||
        types.includes("null") ||
        (Array.isArray(schema.type) && schema.type.includes("null"));
    const nonNull = types.filter((t) => t !== "null");
    let primary = nonNull[0];
    if (!primary) {
        if (schema.properties || schema.required)
            primary = "object";
        else if (schema.items)
            primary = "array";
        else if (schema.oneOf || schema.anyOf || schema.allOf) {
            // fall through
        }
        else {
            return undefined;
        }
    }
    if (schema.oneOf && schema.oneOf.length) {
        const parts = schema.oneOf
            .map((s) => zodHintForSchema(s) || "z.unknown()")
            .join(", ");
        let hint = `z.union([${parts}])`;
        if (nullable)
            hint += ".nullable()";
        return hint;
    }
    if (schema.anyOf && schema.anyOf.length) {
        const parts = schema.anyOf
            .map((s) => zodHintForSchema(s) || "z.unknown()")
            .join(", ");
        let hint = `z.union([${parts}])`;
        if (nullable)
            hint += ".nullable()";
        return hint;
    }
    if (schema.allOf && schema.allOf.length) {
        // Intersection approximation
        const parts = schema.allOf
            .map((s) => zodHintForSchema(s) || "z.unknown()")
            .join(", ");
        let hint = schema.allOf.length === 1
            ? parts
            : `z.intersection(${parts.replace(/, /, ", ")})`;
        // Better: chain with and if two parts
        if (schema.allOf.length === 2) {
            const a = zodHintForSchema(schema.allOf[0]) || "z.unknown()";
            const b = zodHintForSchema(schema.allOf[1]) || "z.unknown()";
            hint = `z.intersection(${a}, ${b})`;
        }
        else if (schema.allOf.length > 2) {
            hint = `/* allOf */ z.intersection(${parts})`;
        }
        if (nullable)
            hint += ".nullable()";
        return hint;
    }
    let hint;
    switch (primary) {
        case "string": {
            const fmt = schema.format;
            if (fmt === "email")
                hint = "z.string().email()";
            else if (fmt === "uri" || fmt === "url")
                hint = "z.string().url()";
            else if (fmt === "uuid")
                hint = "z.string().uuid()";
            else if (fmt === "date-time")
                hint = "z.string().datetime()";
            else if (fmt === "date")
                hint = "z.string() /* date */";
            else
                hint = "z.string()";
            break;
        }
        case "integer":
            hint = "z.number().int()";
            break;
        case "number":
            hint = "z.number()";
            break;
        case "boolean":
            hint = "z.boolean()";
            break;
        case "null":
            hint = "z.null()";
            break;
        case "array": {
            const items = schema.items;
            let itemHint = "z.unknown()";
            if (Array.isArray(items)) {
                itemHint =
                    items.length === 1
                        ? zodHintForSchema(items[0]) || "z.unknown()"
                        : `z.tuple([${items.map((i) => zodHintForSchema(i) || "z.unknown()").join(", ")}])`;
                if (items.length > 1) {
                    hint = itemHint; // already a tuple
                    break;
                }
            }
            else if (items) {
                itemHint = zodHintForSchema(items) || "z.unknown()";
            }
            hint = `z.array(${itemHint})`;
            break;
        }
        case "object": {
            const props = schema.properties;
            if (props && Object.keys(props).length > 0) {
                const required = new Set(schema.required || []);
                const entries = [];
                for (const [key, val] of Object.entries(props)) {
                    let ph = zodHintForSchema(val) || "z.unknown()";
                    if (!required.has(key) && !ph.includes(".optional()")) {
                        ph += ".optional()";
                    }
                    entries.push(`${JSON.stringify(key)}: ${ph}`);
                }
                hint = `z.object({ ${entries.join(", ")} })`;
            }
            else if (schema.additionalProperties === true) {
                hint = "z.record(z.string(), z.unknown())";
            }
            else if (schema.additionalProperties &&
                typeof schema.additionalProperties === "object") {
                const vh = zodHintForSchema(schema.additionalProperties) ||
                    "z.unknown()";
                hint = `z.record(z.string(), ${vh})`;
            }
            else {
                hint = "z.object({})";
            }
            break;
        }
        default:
            hint = `z.unknown() /* ${primary} */`;
    }
    if (hint && nullable && !hint.includes(".nullable()")) {
        hint += ".nullable()";
    }
    return hint;
}
function schemaTypeLabel(schema) {
    if (schema.$ref)
        return "$ref";
    if (Array.isArray(schema.type))
        return schema.type.join("|");
    if (typeof schema.type === "string")
        return schema.type;
    if (schema.properties || schema.required)
        return "object";
    if (schema.items)
        return "array";
    if (schema.enum)
        return "enum";
    if (schema.oneOf)
        return "oneOf";
    if (schema.anyOf)
        return "anyOf";
    if (schema.allOf)
        return "allOf";
    return undefined;
}
export function getSchemaMap(doc) {
    const fromComponents = doc.components?.schemas;
    if (fromComponents && typeof fromComponents === "object") {
        return fromComponents;
    }
    // OAS2
    if (doc.definitions && typeof doc.definitions === "object") {
        return doc.definitions;
    }
    return {};
}
export function listPaths(text) {
    const { doc } = parseOpenApiText(text);
    if (!doc)
        return { paths: [], count: 0 };
    const pathsObj = doc.paths;
    if (!pathsObj || typeof pathsObj !== "object") {
        return { paths: [], count: 0 };
    }
    const paths = [];
    for (const [path, item] of Object.entries(pathsObj)) {
        const methods = [];
        if (item && typeof item === "object") {
            for (const key of Object.keys(item)) {
                const m = key.toLowerCase();
                if (HTTP_METHODS.has(m))
                    methods.push(m);
            }
        }
        methods.sort();
        paths.push({ path, methods });
    }
    paths.sort((a, b) => a.path.localeCompare(b.path));
    return { paths, count: paths.length };
}
export function listSchemaHints(text) {
    const { doc } = parseOpenApiText(text);
    if (!doc)
        return { schemas: [], count: 0 };
    const map = getSchemaMap(doc);
    const schemas = [];
    for (const [name, schema] of Object.entries(map)) {
        if (!schema || typeof schema !== "object") {
            schemas.push({ name });
            continue;
        }
        const entry = { name };
        const t = schemaTypeLabel(schema);
        if (t)
            entry.type = t;
        const zh = zodHintForSchema(schema);
        if (zh)
            entry.zodHint = zh;
        schemas.push(entry);
    }
    schemas.sort((a, b) => a.name.localeCompare(b.name));
    return { schemas, count: schemas.length };
}
function requestBodyHint(op) {
    const rb = op.requestBody;
    if (!rb || typeof rb !== "object") {
        // OAS2 body param
        const params = op.parameters;
        if (Array.isArray(params)) {
            for (const p of params) {
                if (p && typeof p === "object" && p.in === "body") {
                    const schema = p.schema;
                    const zh = zodHintForSchema(schema);
                    return zh ? `body: ${zh}` : "body";
                }
            }
        }
        return undefined;
    }
    const body = rb;
    if (body.$ref)
        return `ref:${refName(body.$ref) || body.$ref}`;
    const content = body.content;
    if (!content || typeof content !== "object") {
        return body.required ? "required" : "present";
    }
    const types = Object.keys(content);
    const first = types[0];
    if (!first)
        return body.required ? "required" : "present";
    const schema = content[first]?.schema;
    const zh = zodHintForSchema(schema);
    const req = body.required ? "required " : "";
    if (zh)
        return `${req}${first} → ${zh}`;
    return `${req}${types.join(", ")}`;
}
export function listOps(text) {
    const { doc } = parseOpenApiText(text);
    if (!doc)
        return { operations: [], count: 0 };
    const pathsObj = doc.paths;
    if (!pathsObj || typeof pathsObj !== "object") {
        return { operations: [], count: 0 };
    }
    const operations = [];
    for (const [path, item] of Object.entries(pathsObj)) {
        if (!item || typeof item !== "object")
            continue;
        for (const [key, val] of Object.entries(item)) {
            const method = key.toLowerCase();
            if (!HTTP_METHODS.has(method))
                continue;
            if (!val || typeof val !== "object")
                continue;
            const op = val;
            const entry = {
                method,
                path,
                responses: [],
            };
            if (typeof op.operationId === "string")
                entry.operationId = op.operationId;
            if (Array.isArray(op.tags) && op.tags.length) {
                entry.tags = op.tags.map(String);
            }
            const rb = requestBodyHint(op);
            if (rb)
                entry.requestBody = rb;
            const responses = op.responses;
            if (responses && typeof responses === "object") {
                entry.responses = Object.keys(responses).sort((a, b) => {
                    const na = Number(a);
                    const nb = Number(b);
                    if (!Number.isNaN(na) && !Number.isNaN(nb))
                        return na - nb;
                    return a.localeCompare(b);
                });
            }
            operations.push(entry);
        }
    }
    operations.sort((a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method));
    return { operations, count: operations.length };
}
/** Collect $ref schema names referenced anywhere in a value tree. */
function collectSchemaRefs(node, out, depth = 0) {
    if (depth > 40 || node === null || node === undefined)
        return;
    if (typeof node === "string") {
        if (node.includes("/schemas/") || node.includes("/definitions/")) {
            const name = refName(node);
            if (name)
                out.add(name);
        }
        return;
    }
    if (Array.isArray(node)) {
        for (const item of node)
            collectSchemaRefs(item, out, depth + 1);
        return;
    }
    if (typeof node === "object") {
        const obj = node;
        if (typeof obj.$ref === "string") {
            const name = refName(obj.$ref);
            if (name)
                out.add(name);
        }
        for (const v of Object.values(obj))
            collectSchemaRefs(v, out, depth + 1);
    }
}
export function lintOpenApi(text) {
    const findings = [];
    const raw = text ?? "";
    if (!raw.trim()) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Source text is empty. Paste an OpenAPI 3.x (or Swagger 2) YAML/JSON document.",
        });
        return findings;
    }
    const parsed = parseOpenApiText(raw);
    if (!parsed.doc) {
        findings.push({
            severity: "error",
            rule: "parse_error",
            advice: `Could not parse OpenAPI text (${parsed.format}): ${parsed.parseError || "unknown error"}. Expect JSON, JSONC, or YAML.`,
        });
        return findings;
    }
    const doc = parsed.doc;
    const version = doc.openapi || doc.swagger;
    if (!version) {
        findings.push({
            severity: "warn",
            rule: "missing_openapi_version",
            advice: "Missing `openapi` (3.x) or `swagger` (2.0) version field. Add `openapi: \"3.0.3\"` (or similar) at the document root.",
        });
    }
    const pathsObj = doc.paths;
    const pathKeys = pathsObj && typeof pathsObj === "object" ? Object.keys(pathsObj) : [];
    if (pathKeys.length === 0) {
        findings.push({
            severity: "warn",
            rule: "no_paths",
            advice: "No `paths` entries found. An OpenAPI doc without paths cannot describe HTTP operations for Zod request/response mapping.",
        });
    }
    const schemaMap = getSchemaMap(doc);
    const schemaNames = Object.keys(schemaMap);
    // Unused schemas tip: defined in components.schemas but never $ref'd from paths/components
    if (schemaNames.length > 0) {
        const referenced = new Set();
        // Search whole doc except self-only — still include cross-refs between schemas
        collectSchemaRefs(doc, referenced);
        const unused = schemaNames.filter((n) => !referenced.has(n));
        // A schema that only references itself shouldn't count as used by ops;
        // if nothing in paths references it and no other schema refs it from outside...
        // Our collectSchemaRefs walks the whole doc, so mutual refs mark both used.
        // For truly unused (never appears in any $ref):
        if (unused.length > 0 && unused.length <= schemaNames.length) {
            // Also check: schemas only used by other unused schemas — keep simple tip
            const sample = unused.slice(0, 5).join(", ");
            const more = unused.length > 5 ? ` (+${unused.length - 5} more)` : "";
            findings.push({
                severity: "info",
                rule: "unused_schemas_tip",
                advice: `${unused.length} schema(s) in components/definitions are never $ref'd: ${sample}${more}. Remove dead schemas or wire them into request/response bodies before generating Zod.`,
            });
        }
    }
    // Nullable vs optional mapping tip
    let sawNullable = false;
    let sawOptionalProp = false;
    for (const schema of Object.values(schemaMap)) {
        if (!schema || typeof schema !== "object")
            continue;
        if (schema.nullable === true)
            sawNullable = true;
        if (schema.properties) {
            const req = new Set(schema.required || []);
            for (const [key, prop] of Object.entries(schema.properties)) {
                if (!req.has(key))
                    sawOptionalProp = true;
                if (prop && typeof prop === "object" && prop.nullable === true) {
                    sawNullable = true;
                }
            }
        }
    }
    // Also scan operations for nullable
    if (!sawNullable && pathsObj) {
        const blob = JSON.stringify(pathsObj);
        if (/"nullable"\s*:\s*true/.test(blob))
            sawNullable = true;
    }
    if (sawNullable || sawOptionalProp) {
        findings.push({
            severity: "info",
            rule: "nullable_vs_optional_tip",
            advice: "OpenAPI `nullable: true` maps to Zod `.nullable()` (value may be null). Properties missing from `required` map to `.optional()` (key may be absent). They are not interchangeable — use `.nullish()` only when both null and undefined are allowed.",
        });
    }
    // integer → z.number().int() tip when integers present (nested props too)
    function hasIntegerType(node, depth = 0) {
        if (depth > 12 || !node || typeof node !== "object")
            return false;
        const s = node;
        const t = s.type;
        if (t === "integer" || (Array.isArray(t) && t.includes("integer")))
            return true;
        if (s.properties) {
            for (const p of Object.values(s.properties)) {
                if (hasIntegerType(p, depth + 1))
                    return true;
            }
        }
        if (s.items) {
            if (Array.isArray(s.items)) {
                if (s.items.some((i) => hasIntegerType(i, depth + 1)))
                    return true;
            }
            else if (hasIntegerType(s.items, depth + 1))
                return true;
        }
        return false;
    }
    const sawInteger = Object.values(schemaMap).some((s) => hasIntegerType(s));
    if (sawInteger) {
        findings.push({
            severity: "info",
            rule: "integer_zod_hint",
            advice: "OpenAPI `integer` maps to `z.number().int()` (Zod has no separate integer primitive). Prefer `.int()` over plain `z.number()` for status codes, IDs, and counts.",
        });
    }
    // OAS2 tip
    if (doc.swagger && !doc.openapi) {
        findings.push({
            severity: "info",
            rule: "swagger2_tip",
            advice: "Swagger 2.0 detected (`swagger` field). Schema defs live under `definitions` (handled here). Consider upgrading to OpenAPI 3.x (`components.schemas`) for richer requestBody/content mapping to Zod.",
        });
    }
    // No components.schemas at all but paths exist — tip
    if (schemaNames.length === 0 && pathKeys.length > 0) {
        findings.push({
            severity: "info",
            rule: "no_components_schemas",
            advice: "Paths exist but no `components.schemas` / `definitions` found. Inline response/request schemas still work for ops hints; extracting named Zod schemas is easier with shared components.",
        });
    }
    return findings;
}
