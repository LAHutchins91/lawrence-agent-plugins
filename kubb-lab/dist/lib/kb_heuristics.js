/**
 * Best-effort Kubb (kubb.config.ts/js/json/yaml) config heuristics.
 * Prefer JSON/YAML via `yaml`; best-effort for TS/JS object literals (no eval).
 * No @kubb/cli, no codegen runtime, no network, no filesystem follow.
 */
import { parse as yamlParse } from "yaml";
const KNOWN_PLUGIN_FNS = [
    "pluginOas",
    "pluginTs",
    "pluginReactQuery",
    "pluginSwr",
    "pluginZod",
    "pluginClient",
    "pluginFaker",
    "pluginRedoc",
    "pluginVueQuery",
    "pluginSolid",
    "pluginSvelteQuery",
];
function asMap(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value;
    }
    return null;
}
function pushUnique(arr, seen, v) {
    const s = v?.trim();
    if (!s || seen.has(s))
        return;
    seen.add(s);
    arr.push(s);
}
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
        if (ch === "/" && next === "/" && !(out.length > 0 && out[out.length - 1] === ":")) {
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
function jsObjectToJsonish(objSrc) {
    let s = objSrc.trim();
    s = s.replace(/'([^'\\]|\\.)*'/g, (m) => {
        const inner = m.slice(1, -1).replace(/\\'/g, "'").replace(/"/g, '\\"');
        return `"${inner}"`;
    });
    // Collapse bare function calls like pluginTs({ ... }) → "pluginTs"(…) not valid JSON;
    // replace pluginXxx({...}) / pluginXxx() with "pluginXxx" string for array parse
    s = s.replace(/\b(plugin[A-Za-z0-9]+|createSwagger(?:Client|TS|Zod|TanstackQuery|Faker|SWR)?)\s*\([^)]*\)/g, '"$1"');
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
function looksLikeKubbTs(text) {
    const t = text.trim();
    return (/\b@kubb\//i.test(t) ||
        /\bkubb\.config\b/i.test(t) ||
        /\bdefineConfig\s*\(/.test(t) ||
        /\bplugin(?:Oas|Ts|ReactQuery|Swr|Zod|Client|Faker)\b/.test(t) ||
        (/\bexport\s+default\b/.test(t) && /\b(?:input|output|plugins)\s*:/.test(t)) ||
        /\bmodule\.exports\b/.test(t));
}
function extractTsConfigObject(text) {
    const cleaned = stripJsComments(normalizeRaw(text));
    const defIdx = cleaned.search(/\bdefineConfig\s*\(/);
    if (defIdx !== -1) {
        const paren = cleaned.indexOf("(", defIdx);
        const objStart = cleaned.indexOf("{", paren);
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
    const patterns = [
        /\bexport\s+default\s+(?:defineConfig\s*\(\s*)?\{/,
        /\b(?:const|let|var)\s+\w+\s*(?::\s*\w+)?\s*(?:=\s*(?:defineConfig\s*\(\s*)?)?\{/,
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
    return null;
}
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
    out.push(raw.trim());
    return out;
}
function tryParseConfigDoc(text) {
    const raw = normalizeRaw(text).trim();
    if (!raw)
        return { data: null, format: "unknown" };
    if (raw.startsWith("{") || raw.startsWith("[")) {
        try {
            const data = JSON.parse(raw);
            const m = asMap(data);
            if (m)
                return { data: m, format: "json" };
        }
        catch {
            /* fall through */
        }
    }
    const looksTs = looksLikeKubbTs(raw) &&
        (/\bimport\s+/.test(raw) ||
            /\bexport\s+/.test(raw) ||
            /\bdefineConfig\b/.test(raw) ||
            /\bplugin[A-Z]/.test(raw));
    if (!looksTs) {
        try {
            const data = yamlParse(raw);
            const m = asMap(data);
            if (m)
                return { data: m, format: "yaml" };
        }
        catch {
            /* fall through */
        }
    }
    if (looksTs || looksLikeKubbTs(raw)) {
        const m = extractTsConfigObject(raw);
        if (m)
            return { data: m, format: "ts-heuristic" };
    }
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
function parseBestConfig(text) {
    let best = null;
    let bestScore = -1;
    for (const cand of extractConfigCandidates(text)) {
        const { data } = tryParseConfigDoc(cand);
        if (!data)
            continue;
        let score = 0;
        if ("input" in data)
            score += 3;
        if ("output" in data)
            score += 4;
        if ("plugins" in data)
            score += 4;
        if ("hooks" in data)
            score += 2;
        if ("root" in data)
            score += 1;
        if (score > bestScore) {
            bestScore = score;
            best = data;
        }
    }
    return best;
}
function extractPathFromOutput(value) {
    if (typeof value === "string" && value.trim())
        return value.trim();
    const m = asMap(value);
    if (m && typeof m.path === "string" && m.path.trim())
        return m.path.trim();
    return undefined;
}
function extractStringLiteral(src, label) {
    const re = new RegExp(`\\b${label}\\s*:\\s*(["'\`])((?:\\\\.|(?!\\1).)*)\\1`);
    const m = re.exec(src);
    return m?.[2]?.replace(/\\(.)/g, "$1").trim();
}
/**
 * List output paths: root output.path / output string, and per-plugin output.path.
 */
export function listOutputs(text) {
    const outputs = [];
    const seen = new Set();
    const push = (path, plugin) => {
        const p = path?.trim();
        if (!p && !plugin)
            return;
        const key = `${plugin ?? ""}|${p ?? ""}`;
        if (seen.has(key))
            return;
        seen.add(key);
        const entry = {};
        if (p)
            entry.path = p;
        if (plugin)
            entry.plugin = plugin;
        outputs.push(entry);
    };
    const data = parseBestConfig(text);
    if (data) {
        const rootOut = extractPathFromOutput(data.output);
        if (rootOut)
            push(rootOut);
        const plugins = data.plugins;
        if (Array.isArray(plugins)) {
            for (const item of plugins) {
                if (typeof item === "string")
                    continue;
                const pm = asMap(item);
                if (!pm)
                    continue;
                // After JS rewrite, plugin calls become strings; object form may keep name/output
                const name = (typeof pm.name === "string" && pm.name) ||
                    (typeof pm.plugin === "string" && pm.plugin) ||
                    undefined;
                const out = extractPathFromOutput(pm.output);
                if (out || name)
                    push(out, name);
            }
        }
        else {
            const pm = asMap(plugins);
            if (pm) {
                for (const [k, v] of Object.entries(pm)) {
                    const out = extractPathFromOutput(asMap(v)?.output ?? v);
                    if (out)
                        push(out, k);
                }
            }
        }
    }
    // Regex / TS heuristics always run to catch pluginXxx({ output: { path } })
    const cleaned = stripJsComments(normalizeRaw(text));
    // Root output: { path: '...' } or output: '...'
    {
        const outKey = /\boutput\s*:\s*\{/m.exec(cleaned);
        if (outKey && outKey.index !== undefined) {
            // Prefer the first top-level-ish output before plugins array when possible
            const open = cleaned.indexOf("{", outKey.index);
            const bal = extractBalanced(cleaned, open);
            if (bal) {
                const path = extractStringLiteral(bal, "path");
                if (path)
                    push(path);
            }
        }
        const short = /\boutput\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(cleaned);
        if (short)
            push(short[2]?.replace(/\\(.)/g, "$1"));
    }
    // pluginXxx({ ... output: { path: '...' } ... })
    const pluginCallRe = /\b(plugin[A-Za-z0-9]+|createSwagger(?:Client|TS|Zod|TanstackQuery|Faker|SWR)?)\s*\(/g;
    let m;
    while ((m = pluginCallRe.exec(cleaned))) {
        const pluginName = m[1];
        const paren = m.index + m[0].length - 1;
        // Find { after (
        let j = paren + 1;
        while (j < cleaned.length && /\s/.test(cleaned[j]))
            j++;
        if (cleaned[j] !== "{") {
            // pluginOas() with no options — no per-plugin output
            continue;
        }
        const bal = extractBalanced(cleaned, j);
        if (!bal)
            continue;
        // Look for output: { path } or output: 'path' inside plugin options
        const outObj = /\boutput\s*:\s*\{/.exec(bal);
        if (outObj && outObj.index !== undefined) {
            const oOpen = bal.indexOf("{", outObj.index);
            const oBal = extractBalanced(bal, oOpen);
            if (oBal) {
                const path = extractStringLiteral(oBal, "path");
                if (path)
                    push(path, pluginName);
            }
        }
        else {
            const shortOut = /\boutput\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(bal);
            if (shortOut) {
                push(shortOut[2]?.replace(/\\(.)/g, "$1"), pluginName);
            }
        }
    }
    return { outputs, count: outputs.length };
}
/**
 * Detect Kubb plugins referenced in config text.
 */
export function listPlugins(text) {
    const plugins = [];
    const seen = new Set();
    const cleaned = stripJsComments(normalizeRaw(text));
    // Known plugin function names
    for (const name of KNOWN_PLUGIN_FNS) {
        const re = new RegExp(`\\b${name}\\b`);
        if (re.test(cleaned))
            pushUnique(plugins, seen, name);
    }
    // createSwagger* legacy helpers
    const createRe = /\b(createSwagger(?:Client|TS|Zod|TanstackQuery|Faker|SWR)?)\b/g;
    let m;
    while ((m = createRe.exec(cleaned))) {
        pushUnique(plugins, seen, m[1]);
    }
    // @kubb/swagger-* and @kubb/plugin-* package imports / strings
    const pkgRe = /@kubb\/(?:swagger[\w-]*)|@kubb\/plugin-[\w-]+|@kubb\/react-query|@kubb\/swr|@kubb\/zod|@kubb\/faker|@kubb\/cli|@kubb\/core/gi;
    while ((m = pkgRe.exec(cleaned))) {
        pushUnique(plugins, seen, m[0]);
    }
    // String plugin names in arrays: 'plugin-oas', "swagger", etc.
    const strInArr = /(?:plugins\s*:\s*\[)([^\]]*)\]/gis;
    while ((m = strInArr.exec(cleaned))) {
        const inner = m[1] ?? "";
        const strRe = /(["'`])((?:\\.|(?!\1).)*)\1/g;
        let sm;
        while ((sm = strRe.exec(inner))) {
            const v = (sm[2] ?? "").replace(/\\(.)/g, "$1").trim();
            if (v &&
                (/plugin/i.test(v) ||
                    /swagger/i.test(v) ||
                    /kubb/i.test(v) ||
                    /^(oas|ts|zod|faker|client|swr|react-query)$/i.test(v))) {
                pushUnique(plugins, seen, v);
            }
        }
    }
    // Parsed config plugins array
    const data = parseBestConfig(text);
    if (data && Array.isArray(data.plugins)) {
        for (const item of data.plugins) {
            if (typeof item === "string" && item.trim()) {
                pushUnique(plugins, seen, item.trim());
            }
            else if (typeof item === "string") {
                /* skip */
            }
            else {
                const pm = asMap(item);
                if (!pm)
                    continue;
                if (typeof pm.name === "string")
                    pushUnique(plugins, seen, pm.name);
                // Keys that look like plugin names after rewrite
                for (const k of Object.keys(pm)) {
                    if (/^plugin[A-Z]/.test(k) || /^@kubb\//.test(k)) {
                        pushUnique(plugins, seen, k);
                    }
                }
            }
        }
    }
    // Import { pluginX } from '...'
    const importRe = /import\s*\{([^}]+)\}\s*from\s*(["'`])([^"'`]+)\2/g;
    while ((m = importRe.exec(cleaned))) {
        const names = (m[1] ?? "").split(",");
        for (const rawName of names) {
            const n = rawName
                .replace(/\bas\s+\w+/g, "")
                .trim()
                .split(/\s+/)
                .pop();
            if (n &&
                (/^plugin[A-Z]/.test(n) ||
                    /^createSwagger/.test(n) ||
                    n === "defineConfig")) {
                if (n !== "defineConfig")
                    pushUnique(plugins, seen, n);
            }
        }
        const from = m[3] ?? "";
        if (/@kubb\//.test(from) && from !== "@kubb/core") {
            pushUnique(plugins, seen, from);
        }
    }
    return { plugins, count: plugins.length };
}
/**
 * Extract hooks.done / hooks scripts / post-generate commands.
 */
export function listHooks(text) {
    const hooks = [];
    const seen = new Set();
    const push = (name, command) => {
        const n = name?.trim();
        const c = command?.trim();
        if (!n && !c)
            return;
        const key = `${n ?? ""}|${c ?? ""}`;
        if (seen.has(key))
            return;
        seen.add(key);
        const entry = {};
        if (n)
            entry.name = n;
        if (c)
            entry.command = c;
        hooks.push(entry);
    };
    const data = parseBestConfig(text);
    if (data) {
        const h = data.hooks;
        if (typeof h === "string" && h.trim()) {
            push("hooks", h.trim());
        }
        else {
            const hm = asMap(h);
            if (hm) {
                for (const [k, v] of Object.entries(hm)) {
                    if (typeof v === "string" && v.trim()) {
                        push(k, v.trim());
                    }
                    else if (Array.isArray(v)) {
                        for (const item of v) {
                            if (typeof item === "string" && item.trim())
                                push(k, item.trim());
                        }
                    }
                }
            }
        }
    }
    const cleaned = stripJsComments(normalizeRaw(text));
    // hooks: { done: '...' | ['...', ...] , ... }
    const hooksKey = /\bhooks\s*:\s*\{/m.exec(cleaned);
    if (hooksKey && hooksKey.index !== undefined) {
        const open = cleaned.indexOf("{", hooksKey.index);
        const bal = extractBalanced(cleaned, open);
        if (bal) {
            // done: 'cmd'
            const doneStr = /\b(done|pre|post|afterAll|beforeAll)\s*:\s*(["'`])((?:\\.|(?!\2).)*)\2/g;
            let dm;
            while ((dm = doneStr.exec(bal))) {
                push(dm[1], (dm[3] ?? "").replace(/\\(.)/g, "$1"));
            }
            // done: [ 'a', 'b' ]
            const doneArr = /\b(done|pre|post|afterAll|beforeAll)\s*:\s*\[([^\]]*)\]/g;
            while ((dm = doneArr.exec(bal))) {
                const name = dm[1];
                const inner = dm[2] ?? "";
                const strRe = /(["'`])((?:\\.|(?!\1).)*)\1/g;
                let sm;
                while ((sm = strRe.exec(inner))) {
                    push(name, (sm[2] ?? "").replace(/\\(.)/g, "$1"));
                }
            }
            // Any other key: 'command'
            const anyKey = /\b([A-Za-z_][\w]*)\s*:\s*(["'`])((?:\\.|(?!\2).)*)\2/g;
            while ((dm = anyKey.exec(bal))) {
                const name = dm[1];
                if (["path", "clean", "write", "barrelType", "format"].includes(name)) {
                    continue;
                }
                push(name, (dm[3] ?? "").replace(/\\(.)/g, "$1"));
            }
        }
    }
    // Top-level hooks.done shorthand in text
    const dotted = /\bhooks\s*\.\s*(done|pre|post)\s*=\s*(["'`])((?:\\.|(?!\2).)*)\2/g;
    let hm;
    while ((hm = dotted.exec(cleaned))) {
        push(hm[1], (hm[3] ?? "").replace(/\\(.)/g, "$1"));
    }
    return { hooks, count: hooks.length };
}
function hasKubbSignal(raw) {
    return (/\b(?:@kubb\/|kubb\.config|defineConfig)\b/i.test(raw) ||
        /\bplugin(?:Oas|Ts|ReactQuery|Swr|Zod|Client|Faker)\b/.test(raw) ||
        listPlugins(raw).count > 0 ||
        listOutputs(raw).count > 0 ||
        listHooks(raw).count > 0 ||
        /\b(?:input|output|plugins|hooks)\s*:/.test(raw));
}
function findInputPath(raw) {
    const data = parseBestConfig(raw);
    if (data) {
        const inp = data.input;
        if (typeof inp === "string" && inp.trim())
            return inp.trim();
        const im = asMap(inp);
        if (im && typeof im.path === "string" && im.path.trim())
            return im.path.trim();
    }
    const cleaned = stripJsComments(normalizeRaw(raw));
    // input: { path: '...' }
    const inpKey = /\binput\s*:\s*\{/m.exec(cleaned);
    if (inpKey && inpKey.index !== undefined) {
        const open = cleaned.indexOf("{", inpKey.index);
        const bal = extractBalanced(cleaned, open);
        if (bal) {
            const path = extractStringLiteral(bal, "path");
            if (path)
                return path;
        }
    }
    const short = /\binput\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/.exec(cleaned);
    if (short)
        return short[2]?.replace(/\\(.)/g, "$1");
    return undefined;
}
function findRootOutputPath(raw) {
    const outs = listOutputs(raw);
    // Prefer entry without plugin (root)
    const root = outs.outputs.find((o) => o.path && !o.plugin);
    if (root?.path)
        return root.path;
    return outs.outputs.find((o) => o.path)?.path;
}
function findPlaintextAuthHints(raw) {
    const hits = [];
    const authRe = /(?:Authorization|X-API-Key|api[_-]?key|apiKey|Bearer)\s*['"]?\s*[:=]\s*['"`]([^'"`]+)['"`]/gi;
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
    return hits;
}
export function lintKubb(text) {
    const findings = [];
    const raw = text ?? "";
    if (!raw.trim()) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Source text is empty. Paste a Kubb config (`kubb.config.ts` / `.js` / `.json`) with `input.path`, `output.path`, and `plugins` (e.g. pluginOas, pluginTs).",
        });
        return findings;
    }
    const hasSignal = hasKubbSignal(raw);
    const inputPath = findInputPath(raw);
    const outputPath = findRootOutputPath(raw);
    const plugs = listPlugins(raw);
    if (!hasSignal) {
        findings.push({
            severity: "warn",
            rule: "no_kubb_detected",
            advice: "No Kubb config signals detected (`input:`, `output:`, `plugins:`, `pluginOas` / `pluginTs`, `@kubb/*`, or `defineConfig`). Confirm this is kubb.config text.",
        });
    }
    if (hasSignal && !inputPath) {
        findings.push({
            severity: "info",
            rule: "missing_input_path_tip",
            advice: "Kubb signals found without an `input.path` (or string `input`) in this text. Prefer an explicit OpenAPI/Swagger path so generation is reproducible (educational tip only; does not run Kubb).",
        });
    }
    if (hasSignal && !outputPath && plugs.count > 0) {
        findings.push({
            severity: "info",
            rule: "missing_output_path_tip",
            advice: "Plugins found without a root `output.path` in this text. Prefer an explicit generated output folder (educational tip only; does not run Kubb).",
        });
    }
    // Remote OpenAPI URL tip
    if (inputPath && /^https?:\/\//i.test(inputPath)) {
        findings.push({
            severity: "info",
            rule: "remote_openapi_url_tip",
            advice: "Remote HTTP(S) `input.path` URL detected. Ensure CI can reach it (or commit a local OpenAPI file) so Kubb stays reproducible offline (educational tip only; this tool never fetches).",
        });
    }
    else if (/\binput[\s\S]{0,200}\bpath\s*:\s*['"`]https?:\/\//i.test(raw) ||
        /\binput\s*:\s*['"`]https?:\/\//i.test(raw)) {
        findings.push({
            severity: "info",
            rule: "remote_openapi_url_tip",
            advice: "Remote HTTP(S) OpenAPI URL detected in input. Prefer a local committed spec when possible (educational tip only; this tool never fetches).",
        });
    }
    // Hardcoded apiKey / Authorization
    const authHits = findPlaintextAuthHints(raw);
    if (authHits.length > 0) {
        findings.push({
            severity: "warn",
            rule: "hardcoded_apikey_auth_tip",
            advice: `Possible plaintext apiKey/Authorization value(s) in kubb.config (${authHits.slice(0, 3).join("; ")}${authHits.length > 3 ? "; …" : ""}). Prefer env vars (e.g. \`process.env.API_TOKEN\`) and keep secrets out of committed config (educational tip only; does not run Kubb).`,
        });
    }
    // Absolute output path tip
    const absOutputs = listOutputs(raw).outputs
        .map((o) => o.path)
        .filter((p) => !!p && /^\/|^[A-Za-z]:[\\/]/.test(p));
    if (absOutputs.length > 0) {
        findings.push({
            severity: "info",
            rule: "absolute_output_path_tip",
            advice: `Found absolute output path(s) (${absOutputs.slice(0, 3).join("; ")}${absOutputs.length > 3 ? "; …" : ""}). Prefer workspace-relative paths so the same kubb.config works across machines (educational tip only).`,
        });
    }
    return findings;
}
