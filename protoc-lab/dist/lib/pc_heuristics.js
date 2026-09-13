/**
 * Best-effort protoc CLI text heuristics.
 * No protoc/protobuf compiler runtime, no network, no filesystem follow, no eval.
 */
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
const INVOCATION_RE = /(^|[;&|]\s*)((?:[\w./~-]*\/)?protoc(?:\.exe)?)\b(.*)$/i;
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
/** Known bool / switch flags for protoc */
const BOOL_FLAGS = new Set([
    "--include_imports",
    "--include_source_info",
    "--retain_options",
    "--experimental_allow_proto3_optional",
    "--print_free_field_numbers",
    "--decode_raw",
    "--fatal_warnings",
    "--help",
    "--version",
    "-h",
]);
/** Value-taking flags that are "options" (not includes / not *_out / not --plugin) */
const OPTION_VALUE_FLAGS = new Set([
    "--descriptor_set_out",
    "-o",
    "--dependency_out",
    "--error_format",
    "--encode",
    "--decode",
    "--objc_opt",
    "--php_opt",
    "--ruby_opt",
    "--java_opt",
    "--csharp_opt",
    "--kotlin_opt",
]);
function isOutFlag(rawFlag) {
    // --cpp_out, --python_out, --go_out, --js_out, --grpc_out, --grpc-python_out, etc.
    // Exclude non-generator outs that happen to end in _out.
    if (rawFlag === "--descriptor_set_out" ||
        rawFlag === "--dependency_out") {
        return false;
    }
    return /^--[\w-]+_out$/.test(rawFlag);
}
function isIncludeFlag(rawFlag) {
    return (rawFlag === "-I" ||
        rawFlag === "--proto_path" ||
        rawFlag.startsWith("-I") // glued -Ipath
    );
}
function isPluginFlag(rawFlag) {
    return rawFlag === "--plugin" || rawFlag.startsWith("--plugin=");
}
function parseInvocationArgs(args) {
    const tokens = tokenizeArgs(args);
    const flags = [];
    const positionals = [];
    for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        // Glued -Ipath / -I=path
        if (/^-I.+/.test(tok) && !tok.startsWith("--")) {
            let value = tok.slice(2);
            if (value.startsWith("="))
                value = value.slice(1);
            flags.push({ flag: "-I", value });
            continue;
        }
        if (tok.startsWith("--")) {
            const eq = tok.indexOf("=");
            const rawFlag = eq === -1 ? tok : tok.slice(0, eq);
            let value = eq === -1 ? undefined : tok.slice(eq + 1);
            const isBool = BOOL_FLAGS.has(rawFlag);
            if (!isBool && value === undefined) {
                const nxt = tokens[i + 1];
                if (nxt !== undefined && !nxt.startsWith("-")) {
                    value = nxt;
                    i++;
                }
            }
            flags.push(value !== undefined ? { flag: rawFlag, value } : { flag: rawFlag });
            continue;
        }
        if (tok.startsWith("-") && tok.length > 1) {
            const eq = tok.indexOf("=");
            const rawFlag = eq === -1 ? tok : tok.slice(0, eq);
            let value = eq === -1 ? undefined : tok.slice(eq + 1);
            const isBool = BOOL_FLAGS.has(rawFlag);
            const needsValue = rawFlag === "-I" ||
                rawFlag === "-o" ||
                OPTION_VALUE_FLAGS.has(rawFlag) ||
                (!isBool && (rawFlag === "-I" || rawFlag === "-o"));
            if ((needsValue || rawFlag === "-I" || rawFlag === "-o") && value === undefined) {
                const nxt = tokens[i + 1];
                if (nxt !== undefined && !nxt.startsWith("-")) {
                    value = nxt;
                    i++;
                }
            }
            flags.push(value !== undefined ? { flag: rawFlag, value } : { flag: rawFlag });
            continue;
        }
        positionals.push(tok);
    }
    return { flags, positionals };
}
function parseAllInvocations(text) {
    const raw = joinContinuations((text ?? "").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n"));
    const out = [];
    for (const line of raw.split("\n")) {
        const cleanedLine = line.replace(/(^|\s)#.*$/, "$1");
        const inv = cleanedLine.match(INVOCATION_RE);
        if (inv) {
            out.push(parseInvocationArgs(inv[3] ?? ""));
        }
    }
    // Fallback: whole text if protoc mentioned but no line matched
    if (out.length === 0 && /\bprotoc(?:\.exe)?\b/i.test(raw)) {
        const cleaned = stripComments(raw).replace(/\bprotoc(?:\.exe)?\b/gi, " ");
        out.push(parseInvocationArgs(cleaned));
    }
    // Also accept pastes that are just flags + .proto without the binary name
    if (out.length === 0 &&
        (/\b(?:-I|--proto_path|--[\w-]+_out|--plugin)\b/.test(raw) ||
            /\.proto\b/.test(raw))) {
        const cleaned = stripComments(raw);
        out.push(parseInvocationArgs(cleaned));
    }
    return out;
}
function looksLikeProtoFile(tok) {
    if (!tok || tok.startsWith("-"))
        return false;
    return /\.proto$/i.test(tok.replace(/[),.;]+$/, ""));
}
function cleanPath(tok) {
    return tok.replace(/[),.;]+$/, "").replace(/^['"`]|['"`]$/g, "");
}
function isAbsolutePath(p) {
    if (!p)
        return false;
    // Unix absolute, Windows drive, UNC
    if (p.startsWith("/") || p.startsWith("\\"))
        return true;
    if (/^[A-Za-z]:[\\/]/.test(p))
        return true;
    return false;
}
/**
 * List -I / --proto_path includes and trailing .proto files.
 * `count` = number of include paths.
 */
export function listIncludes(text) {
    const includes = [];
    const protos = [];
    const seenInc = new Set();
    const seenProto = new Set();
    const pushInc = (p) => {
        const v = p?.trim();
        if (!v || seenInc.has(v))
            return;
        seenInc.add(v);
        includes.push(v);
    };
    const pushProto = (p) => {
        const v = p ? cleanPath(p) : undefined;
        if (!v || seenProto.has(v))
            return;
        seenProto.add(v);
        protos.push(v);
    };
    const invs = parseAllInvocations(text);
    for (const inv of invs) {
        for (const f of inv.flags) {
            if (f.flag === "-I" || f.flag === "--proto_path") {
                pushInc(f.value);
            }
        }
        for (const p of inv.positionals) {
            if (looksLikeProtoFile(p))
                pushProto(p);
        }
    }
    // Regex fallback for includes / protos when invocation parse was thin
    const cleaned = stripComments(text ?? "");
    if (includes.length === 0) {
        const re = /(?:^|\s)(-I|--proto_path)(?:=|\s+)(?:"([^"]*)"|'([^']*)'|(\S+))/gi;
        let m;
        while ((m = re.exec(cleaned))) {
            pushInc(m[2] ?? m[3] ?? m[4]);
        }
        // glued -Ipath
        const glued = /(?:^|\s)-I([^\s=][^\s]*)/g;
        while ((m = glued.exec(cleaned))) {
            const v = m[1];
            if (!v.startsWith("-"))
                pushInc(v);
        }
    }
    if (protos.length === 0) {
        const re = /(?:^|\s)((?:\.\/|[\w./~-]+)?[\w.-]+\.proto)\b/gi;
        let m;
        while ((m = re.exec(cleaned))) {
            pushProto(m[1]);
        }
    }
    return { includes, protos, count: includes.length };
}
/**
 * Extract plugins from --*_out and --plugin=.
 */
export function listPlugins(text) {
    const plugins = [];
    const seen = new Set();
    const push = (name, out) => {
        const n = name.trim();
        if (!n)
            return;
        const key = `${n}|${out ?? ""}`;
        if (seen.has(key))
            return;
        seen.add(key);
        const entry = { name: n };
        if (out !== undefined && out !== "")
            entry.out = out;
        plugins.push(entry);
    };
    const invs = parseAllInvocations(text);
    for (const inv of invs) {
        for (const f of inv.flags) {
            if (isOutFlag(f.flag)) {
                // --cpp_out → cpp, --grpc_python_out → grpc_python, --go-grpc_out → go-grpc
                const m = f.flag.match(/^--([\w-]+)_out$/);
                if (m)
                    push(m[1], f.value);
                continue;
            }
            if (f.flag === "--plugin" || f.flag.startsWith("--plugin")) {
                // --plugin=protoc-gen-go=/path or --plugin=protoc-gen-go
                const raw = f.value ?? "";
                // Also handle --plugin=NAME=PATH entirely in flag from eq-split
                let pluginSpec = raw;
                if (f.flag.startsWith("--plugin=") && !pluginSpec) {
                    pluginSpec = f.flag.slice("--plugin=".length);
                }
                // NAME=PATH or just NAME
                const eq = pluginSpec.indexOf("=");
                const namePart = eq === -1 ? pluginSpec : pluginSpec.slice(0, eq);
                let pluginName = namePart.trim();
                // strip protoc-gen- prefix
                const gen = pluginName.match(/^protoc-gen-(.+)$/i);
                if (gen)
                    pluginName = gen[1];
                if (pluginName)
                    push(pluginName);
            }
        }
    }
    // Regex fallback
    if (plugins.length === 0) {
        const cleaned = stripComments(text ?? "");
        const outRe = /(?:^|\s)(--[\w-]+_out)(?:=|\s+)(?:"([^"]*)"|'([^']*)'|(\S+))/gi;
        let m;
        while ((m = outRe.exec(cleaned))) {
            const flag = m[1];
            const mm = flag.match(/^--([\w-]+)_out$/);
            if (mm)
                push(mm[1], m[2] ?? m[3] ?? m[4]);
        }
        const pluginRe = /(?:^|\s)--plugin(?:=|\s+)(?:"([^"]*)"|'([^']*)'|(\S+))/gi;
        while ((m = pluginRe.exec(cleaned))) {
            const spec = m[1] ?? m[2] ?? m[3] ?? "";
            const eq = spec.indexOf("=");
            let namePart = (eq === -1 ? spec : spec.slice(0, eq)).trim();
            const gen = namePart.match(/^protoc-gen-(.+)$/i);
            if (gen)
                namePart = gen[1];
            if (namePart)
                push(namePart);
        }
    }
    return { plugins, count: plugins.length };
}
/**
 * Other common flags: --descriptor_set_out, --include_imports,
 * --experimental_allow_proto3_optional, etc. (excludes -I/--proto_path, *_out, --plugin).
 */
