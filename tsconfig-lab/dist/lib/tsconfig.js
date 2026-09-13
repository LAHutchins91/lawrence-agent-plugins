/**
 * Shared tsconfig.json / JSONC text helpers.
 * String analysis only — strip comments, parse JSON; no tsc exec, no FS.
 */
export function asMap(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value;
    }
    return null;
}
/**
 * Strip // line comments and block comments from JSONC-ish text,
 * respecting double-quoted strings (escape-aware).
 */
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
        // line comment
        if (ch === "/" && next === "/") {
            i += 2;
            while (i < n && src[i] !== "\n" && src[i] !== "\r")
                i++;
            continue;
        }
        // block comment
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
export function parseTsconfigText(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed) {
        return { raw: null };
    }
    const stripped = stripJsonComments(trimmed);
    try {
        const raw = JSON.parse(stripped);
        const map = asMap(raw);
        if (!map) {
            return {
                raw: null,
                parseError: "tsconfig root must be a JSON object",
            };
        }
        return { raw: map };
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { raw: null, parseError: msg };
    }
}
export function compilerOptionsMap(raw) {
    if (!raw)
        return {};
    return asMap(raw.compilerOptions) ?? {};
}
/**
 * Normalize paths map values to string[].
 */
export function normalizePaths(value) {
    const map = asMap(value);
    if (!map)
        return {};
    const out = {};
    for (const [alias, targets] of Object.entries(map)) {
        if (Array.isArray(targets)) {
            out[alias] = targets.map((t) => String(t));
        }
        else if (typeof targets === "string") {
            out[alias] = [targets];
        }
        else if (targets !== undefined && targets !== null) {
            out[alias] = [String(targets)];
        }
    }
    return out;
}
/**
 * Report extends as declared string | string[] | null; chain = flattened declared refs.
 * Does NOT fetch or read files.
 */
export function parseExtends(raw) {
    if (!raw || !("extends" in raw)) {
        return { extends: null, chain: [] };
    }
    const v = raw.extends;
    if (v === null || v === undefined) {
        return { extends: null, chain: [] };
    }
    if (typeof v === "string") {
        const s = v.trim();
        if (!s)
            return { extends: null, chain: [] };
        return { extends: s, chain: [s] };
    }
    if (Array.isArray(v)) {
        const arr = v
            .filter((x) => typeof x === "string")
            .map((x) => x.trim())
            .filter((x) => x !== "");
        if (arr.length === 0)
            return { extends: [], chain: [] };
        return { extends: arr, chain: [...arr] };
    }
    // unexpected type — stringify for visibility
    const s = String(v);
    return { extends: s, chain: [s] };
}
export function lintTsconfig(raw, parseError) {
    const findings = [];
    if (parseError) {
        findings.push({
            severity: "error",
            rule: "invalid_json",
            advice: `Could not parse tsconfig (after comment strip): ${parseError}`,
        });
        return findings;
    }
    if (!raw) {
        findings.push({
            severity: "info",
            rule: "empty_input",
            advice: "No tsconfig content provided.",
        });
        return findings;
    }
    const co = compilerOptionsMap(raw);
    const hasCo = Object.keys(co).length > 0 || asMap(raw.compilerOptions) !== null;
    if (!hasCo && !("extends" in raw) && !("files" in raw) && !("include" in raw)) {
        findings.push({
            severity: "info",
            rule: "sparse_tsconfig",
            advice: "No compilerOptions, extends, files, or include — unusual empty-ish tsconfig.",
        });
    }
    // strict false
    if (co.strict === false) {
        findings.push({
            severity: "warn",
            rule: "strict_false",
            advice: "`compilerOptions.strict` is false — consider enabling for stronger type checking.",
        });
    }
    // skipLibCheck without note
    if (co.skipLibCheck === true) {
        findings.push({
            severity: "info",
            rule: "skip_lib_check",
            advice: "`skipLibCheck: true` skips type checking of declaration files — fine for speed, but hides .d.ts issues.",
        });
    }
    // conflicting / unusual module + moduleResolution pairs
    const mod = typeof co.module === "string" ? co.module.toLowerCase() : null;
    const modRes = typeof co.moduleResolution === "string"
        ? co.moduleResolution.toLowerCase()
        : null;
    if (mod && modRes) {
        const classicWithModern = modRes === "classic" &&
            (mod === "nodenext" ||
                mod === "node16" ||
                mod === "node18" ||
                mod === "esnext" ||
                mod === "es2020" ||
                mod === "es2022");
        const nodeWithAmd = (mod === "amd" || mod === "umd" || mod === "system") &&
            (modRes === "node" ||
                modRes === "nodenext" ||
                modRes === "node16" ||
                modRes === "node10");
        const bundlerWithCommonjs = modRes === "bundler" && (mod === "commonjs" || mod === "amd" || mod === "umd");
        if (classicWithModern || nodeWithAmd || bundlerWithCommonjs) {
            findings.push({
                severity: "warn",
                rule: "module_resolution_conflict",
                advice: `Possible mismatch: module="${co.module}" with moduleResolution="${co.moduleResolution}" — verify this pairing is intentional.`,
            });
        }
    }
    // paths without baseUrl
    const paths = normalizePaths(co.paths);
    const pathKeys = Object.keys(paths);
    const baseUrl = co.baseUrl;
    if (pathKeys.length > 0 && (baseUrl === undefined || baseUrl === null || baseUrl === "")) {
        findings.push({
            severity: "warn",
            rule: "paths_without_base_url",
            advice: "`compilerOptions.paths` is set but `baseUrl` is missing — path mapping often requires baseUrl.",
        });
    }
    // allowJs without checkJs
    if (co.allowJs === true && co.checkJs !== true) {
        findings.push({
            severity: "info",
            rule: "allow_js_no_check_js",
            advice: "`allowJs: true` without `checkJs: true` — JS files are included but not type-checked.",
        });
    }
    // noEmit + emitDeclarationOnly conflict smell
    if (co.noEmit === true && co.emitDeclarationOnly === true) {
        findings.push({
            severity: "warn",
            rule: "no_emit_vs_declarations",
            advice: "`noEmit: true` with `emitDeclarationOnly: true` — emitDeclarationOnly will not emit when noEmit is true.",
        });
    }
    // isolatedModules + const enums smell (info)
    if (co.isolatedModules === true && co.preserveConstEnums === false) {
        findings.push({
            severity: "info",
            rule: "isolated_modules_const_enums",
            advice: "`isolatedModules: true` with `preserveConstEnums: false` — const enums can be problematic under isolated transpile.",
        });
    }
    // esModuleInterop false with allowSyntheticDefaultImports false (common interop smell)
    if (co.esModuleInterop === false && co.allowSyntheticDefaultImports === false) {
        findings.push({
            severity: "info",
            rule: "interop_disabled",
            advice: "Both `esModuleInterop` and `allowSyntheticDefaultImports` are false — default imports from CJS may fail.",
        });
    }
    // target vs module oddities (very light)
    const target = typeof co.target === "string" ? co.target.toLowerCase() : null;
    if (target === "es3" || target === "es5") {
        if (mod === "nodenext" || mod === "node16" || modRes === "bundler") {
            findings.push({
                severity: "info",
                rule: "old_target_modern_module",
                advice: `target="${co.target}" with modern module settings may be unintentional.`,
            });
        }
    }
    // files empty array
    if (Array.isArray(raw.files) && raw.files.length === 0 && !("include" in raw)) {
        findings.push({
            severity: "warn",
            rule: "empty_files_no_include",
            advice: "`files` is an empty array and `include` is absent — TypeScript may compile nothing.",
        });
    }
    return findings;
}
