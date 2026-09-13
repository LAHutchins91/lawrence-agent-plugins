/**
 * Best-effort swagger-codegen / openapi-generator CLI text heuristics.
 * No codegen runtime, no network, no filesystem follow, no eval.
 * Optional light JSON/YAML parse for pasted config documents in `text`.
 */
import { parse as yamlParse } from "yaml";
/** Strip BOM, normalize newlines, drop # / // comments (quote-aware; keep ://). */
export function stripComments(raw) {
    const src = (raw ?? "").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
    let out = "";
    let i = 0;
    const n = src.length;
    let inSingle = false;
    let inDouble = false;
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
            if (ch === "\\") {
                escape = true;
                out += ch;
                i++;
                continue;
            }
            if (ch === "'")
                inSingle = false;
            out += ch;
            i++;
            continue;
        }
        if (inDouble) {
            if (ch === "\\") {
                escape = true;
                out += ch;
                i++;
                continue;
            }
            if (ch === '"')
                inDouble = false;
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
        // // comments, but not URL scheme ://
        if (ch === "/" && next === "/" && out[out.length - 1] !== ":") {
            i += 2;
            while (i < n && src[i] !== "\n")
                i++;
            continue;
        }
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
function joinContinuations(raw) {
    return (raw ?? "").replace(/\\[ \t]*\n/g, " ");
}
/** Match swagger-codegen / openapi-generator style invocations (incl. jar / npx). */
const INVOCATION_RE = /(^|[;&|]\s*)((?:[\w./~-]*\/)?(?:swagger-codegen(?:-cli)?|openapi-generator(?:-cli)?)(?:\.exe)?|(?:npx\s+(?:--yes\s+)?@openapitools\/openapi-generator-cli)|(?:java\s+(?:-jar\s+)?[\w./~-]*(?:swagger-codegen|openapi-generator)[\w./~-]*\.jar))\b(.*)$/i;
const BOOL_FLAGS = new Set([
    "--help",
    "-h",
    "--version",
    "--verbose",
    "-v",
    "--skip-validate-spec",
    "--enable-post-process-file",
    "--generate-alias-as-model",
    "--legacy-discriminator-behavior",
    "--strict-spec",
]);
const VALUE_FLAGS = new Set([
    "-l",
    "--lang",
    "-g",
    "--generator-name",
    "-i",
    "--input-spec",
    "--spec",
    "-o",
    "--output",
    "-c",
    "--config",
    "-t",
    "--template-dir",
    "--library",
    "-p",
    "--additional-properties",
    "--api-package",
    "--model-package",
    "--invoker-package",
    "--package-name",
    "--group-id",
    "--artifact-id",
    "--artifact-version",
    "--git-user-id",
    "--git-repo-id",
    "--release-note",
    "--http-user-agent",
    "--ignore-file-override",
    "--type-mappings",
    "--import-mappings",
    "--language-specific-primitives",
    "--reserved-words-mappings",
    "--name-mappings",
    "--parameter-name-mappings",
    "--model-name-mappings",
    "--model-name-prefix",
    "--model-name-suffix",
    "--server-variables",
    "--auth",
    "--global-property",
    "--engine",
]);
function tokenizeArgs(args) {
    const tokens = [];
    const re = /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'|[^\s]+/g;
    let m;
    while ((m = re.exec(args))) {
        const raw = m[0];
        if ((raw.startsWith('"') && raw.endsWith('"')) ||
            (raw.startsWith("'") && raw.endsWith("'"))) {
            tokens.push(raw.slice(1, -1));
        }
        else {
            tokens.push(raw);
        }
    }
    return tokens;
}
function parseInvocationArgs(args) {
    const tokens = tokenizeArgs(args);
    const flags = [];
    const positionals = [];
    for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        // -Dkey=value (swagger-codegen system properties / additional props style)
        if (/^-D[\w.-]+=/.test(tok)) {
            flags.push({ flag: "-D", value: tok.slice(2) });
            continue;
        }
        if (tok === "-D") {
            const nxt = tokens[i + 1];
            if (nxt !== undefined && !nxt.startsWith("-")) {
                flags.push({ flag: "-D", value: nxt });
                i++;
            }
            else {
                flags.push({ flag: "-D" });
            }
            continue;
        }
        // Glued short flags: -ljava, -ijson.yaml, -cconfig.json, -ttemplates
        if (/^-[ligcotp][^=].+/.test(tok) && !tok.startsWith("--") && tok.length > 2) {
            const flag = tok.slice(0, 2);
            let value = tok.slice(2);
            if (value.startsWith("="))
                value = value.slice(1);
            if (VALUE_FLAGS.has(flag)) {
                flags.push({ flag, value });
                continue;
            }
        }
        if (tok.startsWith("--") || (tok.startsWith("-") && tok.length > 1)) {
            const eq = tok.indexOf("=");
            const rawFlag = eq === -1 ? tok : tok.slice(0, eq);
            let value = eq === -1 ? undefined : tok.slice(eq + 1);
            const isBool = BOOL_FLAGS.has(rawFlag);
            const needsValue = VALUE_FLAGS.has(rawFlag) || rawFlag === "-D";
            if (!isBool && value === undefined && (needsValue || !isBool)) {
                // For unknown --flags, still try to take next non-flag token if present
                const nxt = tokens[i + 1];
                if (nxt !== undefined && !nxt.startsWith("-")) {
                    // Only consume next token for known value flags, or for short -X that needs value
                    if (needsValue || VALUE_FLAGS.has(rawFlag)) {
                        value = nxt;
                        i++;
                    }
                    else if (rawFlag === "-i" ||
                        rawFlag === "-o" ||
                        rawFlag === "-c" ||
                        rawFlag === "-t" ||
                        rawFlag === "-l" ||
                        rawFlag === "-g" ||
                        rawFlag === "-p") {
                        value = nxt;
                        i++;
                    }
                }
            }
            flags.push(value !== undefined ? { flag: rawFlag, value } : { flag: rawFlag });
            continue;
        }
        // Skip known subcommands
        if (/^(generate|config-help|list|meta|version|help|author|validate)$/i.test(tok)) {
            continue;
        }
        positionals.push(tok);
    }
    return { flags, positionals };
}
function detectBinaryHint(line) {
    if (/swagger-codegen/i.test(line))
        return "swagger-codegen";
    if (/openapi-generator/i.test(line))
        return "openapi-generator";
    return "";
}
function parseAllInvocations(text) {
    const raw = joinContinuations((text ?? "").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n"));
    const out = [];
    for (const line of raw.split("\n")) {
        const cleanedLine = line.replace(/(^|\s)#.*$/, "$1");
        const inv = cleanedLine.match(INVOCATION_RE);
        if (inv) {
            const parsed = parseInvocationArgs(inv[3] ?? "");
            out.push({
                binary: detectBinaryHint(inv[2] ?? cleanedLine) || detectBinaryHint(cleanedLine),
                flags: parsed.flags,
                positionals: parsed.positionals,
            });
        }
    }
    // Fallback: whole text if generator CLI mentioned but no line matched
    if (out.length === 0 &&
        /\b(?:swagger-codegen|openapi-generator)(?:-cli)?(?:\.exe)?\b/i.test(raw)) {
        const cleaned = stripComments(raw).replace(/\b(?:npx\s+(?:--yes\s+)?@openapitools\/)?(?:swagger-codegen|openapi-generator)(?:-cli)?(?:\.exe)?\b/gi, " ");
        const parsed = parseInvocationArgs(cleaned);
        out.push({
            binary: detectBinaryHint(raw),
            flags: parsed.flags,
            positionals: parsed.positionals,
        });
    }
    // Accept pastes that are just flags without the binary name
    if (out.length === 0 &&
        /(?:^|\s)(-l|--lang|-g|--generator-name|-i|--input-spec|-c|--config|-t|--template-dir|-p|--additional-properties|--library)\b/.test(raw)) {
        const cleaned = stripComments(raw);
        const parsed = parseInvocationArgs(cleaned);
        out.push({
            binary: detectBinaryHint(raw),
            flags: parsed.flags,
            positionals: parsed.positionals,
        });
    }
    return out;
}
function pushUnique(arr, seen, v) {
    const s = v?.trim();
    if (!s || seen.has(s))
        return;
    seen.add(s);
    arr.push(s);
}
/**
 * Languages from -l/--lang; generators from -g/--generator-name.
 * `languages` also includes generator names for a unified inventory.
 * `count` = languages.length.
 */
export function listLanguages(text) {
    const languages = [];
    const generators = [];
    const seenLang = new Set();
    const seenGen = new Set();
    const invs = parseAllInvocations(text);
    for (const inv of invs) {
        for (const f of inv.flags) {
            if (f.flag === "-l" || f.flag === "--lang") {
                pushUnique(languages, seenLang, f.value);
            }
            if (f.flag === "-g" || f.flag === "--generator-name") {
                pushUnique(generators, seenGen, f.value);
                pushUnique(languages, seenLang, f.value);
            }
        }
    }
    // Regex fallback
    if (languages.length === 0) {
        const cleaned = stripComments(text ?? "");
        const langRe = /(?:^|\s)(-l|--lang)(?:=|\s+)(?:"([^"]*)"|'([^']*)'|(\S+))/gi;
        let m;
        while ((m = langRe.exec(cleaned))) {
            pushUnique(languages, seenLang, m[2] ?? m[3] ?? m[4]);
        }
        const genRe = /(?:^|\s)(-g|--generator-name)(?:=|\s+)(?:"([^"]*)"|'([^']*)'|(\S+))/gi;
        while ((m = genRe.exec(cleaned))) {
            const v = m[2] ?? m[3] ?? m[4];
            pushUnique(generators, seenGen, v);
            pushUnique(languages, seenLang, v);
        }
        // glued -ljava / -gjava
        const gluedL = /(?:^|\s)-l([A-Za-z][\w.-]*)/g;
        while ((m = gluedL.exec(cleaned))) {
            pushUnique(languages, seenLang, m[1]);
        }
        const gluedG = /(?:^|\s)-g([A-Za-z][\w.-]*)/g;
        while ((m = gluedG.exec(cleaned))) {
            pushUnique(generators, seenGen, m[1]);
            pushUnique(languages, seenLang, m[1]);
        }
    }
    const result = {
        languages,
        count: languages.length,
    };
    if (generators.length > 0)
        result.generators = generators;
    return result;
}
function tryParseConfigKeys(blob) {
    const trimmed = blob.trim();
    if (!trimmed || trimmed.length > 512_000)
        return undefined;
    // Prefer JSON
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
        try {
            const data = JSON.parse(trimmed);
            if (data && typeof data === "object" && !Array.isArray(data)) {
                return Object.keys(data);
            }
        }
        catch {
            // fall through to yaml
        }
    }
    try {
        const data = yamlParse(trimmed);
        if (data && typeof data === "object" && !Array.isArray(data)) {
            return Object.keys(data);
        }
    }
    catch {
        return undefined;
    }
    return undefined;
}
/** Extract inline JSON/YAML config documents pasted alongside CLI text. */
function extractInlineConfigBlobs(text) {
    const out = [];
    const raw = text ?? "";
    // Fenced ```json / ```yaml blocks
    const fenceRe = /```(?:json|ya?ml)?\s*\n([\s\S]*?)```/gi;
    let m;
    while ((m = fenceRe.exec(raw))) {
        const keys = tryParseConfigKeys(m[1] ?? "");
        if (keys && keys.length > 0)
            out.push({ keys });
    }
    // Bare JSON object somewhere in the paste (best-effort balanced braces)
    if (out.length === 0) {
        const start = raw.indexOf("{");
        if (start !== -1) {
            let depth = 0;
            let end = -1;
            for (let i = start; i < raw.length; i++) {
                const ch = raw[i];
                if (ch === "{")
                    depth++;
                else if (ch === "}") {
                    depth--;
                    if (depth === 0) {
                        end = i;
                        break;
                    }
                }
            }
            if (end > start) {
                const keys = tryParseConfigKeys(raw.slice(start, end + 1));
                if (keys && keys.length > 0)
                    out.push({ keys });
            }
        }
    }
    return out;
}
function parseAdditionalProperties(raw) {
    const result = {};
    if (!raw)
        return result;
    // comma-separated key=value (openapi-generator -p)
    const parts = raw.split(",");
    for (const part of parts) {
        const p = part.trim();
        if (!p)
            continue;
        const eq = p.indexOf("=");
        if (eq === -1) {
            result[p] = "true";
        }
        else {
            const k = p.slice(0, eq).trim();
            const v = p.slice(eq + 1).trim();
            if (k)
                result[k] = v;
        }
    }
    return result;
}
/**
 * Config paths from -c/--config; additionalProperties from -p/--additional-properties / -D.
 * Optional light JSON/YAML key extraction when a config document is pasted inline.
 */
