/**
 * Best-effort class-validator / class-transformer TS decorator text heuristics.
 * No class-validator runtime, no network, no filesystem follow, no eval / no TS AST.
 */
/** Well-known class-validator + class-transformer decorator names. */
const CV_DECORATOR_NAMES = [
    "IsString",
    "IsNumber",
    "IsInt",
    "IsBoolean",
    "IsEmail",
    "IsUrl",
    "IsUUID",
    "IsDate",
    "IsDateString",
    "IsEnum",
    "IsArray",
    "IsObject",
    "IsOptional",
    "IsNotEmpty",
    "IsDefined",
    "IsEmpty",
    "Min",
    "Max",
    "MinLength",
    "MaxLength",
    "Length",
    "Matches",
    "Contains",
    "NotContains",
    "IsPositive",
    "IsNegative",
    "IsIn",
    "IsNotIn",
    "ValidateNested",
    "ValidateIf",
    "Validate",
    "ValidatePromise",
    "ArrayMinSize",
    "ArrayMaxSize",
    "ArrayNotEmpty",
    "ArrayContains",
    "ArrayNotContains",
    "ArrayUnique",
    "IsLatitude",
    "IsLongitude",
    "IsPhoneNumber",
    "IsISO8601",
    "IsJSON",
    "IsJWT",
    "IsFQDN",
    "IsIP",
    "IsPort",
    "IsHexColor",
    "IsCreditCard",
    "IsAlpha",
    "IsAlphanumeric",
    "IsAscii",
    "IsBase64",
    "IsBIC",
    "IsBTCAddress",
    "IsByteLength",
    "IsCurrency",
    "IsDataURI",
    "IsDecimal",
    "IsDivisibleBy",
    "IsEAN",
    "IsEthereumAddress",
    "IsFirebasePushId",
    "IsFullWidth",
    "IsHalfWidth",
    "IsHash",
    "IsHexadecimal",
    "IsIBAN",
    "IsIdentityCard",
    "IsISSN",
    "IsISIN",
    "IsISO31661Alpha2",
    "IsISO31661Alpha3",
    "IsISRC",
    "IsMACAddress",
    "IsMagnetURI",
    "IsMilitaryTime",
    "IsMimeType",
    "IsMobilePhone",
    "IsMongoId",
    "IsMultibyte",
    "IsNumberString",
    "IsOctal",
    "IsPassportNumber",
    "IsPostalCode",
    "IsRFC3339",
    "IsRgbColor",
    "IsSemVer",
    "IsStrongPassword",
    "IsSurrogatePair",
    "IsTaxId",
    "IsTimeZone",
    "IsVariableWidth",
    "Equals",
    "NotEquals",
    "Allow",
    "IsInstance",
    "IsNotEmptyObject",
    "IsLowercase",
    "IsUppercase",
    "IsLocale",
    "IsLatLong",
    // class-transformer
    "Type",
    "Expose",
    "Exclude",
    "Transform",
    "plainToInstance",
    "TransformPlainToInstance",
];
const CV_NAME_SET = new Set(CV_DECORATOR_NAMES);
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
function extractClasses(cleaned) {
    const results = [];
    const re = /(?:export\s+)?(?:abstract\s+)?class\s+([A-Za-z_][A-Za-z0-9_]*)\s*(?:extends\s+[^{\s]+(?:\s*,\s*[^{\s]+)*)?\s*(?:implements\s+[^{\s]+(?:\s*,\s*[^{\s]+)*)?\s*\{/g;
    let m;
    while ((m = re.exec(cleaned))) {
        const name = m[1];
        const openBrace = m.index + m[0].length - 1;
        const close = findMatchingBrace(cleaned, openBrace);
        if (close < 0)
            continue;
        const body = cleaned.slice(openBrace + 1, close);
        results.push({ name, body, start: m.index });
    }
    return results;
}
/**
 * Parse property blocks with leading @decorators inside a class body.
 */
function parseDecoratedProperties(body) {
    const props = [];
    // Walk lines for @decorators then property declarations
    const lines = body.split("\n");
    let pendingDecs = [];
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        const trimmed = line.trim();
        // Decorator (may span multiple lines if paren not closed)
        const decM = trimmed.match(/^@([A-Za-z_][A-Za-z0-9_]*)\s*(\()?/);
        if (decM) {
            const name = decM[1];
            let args;
            if (decM[2] === "(") {
                // Find from this line onward
                const fromIdx = body.indexOf(line);
                // Better: reconstruct from remaining text starting at @name(
                const absSearch = findLineOffset(body, i) + line.indexOf("@");
                const atName = body.slice(absSearch);
                const openParenRel = atName.indexOf("(");
                if (openParenRel >= 0) {
                    const close = findMatchingParen(atName, openParenRel);
                    if (close >= 0) {
                        args = atName.slice(openParenRel + 1, close).trim();
                        // Advance i past the closing paren line
                        const consumed = absSearch + close;
                        const ahead = body.slice(0, consumed + 1);
                        const lineNum = ahead.split("\n").length - 1;
                        i = Math.max(i, lineNum) + 1;
                        pendingDecs.push({ name, args });
                        continue;
                    }
                }
            }
            pendingDecs.push({ name });
            i++;
            continue;
        }
        // Property declaration
        const propM = trimmed.match(/^(?:(?:public|private|protected|readonly|static|declare|override)\s+)*(?:readonly\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*(\?)?\s*!?\s*(?::\s*([^;={]+))?\s*(?:=|;|$)/);
        if (propM && pendingDecs.length > 0) {
            const property = propM[1];
            // Skip constructor / methods
            if (property === "constructor" ||
                /\(/.test(trimmed.split(":")[0] ?? "")) {
                pendingDecs = [];
                i++;
                continue;
            }
            // Skip method bodies: name(...) {
            if (/^[A-Za-z_][A-Za-z0-9_]*\s*\(/.test(trimmed)) {
                pendingDecs = [];
                i++;
                continue;
            }
            const entry = {
                property,
                decorators: pendingDecs,
            };
            if (propM[2] === "?")
                entry.optional = true;
            if (propM[3])
                entry.typeHint = propM[3].trim();
            props.push(entry);
            pendingDecs = [];
            i++;
            continue;
        }
        // Method or other — clear pending if we hit a method signature
        if (/^[A-Za-z_][A-Za-z0-9_]*\s*\(/.test(trimmed) || trimmed.startsWith("}")) {
            pendingDecs = [];
        }
        i++;
    }
    // Also catch via regex fallback for single-line decorator+prop patterns
    // that the line walker might miss (e.g. compacted)
    const compactRe = /@([A-Za-z_][A-Za-z0-9_]*)(?:\(([^)]*)\))?\s+(?:(?:public|private|protected|readonly)\s+)*([A-Za-z_][A-Za-z0-9_]*)\s*(\?)?\s*!?\s*:/g;
    let cm;
    const seen = new Set(props.map((p) => p.property));
    while ((cm = compactRe.exec(body))) {
        const dName = cm[1];
        const property = cm[3];
        if (seen.has(property)) {
            // Ensure decorator is recorded
            const existing = props.find((p) => p.property === property);
            if (existing && !existing.decorators.some((d) => d.name === dName)) {
                const d = { name: dName };
                if (cm[2] !== undefined)
                    d.args = cm[2].trim();
                existing.decorators.push(d);
            }
            continue;
        }
        // Multi-decorator blocks usually handled by walker; skip lone if not CV
        if (!CV_NAME_SET.has(dName) && !/^Is[A-Z]/.test(dName) && !/^Validate/.test(dName)) {
            continue;
        }
        const entry = {
            property,
            decorators: [
                {
                    name: dName,
                    ...(cm[2] !== undefined ? { args: cm[2].trim() } : {}),
                },
            ],
        };
        if (cm[4] === "?")
            entry.optional = true;
        props.push(entry);
        seen.add(property);
    }
    return props;
}
function findLineOffset(text, lineIndex) {
    let off = 0;
    for (let i = 0; i < lineIndex; i++) {
        const nl = text.indexOf("\n", off);
        if (nl < 0)
            return text.length;
        off = nl + 1;
    }
    return off;
}
function classHasCvDecorators(props, body) {
    if (props.some((p) => p.decorators.some((d) => CV_NAME_SET.has(d.name) ||
        /^Is[A-Z]/.test(d.name) ||
        /^Validate/.test(d.name) ||
        d.name === "Type" ||
        d.name === "Expose" ||
        d.name === "Exclude" ||
        d.name === "Transform"))) {
        return true;
    }
    // Class-level or any @Is* in body
    return /@(?:Is[A-Za-z]+|Validate(?:Nested|If)?|Type|Allow|Min|Max|Length|Matches|Contains|Equals|NotEquals)\b/.test(body);
}
/**
 * List DTO classes that use class-validator (or class-transformer) decorators.
 */
export function listDtos(text) {
    const cleaned = stripComments(text ?? "");
    const classes = extractClasses(cleaned);
    const dtos = [];
    for (const cls of classes) {
        const props = parseDecoratedProperties(cls.body);
        if (!classHasCvDecorators(props, cls.body))
            continue;
        const properties = [...new Set(props.map((p) => p.property))];
        // Also include plain properties that have CV decorators detected via alternate scan
        const altProps = [
            ...cls.body.matchAll(/(?:^|\n)\s*(?:(?:public|private|protected|readonly)\s+)*([A-Za-z_][A-Za-z0-9_]*)\s*\??\s*!?\s*:/g),
        ]
            .map((m) => m[1])
            .filter((n) => n !== "constructor");
        for (const n of altProps) {
            // Only add if there is a decorator somewhere before it in body and class is CV
            if (!properties.includes(n)) {
                // Check if this property has decorators immediately above
                const re = new RegExp(`@[A-Za-z_][A-Za-z0-9_]*[\\s\\S]{0,200}?\\b${n}\\s*\\??\\s*!?:`);
                if (re.test(cls.body) && !properties.includes(n)) {
                    properties.push(n);
                }
            }
        }
        dtos.push({ name: cls.name, properties });
    }
    return { dtos, count: dtos.length };
}
/**
 * List CV / CT decorator usages per property.
 */
export function listDecorators(text) {
    const cleaned = stripComments(text ?? "");
    const classes = extractClasses(cleaned);
    const decorators = [];
    for (const cls of classes) {
        const props = parseDecoratedProperties(cls.body);
        for (const p of props) {
            for (const d of p.decorators) {
                if (!CV_NAME_SET.has(d.name) &&
                    !/^Is[A-Z]/.test(d.name) &&
                    !/^Validate/.test(d.name) &&
                    !["Type", "Expose", "Exclude", "Transform", "Allow"].includes(d.name)) {
                    // Still include unknown @Xxx if it looks like a decorator on a DTO property
                    // Skip framework noise like @Injectable @Controller
                    if (/^(Injectable|Controller|Module|Inject|Get|Post|Put|Patch|Delete|Body|Query|Param|Header|Req|Res|Next|HttpCode|UseGuards|UseInterceptors|UsePipes|ApiProperty|ApiPropertyOptional)$/.test(d.name)) {
                        continue;
                    }
                }
                const info = { name: d.name };
                info.dto = cls.name;
                info.property = p.property;
                decorators.push(info);
            }
        }
    }
    // Fallback: global scan for @Decorator near property if class parse missed
    if (decorators.length === 0) {
        const globalRe = /@([A-Za-z_][A-Za-z0-9_]*)\s*(?:\([^)]*\))?\s*(?:\n\s*@[A-Za-z_][\s\S]*?){0,8}?\n\s*(?:(?:public|private|protected|readonly)\s+)*([A-Za-z_][A-Za-z0-9_]*)\s*\??\s*!?\s*:/g;
        let m;
        while ((m = globalRe.exec(cleaned))) {
            const name = m[1];
            const property = m[2];
            if (CV_NAME_SET.has(name) ||
                /^Is[A-Z]/.test(name) ||
                /^Validate/.test(name) ||
                ["Type", "Expose", "Exclude", "Transform", "Allow"].includes(name)) {
                decorators.push({ name, property });
            }
        }
    }
    return { decorators, count: decorators.length };
}
/**
 * Nested hints from @ValidateNested / @Type(() => Foo).
 */
export function listNested(text) {
    const cleaned = stripComments(text ?? "");
    const classes = extractClasses(cleaned);
    const nested = [];
    const seen = new Set();
    for (const cls of classes) {
        const props = parseDecoratedProperties(cls.body);
        for (const p of props) {
            const hasValidateNested = p.decorators.some((d) => d.name === "ValidateNested");
            const typeDec = p.decorators.find((d) => d.name === "Type");
            if (!hasValidateNested && !typeDec)
                continue;
            const info = {
                dto: cls.name,
                property: p.property,
            };
            // each: true from ValidateNested({ each: true }) or Type options
            const vn = p.decorators.find((d) => d.name === "ValidateNested");
            if (vn?.args && /\beach\s*:\s*true\b/.test(vn.args)) {
                info.each = true;
            }
            if (typeDec?.args && /\beach\s*:\s*true\b/.test(typeDec.args)) {
                info.each = true;
            }
            // Array type hint implies each
            if (p.typeHint &&
                (/\[\]\s*$/.test(p.typeHint.trim()) ||
                    /^Array\s*</.test(p.typeHint.trim()))) {
                if (info.each === undefined && hasValidateNested) {
                    // leave undefined unless explicit — arrays often need each: true
                }
            }
            // Extract type from @Type(() => Foo) or @Type(() => Foo)
            if (typeDec?.args) {
                const tm = typeDec.args.match(/(?:\(\s*\)\s*=>\s*|=>\s*)([A-Za-z_][A-Za-z0-9_]*)/);
                if (tm)
                    info.type = tm[1];
                else {
                    const tm2 = typeDec.args.match(/\b([A-Z][A-Za-z0-9_]*)\b/);
                    // Prefer PascalCase type names; skip flags
                    if (tm2 && !/^(Each|True|False|Undefined)$/.test(tm2[1])) {
                        info.type = tm2[1];
                    }
                }
            }
            // Fallback type from property type annotation
            if (!info.type && p.typeHint) {
                const th = p.typeHint.trim();
                const arr = th.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*\[\s*\]$/);
                const gen = th.match(/^Array\s*<\s*([A-Za-z_][A-Za-z0-9_]*)\s*>/);
                const plain = th.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*$/);
                if (arr) {
                    info.type = arr[1];
                    if (info.each === undefined)
                        info.each = true;
                }
                else if (gen) {
                    info.type = gen[1];
                    if (info.each === undefined)
                        info.each = true;
                }
                else if (plain && !/^(string|number|boolean|any|unknown|object|Date)$/.test(plain[1])) {
                    info.type = plain[1];
                }
            }
            const key = `${info.dto ?? ""}::${info.property ?? ""}::${info.type ?? ""}`;
            if (seen.has(key))
                continue;
            seen.add(key);
            nested.push(info);
        }
    }
    // Global fallback for ValidateNested / Type without full class parse
    if (nested.length === 0) {
        const vnRe = /@ValidateNested\s*(?:\(([^)]*)\))?/g;
        let m;
        while ((m = vnRe.exec(cleaned))) {
            const after = cleaned.slice(m.index, m.index + 400);
            const propM = after.match(/(?:public|private|protected|readonly\s+)*([A-Za-z_][A-Za-z0-9_]*)\s*\??\s*!?\s*:/);
            const typeM = after.match(/@Type\s*\(\s*(?:\(\s*)?\(?\s*\)\s*=>\s*([A-Za-z_][A-Za-z0-9_]*)/);
            const info = {};
            if (propM)
                info.property = propM[1];
            if (typeM)
                info.type = typeM[1];
            if (m[1] && /\beach\s*:\s*true\b/.test(m[1]))
                info.each = true;
            nested.push(info);
        }
    }
    return { nested, count: nested.length };
}
function countOccurrences(text, re) {
    let n = 0;
    const r = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    while (r.exec(text))
        n++;
    return n;
}
export function lintCv(text) {
    const findings = [];
    const raw = text ?? "";
    if (!raw.trim()) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Source text is empty. Paste class-validator DTO TypeScript (e.g. class CreateUserDto { @IsEmail() email: string; }).",
        });
        return findings;
    }
    const cleaned = stripComments(raw);
    const { dtos } = listDtos(cleaned);
    const { nested } = listNested(cleaned);
    const classes = extractClasses(cleaned);
    const hasCv = /from\s+['"]class-validator['"]/.test(cleaned) ||
        /from\s+['"]class-transformer['"]/.test(cleaned) ||
        /@(?:Is[A-Za-z]+|ValidateNested|ValidateIf|Allow|Min|Max|Length|Matches)\b/.test(cleaned);
    if (!hasCv && dtos.length === 0) {
        findings.push({
            severity: "warn",
            rule: "no_cv_detected",
            advice: "No class-validator / class-transformer import or `@Is*` / `@ValidateNested` patterns detected. Confirm this is DTO source.",
        });
    }
    // ValidateNested without @Type
    for (const cls of classes) {
        const props = parseDecoratedProperties(cls.body);
        for (const p of props) {
            const hasVn = p.decorators.some((d) => d.name === "ValidateNested");
            const hasType = p.decorators.some((d) => d.name === "Type");
            if (hasVn && !hasType) {
                findings.push({
                    severity: "warn",
                    rule: "validate_nested_without_type",
                    advice: `Property "${cls.name}.${p.property}" has @ValidateNested but no @Type(() => …). class-transformer needs @Type to instantiate nested objects (or arrays with { each: true }).`,
                });
            }
        }
    }
    // Also check nested list for missing type
    for (const n of nested) {
        if (n.property && !n.type) {
            const already = findings.some((f) => f.rule === "validate_nested_without_type" &&
                f.advice.includes(`.${n.property}`));
            if (!already) {
                findings.push({
                    severity: "info",
                    rule: "nested_type_unresolved",
                    advice: `Nested property "${n.dto ? n.dto + "." : ""}${n.property}" could not resolve a concrete type from @Type(() => …). Add @Type(() => NestedDto).`,
                });
            }
        }
    }
    // Whitelist tip
    const mentionsWhitelist = /\bwhitelist\s*:/.test(cleaned) ||
        /\bforbidNonWhitelisted\s*:/.test(cleaned) ||
        /\bValidationPipe\b/.test(cleaned);
    if (dtos.length > 0 && !mentionsWhitelist) {
        findings.push({
            severity: "info",
            rule: "missing_whitelist_tip",
            advice: "DTO classes detected but no ValidationPipe whitelist / forbidNonWhitelisted tip nearby. In NestJS prefer `new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })` so undecorated properties are stripped/rejected.",
        });
    }
    // IsOptional on required-looking fields (no ? on property)
    for (const cls of classes) {
        const props = parseDecoratedProperties(cls.body);
        for (const p of props) {
            const hasOptional = p.decorators.some((d) => d.name === "IsOptional");
            const hasNotEmpty = p.decorators.some((d) => d.name === "IsNotEmpty" || d.name === "IsDefined");
            if (hasOptional && p.optional !== true) {
                // Property lacks `?` but has @IsOptional
                findings.push({
                    severity: "info",
                    rule: "is_optional_on_required_looking",
                    advice: `Property "${cls.name}.${p.property}" uses @IsOptional but the TypeScript type is not marked optional (\`?\`). Consider \`${p.property}?: …\` for type accuracy (runtime still allows omit).`,
                });
                break; // one tip is enough for smoke
            }
            if (!hasOptional && p.optional === true && hasNotEmpty) {
                findings.push({
                    severity: "warn",
                    rule: "optional_ts_with_not_empty",
                    advice: `Property "${cls.name}.${p.property}" is TypeScript-optional (\`?\`) but uses @IsNotEmpty/@IsDefined. Prefer @IsOptional() for omit-able fields, or drop \`?\` if required.`,
                });
            }
        }
    }
    // Array nested without each: true
    for (const cls of classes) {
        const props = parseDecoratedProperties(cls.body);
        for (const p of props) {
            const vn = p.decorators.find((d) => d.name === "ValidateNested");
            if (!vn)
                continue;
            const isArray = (p.typeHint &&
                (/\[\]\s*$/.test(p.typeHint.trim()) ||
                    /^Array\s*</.test(p.typeHint.trim()))) ||
                false;
            const hasEach = vn.args && /\beach\s*:\s*true\b/.test(vn.args);
            if (isArray && !hasEach) {
                findings.push({
                    severity: "warn",
                    rule: "validate_nested_array_missing_each",
                    advice: `Property "${cls.name}.${p.property}" looks like an array with @ValidateNested but without \`{ each: true }\`. Use @ValidateNested({ each: true }) and @Type(() => ItemDto).`,
                });
            }
        }
    }
    // Email field without @IsEmail
    for (const cls of classes) {
        const props = parseDecoratedProperties(cls.body);
        for (const p of props) {
            const n = p.property.toLowerCase();
            if ((n === "email" || n.endsWith("email") || n === "emailaddress") &&
                !p.decorators.some((d) => d.name === "IsEmail")) {
                if (p.decorators.some((d) => d.name === "IsString")) {
                    findings.push({
                        severity: "info",
                        rule: "missing_is_email",
                        advice: `Property "${cls.name}.${p.property}" looks like an email but only has @IsString. Consider @IsEmail().`,
                    });
                    break;
                }
            }
        }
    }
    // Bare @IsString without IsNotEmpty on required string
    const isStringCount = countOccurrences(cleaned, /@IsString\b/g);
    if (isStringCount >= 1 && dtos.length > 0) {
        findings.push({
            severity: "info",
            rule: "is_string_empty_tip",
            advice: "@IsString() allows empty strings. Pair required string fields with @IsNotEmpty() (or @MinLength(1)) when blanks should fail.",
        });
    }
    if (dtos.length === 0 && hasCv) {
        findings.push({
            severity: "info",
            rule: "cv_without_dto_classes",
            advice: "class-validator usage detected but no decorated `class` DTOs matched. Decorators on interfaces, type aliases, or non-class forms are not supported by these heuristics.",
        });
    }
    return findings;
}
