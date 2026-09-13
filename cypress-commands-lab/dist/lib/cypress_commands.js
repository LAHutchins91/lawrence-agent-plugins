/**
 * Best-effort Cypress support/commands JS/TS text heuristics.
 * No Cypress / browser runtime, no network, no filesystem follow, no eval / no TS AST.
 * Distinct from cypress-config-lab (config heuristics).
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
function countOccurrences(text, re) {
    let n = 0;
    const r = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    while (r.exec(text))
        n++;
    return n;
}
/** Parse string literal at top-level arg index. */
function stringArgAt(args, which) {
    let depth = 0;
    let inString = false;
    let quote = "";
    let argIndex = 0;
    let i = 0;
    const s = args;
    while (i < s.length) {
        const c = s[i];
        if (inString) {
            if (c === "\\" && i + 1 < s.length) {
                i += 2;
                continue;
            }
            if (c === quote)
                inString = false;
            i++;
            continue;
        }
        if (c === '"' || c === "'" || c === "`") {
            if (argIndex === which && depth === 0) {
                quote = c;
                i++;
                let out = "";
                while (i < s.length) {
                    const ch = s[i];
                    if (ch === "\\" && i + 1 < s.length) {
                        out += s[i + 1];
                        i += 2;
                        continue;
                    }
                    if (ch === quote)
                        return out;
                    out += ch;
                    i++;
                }
                return out;
            }
            inString = true;
            quote = c;
            i++;
            continue;
        }
        if (c === "(" || c === "[" || c === "{") {
            depth++;
            i++;
            continue;
        }
        if (c === ")" || c === "]" || c === "}") {
            depth = Math.max(0, depth - 1);
            i++;
            continue;
        }
        if (c === "," && depth === 0) {
            argIndex++;
            i++;
            continue;
        }
        i++;
    }
    return undefined;
}
/** First top-level arg slice (trimmed) — for method constants like GET. */
function argSliceAt(args, which) {
    let depth = 0;
    let inString = false;
    let quote = "";
    let argIndex = 0;
    let start = 0;
    let i = 0;
    const s = args;
    while (start < s.length && /\s/.test(s[start]))
        start++;
    i = start;
    while (i < s.length) {
        const c = s[i];
        if (inString) {
            if (c === "\\" && i + 1 < s.length) {
                i += 2;
                continue;
            }
            if (c === quote)
                inString = false;
            i++;
            continue;
        }
        if (c === '"' || c === "'" || c === "`") {
            inString = true;
            quote = c;
            i++;
            continue;
        }
        if (c === "(" || c === "[" || c === "{") {
            depth++;
            i++;
            continue;
        }
        if (c === ")" || c === "]" || c === "}") {
            depth = Math.max(0, depth - 1);
            i++;
            continue;
        }
        if (c === "," && depth === 0) {
            if (argIndex === which) {
                return s.slice(start, i).trim();
            }
            argIndex++;
            i++;
            while (i < s.length && /\s/.test(s[i]))
                i++;
            start = i;
            continue;
        }
        i++;
    }
    if (argIndex === which) {
        const t = s.slice(start).trim();
        return t || undefined;
    }
    return undefined;
}
const HTTP_METHODS = new Set([
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "HEAD",
    "OPTIONS",
    "CONNECT",
    "TRACE",
    "ALL",
]);
/**
 * List custom commands from Cypress.Commands.add( / addAll( / overwrite(
 */