export function listConfigs(text) {
    const configs = [];
    const seenPath = new Set();
    const additionalProperties = {};
    const pushConfig = (path, keys) => {
        const p = path?.trim();
        if (p) {
            if (seenPath.has(p)) {
                // merge keys if we later learn them
                if (keys && keys.length) {
                    const existing = configs.find((c) => c.path === p);
                    if (existing && !existing.keys)
                        existing.keys = keys;
                }
                return;
            }
            seenPath.add(p);
            const entry = { path: p };
            if (keys && keys.length)
                entry.keys = keys;
            configs.push(entry);
        }
        else if (keys && keys.length) {
            configs.push({ keys });
        }
    };
    const invs = parseAllInvocations(text);
    for (const inv of invs) {
        for (const f of inv.flags) {
            if (f.flag === "-c" || f.flag === "--config") {
                pushConfig(f.value);
            }
            if (f.flag === "-p" || f.flag === "--additional-properties") {
                Object.assign(additionalProperties, parseAdditionalProperties(f.value));
            }
            if (f.flag === "-D" && f.value) {
                Object.assign(additionalProperties, parseAdditionalProperties(f.value));
            }
        }
    }
    // Regex fallback for -c/--config
    if (configs.length === 0) {
        const cleaned = stripComments(text ?? "");
        const re = /(?:^|\s)(-c|--config)(?:=|\s+)(?:"([^"]*)"|'([^']*)'|(\S+))/gi;
        let m;
        while ((m = re.exec(cleaned))) {
            pushConfig(m[2] ?? m[3] ?? m[4]);
        }
    }
    // Regex fallback for -p / --additional-properties
    if (Object.keys(additionalProperties).length === 0) {
        const cleaned = stripComments(text ?? "");
        const re = /(?:^|\s)(-p|--additional-properties)(?:=|\s+)(?:"([^"]*)"|'([^']*)'|(\S+))/gi;
        let m;
        while ((m = re.exec(cleaned))) {
            Object.assign(additionalProperties, parseAdditionalProperties(m[2] ?? m[3] ?? m[4]));
        }
    }
    // Inline pasted config documents → keys
    const inline = extractInlineConfigBlobs(text ?? "");
    for (const blob of inline) {
        if (configs.length === 0) {
            configs.push(blob);
        }
        else if (blob.keys) {
            // Attach keys to first config that has a path but no keys
            const target = configs.find((c) => c.path && !c.keys) ?? configs[0];
            if (target && !target.keys)
                target.keys = blob.keys;
            else if (!configs.some((c) => !c.path && c.keys))
                configs.push(blob);
        }
    }
    const result = {
        configs,
        count: configs.length,
    };
    if (Object.keys(additionalProperties).length > 0) {
        result.additionalProperties = additionalProperties;
    }
    return result;
}
/**
 * Templates from -t/--template-dir; library from --library.
 */
