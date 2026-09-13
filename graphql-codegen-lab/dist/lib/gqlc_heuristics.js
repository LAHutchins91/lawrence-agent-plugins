/**
 * Best-effort GraphQL Code Generator config heuristics.
 * Prefer YAML/JSON via `yaml`; best-effort for codegen.ts (no eval).
 * No codegen runtime, no network, no filesystem follow.
 */
import { parse as yamlParse } from "yaml";
function asMap(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value;
    }
    return null;
}
function asStringList(value) {
    if (typeof value === "string") {
        const s = value.trim();
        return s ? [s] : [];
    }
    if (Array.isArray(value)) {
        const out = [];
        for (const item of value) {
            if (typeof item === "string" && item.trim())
                out.push(item.trim());
            else if (item && typeof item === "object" && !Array.isArray(item)) {
                // plugins can be objects: { "typescript": { ... } }
                for (const k of Object.keys(item)) {
                    if (k.trim())
                        out.push(k.trim());
                }
            }
        }
        return out;
    }
    if (value && typeof value === "object") {
        // object form plugins: { typescript: {}, "typescript-operations": {} }
        return Object.keys(value).filter((k) => k.trim());
    }
    return [];
}
function normalizeStringOrList(value) {
    if (typeof value === "string") {
        const s = value.trim();
        return s || undefined;
    }
    if (Array.isArray(value)) {
        const list = value
            .filter((x) => typeof x === "string")
            .map((x) => x.trim())
            .filter(Boolean);
        if (list.length === 0)
            return undefined;
        if (list.length === 1)
            return list[0];
        return list;
    }
    // schema can be object with url/headers — surface the url string if present
    const m = asMap(value);
    if (m) {
        if (typeof m.url === "string" && m.url.trim())
            return m.url.trim();
        if (typeof m.path === "string" && m.path.trim())
            return m.path.trim();
    }
    return undefined;
}
function pushUnique(arr, seen, v) {
    const s = v?.trim();
    if (!s || seen.has(s))
        return;
    seen.add(s);
    arr.push(s);
}
/** Strip BOM, normalize newlines. */
function normalizeRaw(raw) {
    return (raw ?? "").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
}
function stripJsComments(src) {
    let out = "";
    let i = 0;
    const n = src.length;
    let inSingle = false;
    let inDouble = false;
    let inTemplate = false;
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
            if (ch === "\\")
                escape = true;
            else if (ch === "'")
                inSingle = false;
            out += ch;
            i++;
            continue;
        }
        if (inDouble) {
            if (ch === "\\")
                escape = true;
            else if (ch === '"')
                inDouble = false;
            out += ch;
            i++;
            continue;
        }
        if (inTemplate) {
            if (ch === "\\")
                escape = true;
            else if (ch === "`")
                inTemplate = false;
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
        if (ch === "`") {
            inTemplate = true;
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
function extractBalanced(src, start) {
    if (start < 0 || start >= src.length)
        return null;
    const open = src[start];
    const close = open === "[" ? "]" : open === "{" ? "}" : null;
    if (!close)
        return null;
    let depth = 0;
    let inStr = null;
    let escape = false;
    for (let i = start; i < src.length; i++) {
        const ch = src[i];
        if (inStr) {
            if (escape)
                escape = false;
            else if (ch === "\\")
                escape = true;
            else if (ch === inStr)
                inStr = null;
            continue;
        }
        if (ch === '"' || ch === "'" || ch === "`") {
            inStr = ch;
            continue;
        }
        if (ch === open)
            depth++;
        else if (ch === close) {
            depth--;
            if (depth === 0)
                return src.slice(start, i + 1);
        }
    }
    return null;
}
function unescapeStr(s) {
    return s.replace(/\\(.)/g, "$1");
}
function looksLikeTsConfig(text) {
    const t = text.trim();
    return (/\bCodegenConfig\b/.test(t) ||
        /\bdefineConfig\s*\(/.test(t) ||
        /\bexport\s+default\b/.test(t) ||
        /\bmodule\.exports\b/.test(t) ||
        /\bimport\s+type\b/.test(t) ||
        /\bsatisfies\s+CodegenConfig\b/.test(t) ||
        /codegen\.ts/i.test(t));
}
/**
 * Best-effort: turn a JS/TS object-literal-ish string into JSON-parseable text.
 * Handles unquoted keys, single quotes, trailing commas. No eval.
 */
function jsObjectToJsonish(objSrc) {
    let s = objSrc.trim();
    // Remove TS `as const` / satisfies trailing junk outside — caller should pass pure object
    // Single → double quotes (naive, skip already-double)
    s = s.replace(/'([^'\\]|\\.)*'/g, (m) => {
        const inner = m.slice(1, -1).replace(/\\'/g, "'").replace(/"/g, '\\"');
        return `"${inner}"`;
    });
    // Quote bare keys
    s = s.replace(/([{,]\s*)([A-Za-z_$][\w$]*)\s*:/g, '$1"$2":');
    // Trailing commas
    s = s.replace(/,\s*([}\]])/g, "$1");
    return s;
}
function tryParseJsObject(objSrc) {
    try {
        return JSON.parse(jsObjectToJsonish(objSrc));
    }
    catch {
        return undefined;
    }
}
function extractTsConfigObject(text) {
    const cleaned = stripJsComments(normalizeRaw(text));
    // defineConfig({ ... })
    const defIdx = cleaned.search(/\bdefineConfig\s*\(/);
    if (defIdx !== -1) {
        const paren = cleaned.indexOf("(", defIdx);
        let objStart = cleaned.indexOf("{", paren);
        if (objStart !== -1 && objStart < paren + 200) {
            const blob = extractBalanced(cleaned, objStart);
            if (blob) {
                const parsed = tryParseJsObject(blob);
                const m = asMap(parsed);
                if (m)
                    return m;
            }
        }
    }
    // export default { ... } or satisfies CodegenConfig = { ... }
    const patterns = [
        /\bexport\s+default\s+(?:defineConfig\s*\(\s*)?\{/,
        /\b(?:const|let|var)\s+\w+\s*(?::\s*CodegenConfig)?\s*(?:=\s*(?:defineConfig\s*\(\s*)?)?\{/,
        /\bsatisfies\s+CodegenConfig\s*=\s*\{/,
        /\bmodule\.exports\s*=\s*(?:defineConfig\s*\(\s*)?\{/,
    ];
    for (const re of patterns) {
        const m = re.exec(cleaned);
        if (!m)
            continue;
        const brace = cleaned.indexOf("{", m.index);
        if (brace === -1)
            continue;
        const blob = extractBalanced(cleaned, brace);
        if (!blob)
            continue;
        const parsed = tryParseJsObject(blob);
        const map = asMap(parsed);
        if (map)
            return map;
    }
    // Fallback: first top-level-looking { with schema/documents/generates keys via regex harvest
    return null;
}
function tryParseConfigDoc(text) {
    const raw = normalizeRaw(text).trim();
    if (!raw)
        return { data: null, format: "unknown" };
    // Prefer JSON if it looks like JSON
    if (raw.startsWith("{") || raw.startsWith("[")) {
        try {
            const data = JSON.parse(raw);
            const m = asMap(data);
            if (m)
                return { data: m, format: "json" };
        }
        catch {
            // fall through
        }
    }
    // YAML (also handles many YAML docs that are not starting with {)
    // Skip pure TS files that yaml would mis-parse as a single string
    const looksTs = looksLikeTsConfig(raw) &&
        (/\bimport\s+/.test(raw) ||
            /\bexport\s+/.test(raw) ||
            /\bdefineConfig\b/.test(raw) ||
            /\bCodegenConfig\b/.test(raw));
    if (!looksTs) {
        try {
            const data = yamlParse(raw);
            const m = asMap(data);
            if (m)
                return { data: m, format: "yaml" };
        }
        catch {
            // fall through
        }
    }
    // TS/JS heuristic
    if (looksTs || looksLikeTsConfig(raw)) {
        const m = extractTsConfigObject(raw);
        if (m)
            return { data: m, format: "ts-heuristic" };
    }
    // Last chance: yaml even for mixed pastes (fenced content handled by caller)
    try {
        const data = yamlParse(raw);
        const m = asMap(data);
        if (m)
            return { data: m, format: "yaml" };
    }
    catch {
        /* ignore */
    }
    return { data: null, format: "unknown" };
}
/** Pull fenced ```yaml/json/ts blocks and prefer the richest config-looking one. */
function extractConfigCandidates(text) {
    const raw = normalizeRaw(text);
    const out = [];
    const fenceRe = /```(?:ya?ml|json|ts|typescript|js|javascript)?\s*\n([\s\S]*?)```/gi;
    let m;
    while ((m = fenceRe.exec(raw))) {
        const body = (m[1] ?? "").trim();
        if (body)
            out.push(body);
    }
    // Whole text as candidate
    out.push(raw.trim());
    return out;
}
function parseBestConfig(text) {
    let best = null;
    let bestScore = -1;
    for (const cand of extractConfigCandidates(text)) {
        const { data } = tryParseConfigDoc(cand);
        if (!data)
            continue;
        let score = 0;
        if ("schema" in data)
            score += 3;
        if ("documents" in data)
            score += 3;
        if ("generates" in data)
            score += 4;
        if ("plugins" in data)
            score += 2;
        if ("config" in data)
            score += 1;
        if ("scalars" in data)
            score += 2;
        if (score > bestScore) {
            bestScore = score;
            best = data;
        }
    }
    return best;
}
function collectPluginsFromValue(value, into, seen) {
    for (const p of asStringList(value))
        pushUnique(into, seen, p);
}
function collectPluginsFromGenerates(generates, plugins, seenPlugins, generateTargets, seenTargets) {
    const g = asMap(generates);
    if (!g)
        return;
    for (const [target, spec] of Object.entries(g)) {
        pushUnique(generateTargets, seenTargets, target);
        const sm = asMap(spec);
        if (!sm)
            continue;
        if ("plugins" in sm)
            collectPluginsFromValue(sm.plugins, plugins, seenPlugins);
        // preset-only entries may omit plugins
        if (typeof sm.preset === "string") {
            pushUnique(plugins, seenPlugins, `preset:${sm.preset}`);
        }
    }
}
/** CLI: graphql-codegen --config ... or -p typescript (legacy plugin flag). */
function collectFromCli(text, plugins, seenPlugins, generateTargets, seenTargets) {
    const raw = normalizeRaw(text);
    // --plugin / -p (graphql-codegen historically supports -p <plugin>)
    const pluginRe = /(?:^|\s)(?:-p|--plugin|--plugins)(?:=|\s+)(?:"([^"]*)"|'([^']*)'|(\S+))/gi;
    let m;
    while ((m = pluginRe.exec(raw))) {
        const v = m[1] ?? m[2] ?? m[3] ?? "";
        for (const part of v.split(","))
            pushUnique(plugins, seenPlugins, part);
    }
    // generates target sometimes appears as --generates / output path after -o (not standard)
    const genRe = /(?:^|\s)--generates(?:=|\s+)(?:"([^"]*)"|'([^']*)'|(\S+))/gi;
    while ((m = genRe.exec(raw))) {
        pushUnique(generateTargets, seenTargets, m[1] ?? m[2] ?? m[3]);
    }
}
/**
 * Plugins from `generates` / `plugins`; optional generate target paths.
 * `count` = plugins.length.
 */
export function listPlugins(text) {
    const plugins = [];
    const generates = [];
    const seenP = new Set();
    const seenG = new Set();
    const data = parseBestConfig(text);
    if (data) {
        if ("plugins" in data)
            collectPluginsFromValue(data.plugins, plugins, seenP);
        if ("generates" in data) {
            collectPluginsFromGenerates(data.generates, plugins, seenP, generates, seenG);
        }
    }
    collectFromCli(text, plugins, seenP, generates, seenG);
    // Regex fallback for YAML-ish plugins: lists under plugins:
    if (plugins.length === 0) {
        const cleaned = normalizeRaw(text);
        // plugins:\n  - typescript
        const block = /(?:^|\n)\s*plugins\s*:\s*\n((?:\s*-\s*.+\n?)+)/gi;
        let m;
        while ((m = block.exec(cleaned))) {
            const lines = m[1] ?? "";
            const itemRe = /^\s*-\s*(?:"([^"]*)"|'([^']*)'|(\S+))/gm;
            let im;
            while ((im = itemRe.exec(lines))) {
                pushUnique(plugins, seenP, im[1] ?? im[2] ?? im[3]);
            }
        }
        // inline plugins: [typescript, typescript-operations]
        const inline = /(?:^|\n)\s*plugins\s*:\s*\[([^\]]*)\]/gi;
        while ((m = inline.exec(cleaned))) {
            const inner = m[1] ?? "";
            for (const part of inner.split(",")) {
                const cleanedPart = part.trim().replace(/^["']|["']$/g, "");
                pushUnique(plugins, seenP, cleanedPart);
            }
        }
        // generates targets
        const genBlock = /(?:^|\n)\s*generates\s*:\s*\n((?:\s+\S.*\n?)+)/gi;
        while ((m = genBlock.exec(cleaned))) {
            const lines = m[1] ?? "";
            for (const line of lines.split("\n")) {
                const km = /^\s{2,}(?:"([^"]+)"|'([^']+)'|([^\s:#][^:]*?))\s*:/.exec(line);
                if (km)
                    pushUnique(generates, seenG, (km[1] ?? km[2] ?? km[3])?.trim());
            }
        }
    }
    const result = {
        plugins,
        count: plugins.length,
    };
    if (generates.length > 0)
        result.generates = generates;
    return result;
}
function collectStringField(data, key) {
    return normalizeStringOrList(data[key]);
}
/** Flatten string|string[] to list for counting. */
function flattenPaths(v) {
    if (!v)
        return [];
    return Array.isArray(v) ? v : [v];
}
/**
 * schema / documents from config fields.
 * `count` = schema entries + documents entries.
 */
export function listDocuments(text) {
    let schema;
    let documents;
    const data = parseBestConfig(text);
    if (data) {
        schema = collectStringField(data, "schema");
        documents = collectStringField(data, "documents");
    }
    // Regex / CLI fallback
    if (!schema || !documents) {
        const cleaned = normalizeRaw(text);
        if (!schema) {
            const schemaRe = /(?:^|\n)\s*schema\s*:\s*(?:"([^"]*)"|'([^']*)'|(\[[^\]]*\])|(\S+))/i;
            const m = schemaRe.exec(cleaned);
            if (m) {
                if (m[3]) {
                    try {
                        const arr = yamlParse(m[3]);
                        schema = normalizeStringOrList(arr);
                    }
                    catch {
                        schema = m[3];
                    }
                }
                else {
                    schema = (m[1] ?? m[2] ?? m[4])?.trim();
                }
            }
            // TS: schema: '...' or schema: ["a", "b"]
            if (!schema) {
                const tsSchema = /(?:^|[\s,{])schema\s*:\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`)/i.exec(cleaned);
                if (tsSchema)
                    schema = (tsSchema[1] ?? tsSchema[2] ?? tsSchema[3])?.trim();
            }
        }
        if (!documents) {
            const docRe = /(?:^|\n)\s*documents\s*:\s*(?:"([^"]*)"|'([^']*)'|(\[[^\]]*\])|(\S+))/i;
            const m = docRe.exec(cleaned);
            if (m) {
                if (m[3]) {
                    try {
                        const arr = yamlParse(m[3]);
                        documents = normalizeStringOrList(arr);
                    }
                    catch {
                        documents = m[3];
                    }
                }
                else {
                    documents = (m[1] ?? m[2] ?? m[4])?.trim();
                }
            }
            if (!documents) {
                const tsDoc = /(?:^|[\s,{])documents\s*:\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`)/i.exec(cleaned);
                if (tsDoc)
                    documents = (tsDoc[1] ?? tsDoc[2] ?? tsDoc[3])?.trim();
            }
        }
    }
    // CLI --schema / --documents
    {
        const raw = normalizeRaw(text);
        if (!schema) {
            const m = /(?:^|\s)(?:-s|--schema)(?:=|\s+)(?:"([^"]*)"|'([^']*)'|(\S+))/i.exec(raw);
            if (m)
                schema = (m[1] ?? m[2] ?? m[3])?.trim();
        }
        if (!documents) {
            const m = /(?:^|\s)(?:-d|--documents)(?:=|\s+)(?:"([^"]*)"|'([^']*)'|(\S+))/i.exec(raw);
            if (m)
                documents = (m[1] ?? m[2] ?? m[3])?.trim();
        }
    }
    const count = flattenPaths(schema).length + flattenPaths(documents).length;
    const result = { count };
    if (schema !== undefined)
        result.schema = schema;
    if (documents !== undefined)
        result.documents = documents;
    return result;
}
function collectScalarsFromMap(value, into) {
    const m = asMap(value);
    if (!m)
        return;
    for (const [k, v] of Object.entries(m)) {
        if (typeof v === "string")
            into[k] = v;
        else if (v && typeof v === "object" && !Array.isArray(v)) {
            // { input: string, output: string } style — stringify briefly
            const im = v;
            if (typeof im.output === "string")
                into[k] = im.output;
            else if (typeof im.input === "string")
                into[k] = im.input;
            else
                into[k] = JSON.stringify(v);
        }
        else if (v != null) {
            into[k] = String(v);
        }
    }
}
/**
 * Scalars from config.scalars / top-level scalars.
 */
export function listScalars(text) {
    const scalars = {};
    const data = parseBestConfig(text);
    if (data) {
        if ("scalars" in data)
            collectScalarsFromMap(data.scalars, scalars);
        const cfg = asMap(data.config);
        if (cfg && "scalars" in cfg)
            collectScalarsFromMap(cfg.scalars, scalars);
        // Also under generates.*.config.scalars
        const gens = asMap(data.generates);
        if (gens) {
            for (const spec of Object.values(gens)) {
                const sm = asMap(spec);
                if (!sm)
                    continue;
                if ("scalars" in sm)
                    collectScalarsFromMap(sm.scalars, scalars);
                const sc = asMap(sm.config);
                if (sc && "scalars" in sc)
                    collectScalarsFromMap(sc.scalars, scalars);
            }
        }
    }
    // Regex fallback for YAML scalars block
    if (Object.keys(scalars).length === 0) {
        const cleaned = normalizeRaw(text);
        const block = /(?:^|\n)\s*(?:config\s*:\s*\n(?:.*\n)*?\s*)?scalars\s*:\s*\n((?:\s+\S.*\n?)+)/i.exec(cleaned);
        if (block) {
            try {
                const parsed = yamlParse(`scalars:\n${block[1]}`);
                const m = asMap(parsed);
                if (m)
                    collectScalarsFromMap(m.scalars, scalars);
            }
            catch {
                const lineRe = /^\s+([A-Za-z_][\w.]*)\s*:\s*(?:"([^"]*)"|'([^']*)'|(\S+))\s*$/gm;
                let lm;
                while ((lm = lineRe.exec(block[1] ?? ""))) {
                    scalars[lm[1]] = lm[2] ?? lm[3] ?? lm[4] ?? "";
                }
            }
        }
        // TS: scalars: { DateTime: 'string', ... }
        if (Object.keys(scalars).length === 0) {
            const tsIdx = cleaned.search(/(?:^|[\s,{])scalars\s*:\s*\{/);
            if (tsIdx !== -1) {
                const brace = cleaned.indexOf("{", tsIdx);
                const blob = extractBalanced(cleaned, brace);
                if (blob) {
                    const parsed = tryParseJsObject(blob);
                    collectScalarsFromMap(parsed, scalars);
                }
            }
        }
    }
    return { scalars, count: Object.keys(scalars).length };
}
function hasCodegenSignal(raw) {
    return (/\b(?:graphql-codegen|@graphql-codegen\/cli)\b/i.test(raw) ||
        /\bgenerates\s*:/i.test(raw) ||
        /\bCodegenConfig\b/.test(raw) ||
        listPlugins(raw).count > 0 ||
        listDocuments(raw).count > 0 ||
        listScalars(raw).count > 0 ||
        /\b(?:schema|documents|plugins|scalars)\s*:/.test(raw));
}
/** Detect plaintext Authorization / headers secrets in schema config. */
function findPlaintextAuthHints(raw) {
    const hits = [];
    // headers: { Authorization: 'Bearer xxx' } or "Authorization": "..."
    const authRe = /(?:Authorization|X-API-Key|api[_-]?key|Bearer)\s*['"]?\s*[:=]\s*['"`]([^'"`]+)['"`]/gi;
    let m;
    while ((m = authRe.exec(raw))) {
        const val = m[1] ?? "";
        if (!val ||
            /^(true|false|null|\$\{|process\.env|ENV|<.*>|YOUR_|XXX|TODO|FIXME|changeme|Bearer\s*\$)/i.test(val)) {
            continue;
        }
        if (/^Bearer\s+/i.test(val) || val.length >= 8) {
            hits.push(`${m[0].split(/[:=]/)[0].trim()}=…`);
        }
    }
    // schema URL with access_token / api_key query params
    const urlRe = /https?:\/\/[^\s"'`]+(?:api[_-]?key|access[_-]?token|token)=([^\s&"'`]+)/gi;
    while ((m = urlRe.exec(raw))) {
        const val = m[1] ?? "";
        if (val && !/^\$|ENV|<.*>|YOUR_/i.test(val))
            hits.push("url-token=…");
    }
    return hits;
}
export function lintGraphqlCodegen(text) {
    const findings = [];
    const raw = text ?? "";
    if (!raw.trim()) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Source text is empty. Paste a GraphQL Code Generator config (`codegen.yml` / `codegen.ts`) or CLI line (e.g. `schema: schema.graphql` + `documents: src/**/*.graphql` + `generates:` with plugins).",
        });
        return findings;
    }
    const docs = listDocuments(raw);
    const plugs = listPlugins(raw);
    const scalars = listScalars(raw);
    const hasCli = hasCodegenSignal(raw);
    const schemaPaths = flattenPaths(docs.schema);
    const documentPaths = flattenPaths(docs.documents);
    if (!hasCli) {
        findings.push({
            severity: "warn",
            rule: "no_codegen_detected",
            advice: "No GraphQL Code Generator signals detected (`schema:`, `documents:`, `generates:`, `plugins:`, or `graphql-codegen` CLI). Confirm this is codegen config text.",
        });
    }
    // Missing schema tip
    if (hasCli &&
        schemaPaths.length === 0 &&
        (documentPaths.length > 0 || plugs.count > 0 || scalars.count > 0)) {
        findings.push({
            severity: "info",
            rule: "missing_schema_tip",
            advice: "Config/plugin signals found without a `schema` field in this text. Prefer an explicit schema path or URL so generation is reproducible (educational tip only; does not run codegen).",
        });
    }
    // No documents tip
    if (hasCli &&
        documentPaths.length === 0 &&
        (schemaPaths.length > 0 || plugs.count > 0)) {
        // client-preset / schema-only generates may omit documents — still tip
        const clientPreset = plugs.plugins.some((p) => p === "preset:client" || /client-preset/i.test(p));
        if (!clientPreset) {
            findings.push({
                severity: "info",
                rule: "no_documents_tip",
                advice: "No `documents` globs found in this text. Operation/fragment codegen usually needs `documents: 'src/**/*.{graphql,ts,tsx}'` (or similar). Schema-only emits can ignore this tip (educational tip only; does not run codegen).",
            });
        }
    }
    // Plaintext headers/auth tip
    const authHits = findPlaintextAuthHints(raw);
    if (authHits.length > 0) {
        findings.push({
            severity: "warn",
            rule: "plaintext_headers_auth_tip",
            advice: `Possible plaintext auth/header value(s) in codegen config (${authHits.slice(0, 3).join("; ")}${authHits.length > 3 ? "; …" : ""}). Prefer env vars (e.g. \`Authorization: Bearer \${process.env.API_TOKEN}\`) and keep secrets out of committed codegen.yml / codegen.ts (educational tip only; does not run codegen).`,
        });
    }
    // Remote schema without documents — light tip
    if (schemaPaths.some((s) => /^https?:\/\//i.test(s)) &&
        documentPaths.length === 0 &&
        !findings.some((f) => f.rule === "no_documents_tip")) {
        findings.push({
            severity: "info",
            rule: "remote_schema_tip",
            advice: "Remote HTTP(S) `schema` URL detected. Ensure CI can reach it (or commit an introspected SDL) so codegen stays reproducible offline (educational tip only; this tool never fetches).",
        });
    }
    // Absolute path tip
    const absPaths = [...schemaPaths, ...documentPaths].filter((s) => /^\/|^[A-Za-z]:[\\/]/.test(s));
    if (absPaths.length > 0) {
        findings.push({
            severity: "info",
            rule: "absolute_path_tip",
            advice: `Found absolute path(s) (${absPaths.slice(0, 3).join("; ")}${absPaths.length > 3 ? "; …" : ""}). Prefer workspace-relative globs so the same codegen config works across machines (educational tip only).`,
        });
    }
    return findings;
}