export function listCommands(text) {
    const cleaned = stripComments(text ?? "");
    const commands = [];
    const seen = new Set();
    const push = (info, index) => {
        const key = `${info.name}|${info.overwrite ? 1 : 0}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        commands.push(info);
    };
    // Cypress.Commands.add('name', ...) / Cypress.Commands.overwrite('name', ...)
    const addOverwriteRe = /\bCypress\s*\.\s*Commands\s*\.\s*(add|overwrite)\s*\(/g;
    let m;
    while ((m = addOverwriteRe.exec(cleaned))) {
        const kind = m[1];
        const open = m.index + m[0].length - 1;
        const close = findMatchingParen(cleaned, open);
        let name = "unknown";
        if (close >= 0) {
            const args = cleaned.slice(open + 1, close);
            const n = stringArgAt(args, 0);
            if (n !== undefined && n.length > 0)
                name = n;
        }
        push(kind === "overwrite" ? { name, overwrite: true } : { name }, m.index);
    }
    // Cypress.Commands.addAll({ login() {}, ... }) / addAll({ login: (...) => {} })
    const addAllRe = /\bCypress\s*\.\s*Commands\s*\.\s*addAll\s*\(/g;
    while ((m = addAllRe.exec(cleaned))) {
        const open = m.index + m[0].length - 1;
        const close = findMatchingParen(cleaned, open);
        if (close < 0) {
            push({ name: "addAll" }, m.index);
            continue;
        }
        const args = cleaned.slice(open + 1, close);
        // Find first top-level object literal
        const objStart = args.search(/\{/);
        if (objStart < 0) {
            push({ name: "addAll" }, m.index);
            continue;
        }
        // Extract balanced object from args
        let depth = 0;
        let inStr = false;
        let q = "";
        let end = -1;
        for (let i = objStart; i < args.length; i++) {
            const c = args[i];
            if (inStr) {
                if (c === "\\" && i + 1 < args.length) {
                    i++;
                    continue;
                }
                if (c === q)
                    inStr = false;
                continue;
            }
            if (c === '"' || c === "'" || c === "`") {
                inStr = true;
                q = c;
                continue;
            }
            if (c === "{")
                depth++;
            else if (c === "}") {
                depth--;
                if (depth === 0) {
                    end = i;
                    break;
                }
            }
        }
        const body = end >= 0 ? args.slice(objStart + 1, end) : args.slice(objStart + 1);
        // Method shorthand: name(...) { / name: function / name: (
        const nameRe = /(?:^|[,{])\s*(?:async\s+)?([A-Za-z_$][\w$]*)\s*(?::|\()/g;
        let nm;
        let found = 0;
        while ((nm = nameRe.exec(body))) {
            const n = nm[1];
            if (["function", "async", "return", "const", "let", "var"].includes(n))
                continue;
            push({ name: n }, m.index + nm.index);
            found++;
        }
        if (found === 0)
            push({ name: "addAll" }, m.index);
    }
    return { commands, count: commands.length };
}
/**
 * List aliases from .as('alias') and @alias usages.
 */
