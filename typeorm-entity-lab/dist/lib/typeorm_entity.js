/**
 * Best-effort TypeORM entity TS/JS text heuristics.
 * No TypeORM CLI, no network, no DB, no filesystem follow, no eval / no tsc AST.
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
/** Extract string literal from decorator arg like ('users') or ({ name: 'users' }). */
function tableNameFromEntityArgs(args) {
    const trimmed = args.trim();
    if (!trimmed)
        return undefined;
    const str = trimmed.match(/^['"]([^'"]+)['"]/);
    if (str)
        return str[1];
    const named = trimmed.match(/\bname\s*:\s*['"]([^'"]+)['"]/);
    if (named)
        return named[1];
    return undefined;
}
function extractDecoratorArgs(text, decoratorMatchIndex, decoratorFull) {
    const after = decoratorMatchIndex + decoratorFull.length;
    let i = after;
    while (i < text.length && /\s/.test(text[i]))
        i++;
    if (text[i] !== "(")
        return { args: "", end: after };
    const close = findMatchingParen(text, i);
    if (close < 0)
        return { args: "", end: after };
    return { args: text.slice(i + 1, close), end: close + 1 };
}
/**
 * Find property name that follows a decorator stack.
 * Looks ahead for `name:` or `name =` or `name;` patterns after decorators.
 */