export function listOptions(text) {
    const options = [];
    const seen = new Set();
    const push = (flag, value) => {
        const f = flag.trim();
        if (!f)
            return;
        const key = `${f}|${value ?? ""}`;
        if (seen.has(key))
            return;
        seen.add(key);
        const entry = { flag: f };
        if (value !== undefined && value !== "")
            entry.value = value;
        options.push(entry);
    };
    const invs = parseAllInvocations(text);
    for (const inv of invs) {
        for (const f of inv.flags) {
            if (isIncludeFlag(f.flag) || f.flag === "-I" || f.flag === "--proto_path")
                continue;
            if (isOutFlag(f.flag))
                continue;
            if (isPluginFlag(f.flag) || f.flag === "--plugin")
                continue;
            // Keep common / any remaining flags as options
            push(f.flag, f.value);
        }
    }
    // Regex fallback for well-known option flags when empty
    if (options.length === 0) {
        const cleaned = stripComments(text ?? "");
        const known = /(?:^|\s)(--descriptor_set_out|-o|--dependency_out|--error_format|--encode|--decode|--include_imports|--include_source_info|--retain_options|--experimental_allow_proto3_optional|--print_free_field_numbers|--decode_raw|--fatal_warnings|--help|--version|-h)(?:=|\s+)?(?:"([^"]*)"|'([^']*)'|(\S+))?/gi;
        let m;
        while ((m = known.exec(cleaned))) {
            const flag = m[1];
            const isBool = BOOL_FLAGS.has(flag) || flag === "-h";
            const val = isBool ? undefined : m[2] ?? m[3] ?? m[4];
            // Avoid capturing next flag as value
            if (val !== undefined && val.startsWith("-") && !isBool) {
                push(flag);
            }
            else {
                push(flag, val);
            }
        }
    }
    return { options, count: options.length };
}
function hasProtocSignal(raw) {
    return (/\bprotoc(?:\.exe)?\b/i.test(raw) ||
        listIncludes(raw).count > 0 ||
        listIncludes(raw).protos.length > 0 ||
        listPlugins(raw).count > 0 ||
        /(?:-I|--proto_path|--[\w-]+_out|--plugin|--descriptor_set_out)\b/.test(raw));
}
export function lintProtoc(text) {
    const findings = [];
    const raw = text ?? "";
    if (!raw.trim()) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Source text is empty. Paste a protoc CLI line (e.g. `protoc -I. --python_out=gen api/v1/foo.proto` or `protoc --descriptor_set_out=out.pb --include_imports *.proto`).",
        });
        return findings;
    }
    const { includes, protos } = listIncludes(raw);
    const { plugins } = listPlugins(raw);
    const { options } = listOptions(raw);
    const hasCli = /\bprotoc(?:\.exe)?\b/i.test(raw) || includes.length + plugins.length + options.length + protos.length > 0;
    if (!hasProtocSignal(raw)) {
        findings.push({
            severity: "warn",
            rule: "no_protoc_detected",
            advice: "No protoc signals detected (`protoc -I path --cpp_out=dir file.proto`, `--plugin=`, `.proto` inputs, etc.). Confirm this is protoc CLI text.",
        });
    }
    // Missing -I / --proto_path when .proto files are present
    if (hasCli && protos.length > 0 && includes.length === 0) {
        findings.push({
            severity: "info",
            rule: "missing_include_tip",
            advice: "`.proto` inputs found without `-I` / `--proto_path` in this text. Prefer an explicit import root (`-I.` or `-I proto`) so imports resolve reproducibly (educational tip only; does not run protoc).",
        });
    }
    // No *_out and no descriptor_set_out — nothing to emit
    const hasDescriptorOut = options.some((o) => o.flag === "--descriptor_set_out" || o.flag === "-o");
    const hasDecodeEncode = options.some((o) => ["--encode", "--decode", "--decode_raw", "--print_free_field_numbers"].includes(o.flag));
    if (hasCli &&
        /\bprotoc(?:\.exe)?\b/i.test(raw) &&
        plugins.length === 0 &&
        !hasDescriptorOut &&
        !hasDecodeEncode) {
        findings.push({
            severity: "info",
            rule: "no_out_tip",
            advice: "protoc CLI without `--*_out` / `--descriptor_set_out` / `-o` in this text. Add a generator (`--python_out`, `--go_out`, `--cpp_out`, …) or a descriptor set output so the invocation produces artifacts (info only; does not run protoc).",
        });
    }
    // Absolute path tips for includes / protos / outs
    const absHits = [];
    for (const inc of includes) {
        if (isAbsolutePath(inc))
            absHits.push(`-I ${inc}`);
    }
    for (const p of protos) {
        if (isAbsolutePath(p))
            absHits.push(p);
    }
    for (const pl of plugins) {
        if (pl.out) {
            // out may be opts:path — check final segment after last colon if looks like path
            const parts = pl.out.split(":");
            const pathPart = parts[parts.length - 1] ?? pl.out;
            if (isAbsolutePath(pathPart) || isAbsolutePath(pl.out)) {
                absHits.push(`--${pl.name}_out=${pl.out}`);
            }
        }
    }
    if (absHits.length > 0) {
        findings.push({
            severity: "info",
            rule: "absolute_path_tip",
            advice: `Found absolute path(s) in includes / .proto inputs / outs (${absHits.slice(0, 3).join("; ")}${absHits.length > 3 ? "; …" : ""}). Prefer workspace-relative paths so the same protoc line works across machines (educational tip only; does not run protoc).`,
        });
    }
    // .proto mentioned via protoc but no trailing .proto file parsed
    if (hasCli &&
        /\bprotoc(?:\.exe)?\b/i.test(raw) &&
        protos.length === 0 &&
        plugins.length + includes.length + options.length > 0 &&
        !hasDecodeEncode) {
        findings.push({
            severity: "info",
            rule: "missing_proto_tip",
            advice: "protoc flags present but no trailing `.proto` input file in this text. protoc needs at least one `.proto` (or encode/decode mode) to compile.",
        });
    }
    return findings;
}