export function listTemplates(text) {
    const templates = [];
    const seen = new Set();
    let library;
    const push = (path) => {
        const p = path?.trim();
        if (!p || seen.has(p))
            return;
        seen.add(p);
        templates.push({ path: p });
    };
    const invs = parseAllInvocations(text);
    for (const inv of invs) {
        for (const f of inv.flags) {
            if (f.flag === "-t" || f.flag === "--template-dir") {
                push(f.value);
            }
            if (f.flag === "--library" && f.value) {
                library = f.value.trim();
            }
        }
    }
    // Regex fallback
    if (templates.length === 0 || library === undefined) {
        const cleaned = stripComments(text ?? "");
        if (templates.length === 0) {
            const re = /(?:^|\s)(-t|--template-dir)(?:=|\s+)(?:"([^"]*)"|'([^']*)'|(\S+))/gi;
            let m;
            while ((m = re.exec(cleaned))) {
                push(m[2] ?? m[3] ?? m[4]);
            }
        }
        if (library === undefined) {
            const libRe = /(?:^|\s)--library(?:=|\s+)(?:"([^"]*)"|'([^']*)'|(\S+))/gi;
            const m = libRe.exec(cleaned);
            if (m)
                library = (m[1] ?? m[2] ?? m[3])?.trim();
        }
    }
    const result = {
        templates,
        count: templates.length,
    };
    if (library)
        result.library = library;
    return result;
}
function listInputSpecs(text) {
    const specs = [];
    const seen = new Set();
    const invs = parseAllInvocations(text);
    for (const inv of invs) {
        for (const f of inv.flags) {
            if (f.flag === "-i" ||
                f.flag === "--input-spec" ||
                f.flag === "--spec") {
                pushUnique(specs, seen, f.value);
            }
        }
    }
    if (specs.length === 0) {
        const cleaned = stripComments(text ?? "");
        const re = /(?:^|\s)(-i|--input-spec|--spec)(?:=|\s+)(?:"([^"]*)"|'([^']*)'|(\S+))/gi;
        let m;
        while ((m = re.exec(cleaned))) {
            pushUnique(specs, seen, m[2] ?? m[3] ?? m[4]);
        }
    }
    return specs;
}
function hasCodegenSignal(raw) {
    return (/\b(?:swagger-codegen|openapi-generator)(?:-cli)?(?:\.exe)?\b/i.test(raw) ||
        /@openapitools\/openapi-generator-cli/i.test(raw) ||
        listLanguages(raw).count > 0 ||
        listConfigs(raw).count > 0 ||
        listTemplates(raw).count > 0 ||
        listInputSpecs(raw).length > 0 ||
        /(?:-l|--lang|-g|--generator-name|-i|--input-spec|-c|--config|-t|--template-dir|-p|--additional-properties|--library)\b/.test(raw));
}
function detectToolFamily(raw) {
    const hasSwagger = /\bswagger-codegen(?:-cli)?(?:\.exe)?\b/i.test(raw);
    const hasOpenapi = /\bopenapi-generator(?:-cli)?(?:\.exe)?\b/i.test(raw) ||
        /@openapitools\/openapi-generator-cli/i.test(raw);
    if (hasSwagger && hasOpenapi)
        return "mixed";
    if (hasSwagger)
        return "swagger-codegen";
    if (hasOpenapi)
        return "openapi-generator";
    return "unknown";
}
/** Hardcoded apiKey / Authorization secret-like literals in CLI text. */
function findHardcodedApiKeyHints(raw) {
    const hits = [];
    // -p apiKey=SECRET or additionalProperties with apiKey=
    const propRe = /(?:^|[\s,])((?:api[_-]?key|apiKey|access[_-]?token|auth(?:orization)?|bearer|secret))\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s,]+))/gi;
    let m;
    while ((m = propRe.exec(raw))) {
        const val = m[2] ?? m[3] ?? m[4] ?? "";
        // Skip placeholders
        if (!val || /^(true|false|null|undefined|\$\{|ENV|PROCESS|<.*>|YOUR_|XXX|TODO|FIXME|changeme)$/i.test(val)) {
            continue;
        }
        // Likely hardcoded if looks like a secret (length / charset)
        if (val.length >= 8 || /sk[-_]|key[-_]|Bearer\s+/i.test(val)) {
            hits.push(`${m[1]}=…`);
        }
        else if (!/^\$/.test(val) && val.length >= 4) {
            hits.push(`${m[1]}=…`);
        }
    }
    // --auth api_key:VALUE style
    const authRe = /(?:^|\s)--auth(?:=|\s+)(?:"([^"]*)"|'([^']*)'|(\S+))/gi;
    while ((m = authRe.exec(raw))) {
        const spec = m[1] ?? m[2] ?? m[3] ?? "";
        if (/api[_-]?key\s*[:=]/i.test(spec) && !/\$\{|ENV|<.*>|YOUR_/i.test(spec)) {
            hits.push("--auth apiKey=…");
        }
    }
    return hits;
}
export function lintSwaggerCodegen(text) {
    const findings = [];
    const raw = text ?? "";
    if (!raw.trim()) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Source text is empty. Paste a swagger-codegen / openapi-generator CLI line (e.g. `openapi-generator-cli generate -g java -i openapi.yaml -o out` or `swagger-codegen generate -l python -i swagger.json -o out`).",
        });
        return findings;
    }
    const { languages, generators } = listLanguages(raw);
    const specs = listInputSpecs(raw);
    const { configs, additionalProperties } = listConfigs(raw);
    const { templates, library } = listTemplates(raw);
    const family = detectToolFamily(raw);
    const hasCli = hasCodegenSignal(raw);
    if (!hasCli) {
        findings.push({
            severity: "warn",
            rule: "no_codegen_detected",
            advice: "No swagger-codegen / openapi-generator signals detected (`-g java`, `-l python`, `-i openapi.yaml`, `-c config.json`, etc.). Confirm this is generator CLI text.",
        });
    }
    // Missing -i / --input-spec
    if (hasCli &&
        specs.length === 0 &&
        (languages.length > 0 ||
            family !== "unknown" ||
            configs.length > 0 ||
            templates.length > 0)) {
        findings.push({
            severity: "info",
            rule: "missing_input_spec_tip",
            advice: "Generator flags found without `-i` / `--input-spec` in this text. Prefer an explicit OpenAPI/Swagger document path so generation is reproducible (educational tip only; does not run codegen).",
        });
    }
    // Missing -g / -l
    if (hasCli &&
        languages.length === 0 &&
        (specs.length > 0 ||
            family !== "unknown" ||
            configs.length > 0 ||
            templates.length > 0)) {
        findings.push({
            severity: "info",
            rule: "missing_generator_tip",
            advice: "Input/config flags found without `-g` / `--generator-name` (openapi-generator) or `-l` / `--lang` (swagger-codegen) in this text. Add a generator/language so the CLI knows what to emit (info only; does not run codegen).",
        });
    }
    // swagger-codegen vs openapi-generator tip
    if (family === "swagger-codegen") {
        const advice = /\b(?:-g|--generator-name)\b/.test(raw)
            ? "swagger-codegen CLI with `-g` / `--generator-name` detected — classic swagger-codegen expects `-l` / `--lang`. Prefer migrating to **openapi-generator** (`-g/--generator-name`) for OpenAPI 3.x (educational tip only)."
            : "This paste uses **swagger-codegen**. Prefer **openapi-generator** (`openapi-generator-cli generate -g …`) for active OpenAPI 3.x support; swagger-codegen is largely legacy. Flag mapping: `-l/--lang` → `-g/--generator-name` (educational tip only).";
        findings.push({
            severity: "info",
            rule: "swagger_vs_openapi_tip",
            advice,
        });
    }
    else if (family === "mixed") {
        findings.push({
            severity: "warn",
            rule: "swagger_vs_openapi_tip",
            advice: "Both swagger-codegen and openapi-generator appear in this text. Keep one toolchain — flag sets differ (`-l` vs `-g`) and mixing them is a common source of confusion (educational tip only).",
        });
    }
    else if (family === "openapi-generator" && /\b(?:-l|--lang)\b/.test(raw) && !/\b(?:-g|--generator-name)\b/.test(raw)) {
        findings.push({
            severity: "info",
            rule: "swagger_vs_openapi_tip",
            advice: "openapi-generator CLI with `-l` / `--lang` detected — openapi-generator expects `-g` / `--generator-name`. `-l` is the swagger-codegen flag (educational tip only).",
        });
    }
    // Hardcoded apiKey tip
    const apiHits = findHardcodedApiKeyHints(raw);
    // Also check additionalProperties values
    if (additionalProperties) {
        for (const [k, v] of Object.entries(additionalProperties)) {
            if (/api[_-]?key|token|secret|password|auth/i.test(k) && v && !/^\$|ENV|<.*>|YOUR_|true|false$/i.test(v) && v.length >= 4) {
                if (!apiHits.some((h) => h.startsWith(k)))
                    apiHits.push(`${k}=…`);
            }
        }
    }
    if (apiHits.length > 0) {
        findings.push({
            severity: "warn",
            rule: "hardcoded_apikey_tip",
            advice: `Possible hardcoded credential-like value(s) in generator CLI / additionalProperties (${apiHits.slice(0, 3).join("; ")}${apiHits.length > 3 ? "; …" : ""}). Prefer env vars or a local untracked config — never commit API keys into scripts (educational tip only; does not run codegen).`,
        });
    }
    // Absolute path tip (light)
    const absPaths = [];
    for (const s of specs) {
        if (/^\/|^[A-Za-z]:[\\/]/.test(s))
            absPaths.push(`-i ${s}`);
    }
    for (const c of configs) {
        if (c.path && /^\/|^[A-Za-z]:[\\/]/.test(c.path))
            absPaths.push(`-c ${c.path}`);
    }
    for (const t of templates) {
        if (t.path && /^\/|^[A-Za-z]:[\\/]/.test(t.path))
            absPaths.push(`-t ${t.path}`);
    }
    if (absPaths.length > 0) {
        findings.push({
            severity: "info",
            rule: "absolute_path_tip",
            advice: `Found absolute path(s) (${absPaths.slice(0, 3).join("; ")}${absPaths.length > 3 ? "; …" : ""}). Prefer workspace-relative paths so the same generate line works across machines (educational tip only).`,
        });
    }
    // Quiet reference so unused bindings stay meaningful for future rules
    void library;
    void generators;
    return findings;
}