function propertyNameAfter(text, from) {
    let i = from;
    // Skip whitespace and further @decorators on following lines
    while (i < text.length) {
        while (i < text.length && /\s/.test(text[i]))
            i++;
        if (text[i] === "@") {
            // skip decorator name and optional (...)
            i++;
            while (i < text.length && /[A-Za-z0-9_.]/.test(text[i]))
                i++;
            while (i < text.length && /\s/.test(text[i]))
                i++;
            if (text[i] === "(") {
                const close = findMatchingParen(text, i);
                if (close < 0)
                    break;
                i = close + 1;
            }
            continue;
        }
        // optional modifiers: public/private/protected/readonly/declare/static/override
        const modRe = /^(?:public|private|protected|readonly|declare|static|override|abstract)\b/;
        const slice = text.slice(i);
        const modM = slice.match(modRe);
        if (modM) {
            i += modM[0].length;
            continue;
        }
        break;
    }
    const m = text.slice(i).match(/^([A-Za-z_][A-Za-z0-9_]*)\s*[:=;?(]/);
    return m ? m[1] : undefined;
}
/**
 * Walk backward from `class` keyword and collect trailing @Decorator(...) text
 * plus export/default/abstract modifiers — without cutting on `}` inside decorator args.
 */
function extractTrailingDecorators(text, classAbs) {
    let i = classAbs;
    // Skip whitespace immediately before class
    while (i > 0 && /\s/.test(text[i - 1]))
        i--;
    // Optionally consume export / default / abstract keywords (already mostly in m[1],
    // but decorators sit before those modifiers).
    const consumeIdentBack = () => {
        let j = i;
        while (j > 0 && /\s/.test(text[j - 1]))
            j--;
        let k = j;
        while (k > 0 && /[A-Za-z_]/.test(text[k - 1]))
            k--;
        const word = text.slice(k, j);
        if (word === "export" ||
            word === "default" ||
            word === "abstract" ||
            word === "declare") {
            i = k;
            return true;
        }
        return false;
    };
    while (consumeIdentBack()) {
        /* keep peeling modifiers */
    }
    const endExclusive = i; // decorators end here (before modifiers/class)
    // Now peel @Decorator or @Decorator(...) from the end
    const startPositions = [];
    while (true) {
        let j = i;
        while (j > 0 && /\s/.test(text[j - 1]))
            j--;
        if (j <= 0)
            break;
        if (text[j - 1] === ")") {
            // find matching "(" then @Name before it
            let depth = 0;
            let p = j - 1;
            let inString = false;
            let quote = "";
            for (; p >= 0; p--) {
                const c = text[p];
                if (inString) {
                    // naive: if quote and previous isn't escaped roughly
                    if (c === quote) {
                        // check escape
                        let bs = 0;
                        let q = p - 1;
                        while (q >= 0 && text[q] === "\\") {
                            bs++;
                            q--;
                        }
                        if (bs % 2 === 0)
                            inString = false;
                    }
                    continue;
                }
                if (c === '"' || c === "'" || c === "`") {
                    inString = true;
                    quote = c;
                    continue;
                }
                if (c === ")")
                    depth++;
                else if (c === "(") {
                    depth--;
                    if (depth === 0)
                        break;
                }
            }
            if (p < 0 || text[p] !== "(")
                break;
            // skip whitespace before (
            let q = p;
            while (q > 0 && /\s/.test(text[q - 1]))
                q--;
            // identifier
            let r = q;
            while (r > 0 && /[A-Za-z0-9_.]/.test(text[r - 1]))
                r--;
            if (r <= 0 || text[r - 1] !== "@")
                break;
            // optional chained .Member already in [A-Za-z0-9_.]
            startPositions.push(r - 1);
            i = r - 1;
            continue;
        }
        // @Name without parens
        let r = j;
        while (r > 0 && /[A-Za-z0-9_.]/.test(text[r - 1]))
            r--;
        if (r <= 0 || text[r - 1] !== "@")
            break;
        startPositions.push(r - 1);
        i = r - 1;
    }
    if (startPositions.length === 0) {
        // fallback: small window before class
        return text.slice(Math.max(0, classAbs - 200), classAbs);
    }
    const start = Math.min(...startPositions);
    return text.slice(start, endExclusive);
}
export function parseClassBlocks(text) {
    const cleaned = stripComments(text ?? "");
    const blocks = [];
    const classRe = /(?:^|\n)\s*((?:export\s+)?(?:default\s+)?(?:abstract\s+)?)class\s+([A-Za-z_][A-Za-z0-9_]*)\s*(?:extends\s+[^{]+)?(?:implements\s+[^{]+)?\{/g;
    let m;
    while ((m = classRe.exec(cleaned))) {
        const name = m[2];
        const openAbs = m.index + m[0].length - 1;
        const closeAbs = findMatchingBrace(cleaned, openAbs);
        const body = closeAbs < 0 ? "" : cleaned.slice(openAbs + 1, closeAbs);
        // Decorators: walk back from class keyword collecting @Decorator(...) stack
        const classKeywordOffset = m[0].search(/\bclass\b/);
        const classAbs = m.index + (classKeywordOffset >= 0 ? classKeywordOffset : 0);
        const decoratorsBefore = extractTrailingDecorators(cleaned, classAbs);
        blocks.push({
            name,
            body,
            start: openAbs,
            decoratorsBefore,
        });
        if (closeAbs >= 0) {
            classRe.lastIndex = Math.max(classRe.lastIndex, closeAbs + 1);
        }
    }
    return blocks;
}
function entityDecoratorInfo(decoratorsBefore) {
    const entRe = /@Entity\b/g;
    let m;
    let last = null;
    while ((m = entRe.exec(decoratorsBefore))) {
        const { args } = extractDecoratorArgs(decoratorsBefore, m.index, m[0]);
        last = { tableName: tableNameFromEntityArgs(args) };
    }
    if (!last)
        return { isEntity: false };
    return { isEntity: true, tableName: last.tableName };
}
const COLUMN_DECORATORS = [
    "Column",
    "PrimaryColumn",
    "PrimaryGeneratedColumn",
    "ObjectIdColumn",
    "CreateDateColumn",
    "UpdateDateColumn",
    "DeleteDateColumn",
    "VersionColumn",
];
const RELATION_DECORATORS = [
    "OneToMany",
    "ManyToOne",
    "OneToOne",
    "ManyToMany",
];
function parseOptionBool(args, key) {
    const re = new RegExp(`\\b${key}\\s*:\\s*(true|false)\\b`);
    const m = args.match(re);
    if (!m)
        return undefined;
    return m[1] === "true";
}
function parseOptionType(args) {
    // type: 'varchar' | type: "int" | type: String | type: () => String
    const str = args.match(/\btype\s*:\s*['"]([^'"]+)['"]/);
    if (str)
        return str[1];
    const ident = args.match(/\btype\s*:\s*([A-Za-z_][A-Za-z0-9_]*)\b/);
    if (ident && ident[1] !== "true" && ident[1] !== "false")
        return ident[1];
    // First positional string arg: @Column('varchar')
    const pos = args.match(/^\s*['"]([^'"]+)['"]/);
    if (pos)
        return pos[1];
    return undefined;
}
function parseRelationTarget(args) {
    // () => User  or  () => Post  or  'User'  or  "User"
    const arrow = args.match(/\(\s*\)\s*=>\s*([A-Za-z_][A-Za-z0-9_]*)/);
    if (arrow)
        return arrow[1];
    const str = args.match(/^\s*['"]([A-Za-z_][A-Za-z0-9_]*)['"]/);
    if (str)
        return str[1];
    return undefined;
}
function listColumnNamesInBody(body) {
    const names = [];
    const seen = new Set();
    for (const dec of COLUMN_DECORATORS) {
        const re = new RegExp(`@${dec}\\b`, "g");
        let m;
        while ((m = re.exec(body))) {
            const { end } = extractDecoratorArgs(body, m.index, m[0]);
            const prop = propertyNameAfter(body, end);
            if (prop && !seen.has(prop)) {
                seen.add(prop);
                names.push(prop);
            }
        }
    }
    return names;
}
export function listEntities(text) {
    const blocks = parseClassBlocks(text);
    const entities = [];
    for (const b of blocks) {
        const info = entityDecoratorInfo(b.decoratorsBefore);
        if (!info.isEntity)
            continue;
        const ent = {
            name: b.name,
            columns: listColumnNamesInBody(b.body),
        };
        if (info.tableName)
            ent.tableName = info.tableName;
        entities.push(ent);
    }
    return { entities, count: entities.length };
}
export function listRelations(text) {
    const blocks = parseClassBlocks(text);
    const relations = [];
    for (const b of blocks) {
        const info = entityDecoratorInfo(b.decoratorsBefore);
        // Also pick relations from any class that has relation decorators
        // (even if @Entity missed) but prefer entity-scoped.
        const isEntity = info.isEntity;
        for (const kind of RELATION_DECORATORS) {
            const re = new RegExp(`@${kind}\\b`, "g");
            let m;
            while ((m = re.exec(b.body))) {
                const { args, end } = extractDecoratorArgs(b.body, m.index, m[0]);
                const field = propertyNameAfter(b.body, end);
                if (!field)
                    continue;
                const rel = { field, kind };
                if (isEntity)
                    rel.entity = b.name;
                const target = parseRelationTarget(args);
                if (target)
                    rel.target = target;
                relations.push(rel);
            }
        }
    }
    // Fallback: scan whole file if no class bodies matched (unusual)
    if (relations.length === 0) {
        const cleaned = stripComments(text ?? "");
        for (const kind of RELATION_DECORATORS) {
            const re = new RegExp(`@${kind}\\b`, "g");
            let m;
            while ((m = re.exec(cleaned))) {
                const { args, end } = extractDecoratorArgs(cleaned, m.index, m[0]);
                const field = propertyNameAfter(cleaned, end);
                if (!field)
                    continue;
                const rel = { field, kind };
                const target = parseRelationTarget(args);
                if (target)
                    rel.target = target;
                relations.push(rel);
            }
        }
    }
    return { relations, count: relations.length };
}
export function listColumns(text) {
    const blocks = parseClassBlocks(text);
    const columns = [];
    for (const b of blocks) {
        const info = entityDecoratorInfo(b.decoratorsBefore);
        const entityName = info.isEntity ? b.name : undefined;
        for (const dec of COLUMN_DECORATORS) {
            const re = new RegExp(`@${dec}\\b`, "g");
            let m;
            while ((m = re.exec(b.body))) {
                const { args, end } = extractDecoratorArgs(b.body, m.index, m[0]);
                const name = propertyNameAfter(b.body, end);
                if (!name)
                    continue;
                const col = { name };
                if (entityName)
                    col.entity = entityName;
                const typ = parseOptionType(args);
                if (typ)
                    col.type = typ;
                const isPrimary = dec === "PrimaryColumn" ||
                    dec === "PrimaryGeneratedColumn" ||
                    dec === "ObjectIdColumn";
                if (isPrimary)
                    col.primary = true;
                const unique = parseOptionBool(args, "unique");
                if (unique !== undefined)
                    col.unique = unique;
                const nullable = parseOptionBool(args, "nullable");
                if (nullable !== undefined)
                    col.nullable = nullable;
                columns.push(col);
            }
        }
    }
    return { columns, count: columns.length };
}
function hasDataSource(text) {
    return (/\bDataSource\b/.test(text) ||
        /\bcreateConnection\s*\(/.test(text) ||
        /\bTypeOrmModule\.forRoot/.test(text));
}
function hasSynchronizeTrue(text) {
    return (/\bsynchronize\s*:\s*true\b/.test(text) ||
        /\bsync\s*:\s*true\b/.test(text));
}
function hasPlaintextPassword(text) {
    // password: '...' or password: "..." with non-empty literal (not env/process)
    return /\bpassword\s*:\s*['"][^'"]+['"]/.test(text);
}
function classHasPrimary(body) {
    return (/@PrimaryGeneratedColumn\b/.test(body) ||
        /@PrimaryColumn\b/.test(body) ||
        /@ObjectIdColumn\b/.test(body));
}
function oneToOneMissingJoinColumn(body) {
    // For each @OneToOne, check if nearby (before property) has @JoinColumn
    const findings = [];
    const re = /@OneToOne\b/g;
    let m;
    while ((m = re.exec(body))) {
        const { end } = extractDecoratorArgs(body, m.index, m[0]);
        // Look at decorator stack from this decorator to the property
        const window = body.slice(m.index, Math.min(body.length, end + 200));
        const prop = propertyNameAfter(body, end);
        if (!prop)
            continue;
        // Owning side usually has @JoinColumn; inverse may use mappedBy / (type, inverse)
        const argsMatch = extractDecoratorArgs(body, m.index, m[0]);
        const hasInverseSide = /,\s*(?:['"]|[A-Za-z_(])/.test(argsMatch.args) &&
            /\(\s*\w+\s*\)\s*=>/.test(argsMatch.args);
        // Heuristic: if second arg looks like inverse side callback, skip
        const parts = splitTopLevelCommas(argsMatch.args);
        const looksInverseOnly = parts.length >= 2 &&
            /\(\s*\w+\s*\)\s*=>/.test(parts[1] ?? "") &&
            !/@JoinColumn\b/.test(window);
        // Flag missing JoinColumn when OneToOne present and no JoinColumn in local window,
        // and not clearly only inverse (still soft warn for any OneToOne without JoinColumn)
        const hasJoin = /@JoinColumn\b/.test(window);
        if (!hasJoin && !looksInverseOnly) {
            findings.push(true);
        }
        else if (!hasJoin && looksInverseOnly) {
            // inverse side — ok without JoinColumn
        }
        else if (!hasJoin) {
            findings.push(true);
        }
    }
    return findings;
}
function splitTopLevelCommas(s) {
    const parts = [];
    let depthParen = 0;
    let depthBrace = 0;
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
        if (c === "," && depthParen === 0 && depthBrace === 0) {
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
export function lintEntities(text) {
    const findings = [];
    const raw = text ?? "";
    if (!raw.trim()) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Source text is empty. Paste TypeORM entity class(es) with @Entity decorators.",
        });
        return findings;
    }
    const cleaned = stripComments(raw);
    const blocks = parseClassBlocks(raw);
    const entities = blocks.filter((b) => entityDecoratorInfo(b.decoratorsBefore).isEntity);
    if (entities.length === 0) {
        findings.push({
            severity: "warn",
            rule: "no_entities",
            advice: "No `@Entity()` classes found. Ensure entity classes are decorated with @Entity.",
        });
    }
    for (const e of entities) {
        if (!classHasPrimary(e.body)) {
            findings.push({
                severity: "warn",
                rule: "entity_without_primary",
                advice: `Entity "${e.name}" has no @PrimaryColumn / @PrimaryGeneratedColumn / @ObjectIdColumn — TypeORM entities usually need a primary key.`,
            });
        }
        const cols = listColumnNamesInBody(e.body);
        if (cols.length === 0) {
            findings.push({
                severity: "info",
                rule: "entity_without_columns",
                advice: `Entity "${e.name}" has no @Column / @Primary* decorations detected.`,
            });
        }
        const missingJC = oneToOneMissingJoinColumn(e.body);
        if (missingJC.length > 0) {
            findings.push({
                severity: "warn",
                rule: "onetoone_missing_joincolumn",
                advice: `Entity "${e.name}" has @OneToOne without a nearby @JoinColumn — the owning side of OneToOne usually needs @JoinColumn (inverse side may omit it).`,
            });
        }
    }
    // Duplicate entity class names
    const seen = new Map();
    for (const e of entities) {
        seen.set(e.name, (seen.get(e.name) ?? 0) + 1);
    }
    for (const [name, count] of seen) {
        if (count > 1) {
            findings.push({
                severity: "error",
                rule: "duplicate_entity_name",
                advice: `Entity class name "${name}" appears ${count} times.`,
            });
        }
    }
    if (hasDataSource(cleaned) && hasSynchronizeTrue(cleaned)) {
        findings.push({
            severity: "warn",
            rule: "synchronize_true_smell",
            advice: "`synchronize: true` (or `sync: true`) detected near a DataSource/connection — avoid auto-sync in production; prefer migrations.",
        });
    }
    if (hasDataSource(cleaned) && hasPlaintextPassword(cleaned)) {
        findings.push({
            severity: "error",
            rule: "plaintext_password_in_datasource",
            advice: "DataSource/connection options include a plaintext `password: '...'` literal. Prefer env vars (e.g. process.env.DB_PASSWORD) and keep secrets out of source.",
        });
    }
    else if (hasPlaintextPassword(cleaned) && /password\s*:/.test(cleaned)) {
        // Soft note if password literal appears even without clear DataSource keyword
        if (/\btype\s*:\s*['"]?(?:postgres|mysql|mariadb|sqlite|mssql|oracle)/i.test(cleaned)) {
            findings.push({
                severity: "error",
                rule: "plaintext_password_in_datasource",
                advice: "Connection-like options include a plaintext `password` literal. Prefer env vars and keep secrets out of source.",
            });
        }
    }
    // @Entity() without table name tip when class is PascalCase multi-word
    for (const e of entities) {
        const info = entityDecoratorInfo(e.decoratorsBefore);
        if (!info.tableName && /[a-z][A-Z]/.test(e.name)) {
            findings.push({
                severity: "info",
                rule: "missing_table_name_tip",
                advice: `Entity "${e.name}" has no explicit table name — consider @Entity('snake_case_table') if the DB table differs from the default naming strategy.`,
            });
        }
    }
    return findings;
}