export function listAliases(text) {
    const cleaned = stripComments(text ?? "");
    const aliases = [];
    const seen = new Set();
    const push = (name, index) => {
        const key = `${name}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        aliases.push({ name });
    };
    // .as('alias') / .as("alias") / .as(`alias`)
    const asRe = /\.\s*as\s*\(\s*(['"`])([^'"`\\]+(?:\\.[^'"`\\]*)*)\1\s*\)/g;
    let m;
    while ((m = asRe.exec(cleaned))) {
        const name = m[2].replace(/\\(.)/g, "$1").trim();
        if (name)
            push(name, m.index);
    }
    // @alias in cy.get('@alias') / cy.wait('@alias') / strings containing @name
    // Also bare @alias in cy.get("@users") already covered by string; also
    // cy.get(`@${x}`) skip. Match @ident inside string args of cy.* and standalone.
    const atInStringRe = /(['"`])@([A-Za-z_$][\w$-]*)\1/g;
    while ((m = atInStringRe.exec(cleaned))) {
        push(m[2], m.index);
    }
    // Template / concat uncommon — also cy.wait('@getUsers') already covered
    return { aliases, count: aliases.length };
}
/**
 * List intercepts from cy.intercept( / cy.route( (legacy).
 */
export function listIntercepts(text) {
    const cleaned = stripComments(text ?? "");
    const intercepts = [];
    const seen = new Set();
    const push = (info, index) => {
        const key = `${info.method ?? ""}|${info.url ?? ""}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        intercepts.push(info);
    };
    const callRe = /\bcy\s*\.\s*(intercept|route)\s*\(/g;
    let m;
    while ((m = callRe.exec(cleaned))) {
        const open = m.index + m[0].length - 1;
        const close = findMatchingParen(cleaned, open);
        const info = {};
        if (close >= 0) {
            const args = cleaned.slice(open + 1, close);
            const a0 = stringArgAt(args, 0);
            const a1 = stringArgAt(args, 1);
            const slice0 = argSliceAt(args, 0);
            // Patterns:
            // cy.intercept('GET', '/api/users')
            // cy.intercept('/api/users')
            // cy.intercept({ method: 'GET', url: '/api' })
            // cy.route('GET', '/users')
            // cy.route('/users')
            if (a0 !== undefined && HTTP_METHODS.has(a0.toUpperCase())) {
                info.method = a0.toUpperCase();
                if (a1 !== undefined)
                    info.url = a1;
            }
            else if (a0 !== undefined) {
                // First string is URL (or method-like path)
                info.url = a0;
                // Optional: object form may have been first arg without string — handled below
            }
            else if (slice0 && slice0.startsWith("{")) {
                const methodM = slice0.match(/\bmethod\s*:\s*(['"`])([A-Za-z]+)\1/);
                const urlM = slice0.match(/\burl\s*:\s*(['"`])([^'"`]+)\1/);
                if (methodM)
                    info.method = methodM[2].toUpperCase();
                if (urlM)
                    info.url = urlM[2];
            }
            else if (slice0) {
                // RegExp URL: /api\/users/
                const reLit = slice0.match(/^\/(?:\\\/|[^/\n])+\/[gimsuy]*$/);
                if (reLit)
                    info.url = slice0.trim();
            }
            // Second arg string when first was object already handled; when first was method const
            if (!info.url && a1 !== undefined && info.method) {
                info.url = a1;
            }
        }
        push(info, m.index);
    }
    return { intercepts, count: intercepts.length };
}
export function lintCypressCommands(text) {
    const findings = [];
    const raw = text ?? "";
    if (!raw.trim()) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Source text is empty. Paste Cypress support/commands or spec JS/TS (e.g. Cypress.Commands.add(...) / cy.get(...).as('x') / cy.intercept(...) / cy.wait('@x')).",
        });
        return findings;
    }
    const cleaned = stripComments(raw);
    const { commands } = listCommands(cleaned);
    const { aliases } = listAliases(cleaned);
    const { intercepts } = listIntercepts(cleaned);
    const hasCy = /\bCypress\s*\.\s*Commands\b/.test(cleaned) ||
        /\bcy\s*\.\s*[a-zA-Z]/.test(cleaned) ||
        /\bdescribe\s*\(/.test(cleaned) ||
        /\bit\s*\(/.test(cleaned) ||
        commands.length > 0 ||
        aliases.length > 0 ||
        intercepts.length > 0;
    if (!hasCy) {
        findings.push({
            severity: "warn",
            rule: "no_cypress_commands_detected",
            advice: "No `Cypress.Commands` / `cy.*` / `.as(` / `cy.intercept` patterns detected. Confirm this is Cypress support, commands, or spec source (not cypress.config — use cypress-config-lab for config).",
        });
    }
    // cy.wait(number) anti-pattern
    const waitNumberCount = countOccurrences(cleaned, /\bcy\s*\.\s*wait\s*\(\s*\d+\s*\)/g);
    if (waitNumberCount >= 1) {
        findings.push({
            severity: "warn",
            rule: "cy_wait_number_antipattern",
            advice: `Found ${waitNumberCount}× \`cy.wait(<number>)\` — prefer \`cy.wait('@alias')\` after \`cy.intercept(...).as('alias')\`, or assert on UI/network conditions instead of fixed delays.`,
        });
    }
    // .then() overuse tip
    const thenCount = countOccurrences(cleaned, /\.\s*then\s*\(/g);
    if (thenCount >= 4) {
        findings.push({
            severity: "info",
            rule: "then_overuse_tip",
            advice: `Found ${thenCount}× \`.then(\` chains. Prefer Cypress command chaining and built-in retryability (\`cy.get\` / \`should\`) over nested \`.then\` callbacks when possible; use \`.then\` mainly to work with yielded values.`,
        });
    }
    // missing data-cy / data-testid tip when many brittle selectors
    const cssIdClassHeavy = countOccurrences(cleaned, /\bcy\s*\.\s*get\s*\(\s*['"`][#.][^'"`]+['"`]/g) +
        countOccurrences(cleaned, /\bcy\s*\.\s*get\s*\(\s*['"`][a-z]+(?:\.[a-zA-Z_-]+)+['"`]/g);
    const dataCyCount = countOccurrences(cleaned, /\bcy\s*\.\s*get\s*\(\s*['"`]\[[^\]]*(?:data-cy|data-testid|data-test)[^\]]*\]['"`]/g) +
        countOccurrences(cleaned, /\bcy\s*\.\s*get\s*\(\s*['"`]\[data-cy=/g);
    const getCount = countOccurrences(cleaned, /\bcy\s*\.\s*get\s*\(/g);
    if (getCount >= 3 && dataCyCount === 0 && cssIdClassHeavy >= 2) {
        findings.push({
            severity: "info",
            rule: "missing_data_cy_tip",
            advice: "Several `cy.get` calls use CSS id/class selectors without `data-cy` / `data-testid` attributes. Prefer stable test attributes (e.g. `cy.get('[data-cy=submit]')`) so refactors to styles/markup are less brittle.",
        });
    }
    // cy.route deprecated tip
    const routeCount = countOccurrences(cleaned, /\bcy\s*\.\s*route\s*\(/g);
    if (routeCount >= 1) {
        findings.push({
            severity: "warn",
            rule: "route_deprecated_tip",
            advice: `Found ${routeCount}× \`cy.route(\` — deprecated since Cypress 6+. Migrate to \`cy.intercept(\` (and \`cy.wait('@alias')\`) for network stubbing and spying.`,
        });
    }
    // cy.pause / cy.debug leftover tip
    if (/\bcy\s*\.\s*(?:pause|debug)\s*\(/.test(cleaned)) {
        findings.push({
            severity: "info",
            rule: "pause_debug_leftover_tip",
            advice: "`cy.pause()` / `cy.debug()` found — useful locally, but remove or gate before CI so runs do not hang waiting for interactive resume.",
        });
    }
    // Force: true overuse
    const forceCount = countOccurrences(cleaned, /\{\s*[^}]*\bforce\s*:\s*true\b/g);
    if (forceCount >= 2) {
        findings.push({
            severity: "info",
            rule: "force_true_overuse_tip",
            advice: `Found ${forceCount}× \`{ force: true }\`. Prefer making the element actionable (scroll into view, wait for visibility, fix overlays) instead of forcing clicks that bypass Cypress actionability checks.`,
        });
    }
    // Custom command without TypeScript Chainable tip (soft)
    if (commands.length >= 1 &&
        !/namespace\s+Cypress\b|interface\s+Chainable\b/.test(cleaned)) {
        findings.push({
            severity: "info",
            rule: "commands_without_chainable_types_tip",
            advice: "`Cypress.Commands.add` / `overwrite` / `addAll` found without a nearby `Cypress.Chainable` / `namespace Cypress` declaration in this text. For TypeScript projects, declare custom commands on `Cypress.Chainable` so `cy.myCommand()` type-checks.",
        });
    }
    // Intercept without alias tip
    if (intercepts.length >= 2 && aliases.length === 0) {
        findings.push({
            severity: "info",
            rule: "intercept_without_alias_tip",
            advice: "Multiple `cy.intercept` / `cy.route` calls without `.as('...')` in this text. Alias intercepts and wait with `cy.wait('@alias')` for deterministic network assertions.",
        });
    }
    return findings;
}
