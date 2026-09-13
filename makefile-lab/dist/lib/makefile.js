/**
 * Shared Makefile text helpers.
 * String heuristics only — no make binary, no network, no shell.
 */
const SPECIAL_TARGETS = new Set([
    ".PHONY",
    ".SUFFIXES",
    ".DEFAULT",
    ".PRECIOUS",
    ".INTERMEDIATE",
    ".SECONDARY",
    ".SECONDEXPANSION",
    ".DELETE_ON_ERROR",
    ".IGNORE",
    ".LOW_RESOLUTION_TIME",
    ".SILENT",
    ".EXPORT_ALL_VARIABLES",
    ".NOTPARALLEL",
    ".ONESHELL",
    ".POSIX",
    ".WAIT",
    ".NOTINTERMEDIATE",
    ".DEFAULT_GOAL",
    ".EXTRA_PREREQS",
    ".FEATURES",
    ".INCLUDE_DIRS",
    ".LIBPATTERNS",
    ".LOADED",
    ".RECIPEPREFIX",
    ".VARIABLES",
]);
const DIRECTIVE_RE = /^(ifeq|ifneq|ifdef|ifndef|else|endif|include|-include|sinclude|define|endef|unexport|vpath|undefine)\b/;
const ASSIGN_RE = /^(?:export\s+|override\s+)*([A-Za-z_.][A-Za-z0-9_.]*)\s*(:::=|::=|\+=|\?=|!=|:=|=)\s*(.*)$/;
const COMMON_PHONY = ["all", "clean", "test", "install", "check", "distclean", "uninstall"];
const WELL_KNOWN_VARS = new Set([
    "MAKE",
    "MAKEFLAGS",
    "MAKECMDGOALS",
    "MAKELEVEL",
    "MAKEFILES",
    "MAKEFILE_LIST",
    "MAKE_VERSION",
    "MAKE_HOST",
    "CURDIR",
    "SHELL",
    "CC",
    "CXX",
    "CPP",
    "AS",
    "AR",
    "ARFLAGS",
    "RM",
    "INSTALL",
    "LD",
    "LEX",
    "YACC",
    "CFLAGS",
    "CXXFLAGS",
    "CPPFLAGS",
    "LDFLAGS",
    "LDLIBS",
    "ASFLAGS",
    "VPATH",
    "DESTDIR",
    "PREFIX",
    "BINDIR",
    "LIBDIR",
    "INCLUDEDIR",
    "DATADIR",
    "MANDIR",
    "SYSCONFDIR",
    "CROSS_COMPILE",
    "TARGET_ARCH",
    "OUTPUT_OPTION",
    ".DEFAULT_GOAL",
    ".RECIPEPREFIX",
    ".FEATURES",
    ".INCLUDE_DIRS",
    ".VARIABLES",
    ".EXTRA_PREREQS",
]);
const MAKE_FUNCTIONS = new Set([
    "wildcard",
    "shell",
    "patsubst",
    "subst",
    "strip",
    "findstring",
    "filter",
    "filter-out",
    "sort",
    "word",
    "wordlist",
    "words",
    "firstword",
    "lastword",
    "dir",
    "notdir",
    "suffix",
    "basename",
    "addsuffix",
    "addprefix",
    "join",
    "if",
    "or",
    "and",
    "foreach",
    "call",
    "eval",
    "origin",
    "flavor",
    "error",
    "warning",
    "info",
    "abspath",
    "realpath",
    "value",
    "file",
    "let",
    "intcmp",
    "guile",
]);
function normalizeNewlines(text) {
    return (text ?? "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}
function stripComment(line) {
    let out = "";
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === "\\") {
            out += ch + (line[i + 1] ?? "");
            i++;
            continue;
        }
        if (ch === "#")
            break;
        out += ch;
    }
    return out;
}
function flavorOf(op) {
    switch (op) {
        case "=":
            return "recursive";
        case ":=":
            return "simple";
        case "?=":
            return "conditional";
        case "+=":
            return "append";
        case "!=":
            return "shell";
        case "::=":
            return "posix";
        case ":::=":
            return "immediate";
        default:
            return "recursive";
    }
}
function parseAssignment(trimmed) {
    const m = trimmed.match(ASSIGN_RE);
    if (!m)
        return null;
    return { name: m[1], op: m[2], value: m[3].replace(/\s+$/, "") };
}
function tokenize(s) {
    return s
        .trim()
        .split(/\s+/)
        .map((t) => t.trim())
        .filter(Boolean);
}
function isPatternName(name) {
    return name.includes("%");
}
function parseRule(trimmed) {
    if (parseAssignment(trimmed))
        return null;
    const idx = trimmed.indexOf(":");
    if (idx < 0)
        return null;
    const left = trimmed.slice(0, idx).trim();
    if (!left)
        return null;
    let rest = trimmed.slice(idx + 1);
    let doubleColon = false;
    if (rest.startsWith(":")) {
        doubleColon = true;
        rest = rest.slice(1);
    }
    // Static pattern: "objs: %.o: %.c" — skip as messy
    const restTrim = rest.trim();
    const another = restTrim.indexOf(":");
    if (!doubleColon && another >= 0 && !restTrim.slice(0, another).includes("=")) {
        return { targets: tokenize(left), deps: [], doubleColon: false, staticPattern: true };
    }
    return {
        targets: tokenize(left),
        deps: tokenize(rest),
        doubleColon,
        staticPattern: false,
    };
}
function isDirective(trimmed) {
    if (parseAssignment(trimmed))
        return false;
    return DIRECTIVE_RE.test(trimmed) || /^export\s*$/.test(trimmed) || /^export\s+[A-Za-z_.]/.test(trimmed);
}
function collectVarRefs(text) {
    const names = [];
    const re = /\$\(([^)]+)\)|\$\{([^}]+)\}/g;
    let m;
    while ((m = re.exec(text))) {
        const inner = (m[1] ?? m[2] ?? "").trim();
        const ident = inner.split(/[\s,:(]/)[0] ?? "";
        if (/^[A-Za-z_.][A-Za-z0-9_.]*$/.test(ident)) {
            names.push(ident);
        }
    }
    return names;
}
export function parseMakefileText(text) {
    const raw = normalizeNewlines(text ?? "");
    const physical = raw.split("\n");
    const findings = [];
    const targets = [];
    const phony = [];
    const vars = [];
    const targetSeen = new Map();
    const doubleColon = new Set();
    const contentish = physical.some((ln) => {
        const t = stripComment(ln).trim();
        return t.length > 0;
    });
    const empty = !contentish;
    let afterRule = false;
    let i = 0;
    while (i < physical.length) {
        const lineNo = i + 1;
        let line = physical[i];
        // Join backslash continuations (physical start line kept)
        while (line.endsWith("\\") && !line.endsWith("\\\\") && i + 1 < physical.length) {
            i++;
            line = line.slice(0, -1) + " " + physical[i].replace(/^\s+/, "");
        }
        const startsWithTab = line.startsWith("\t");
        const startsWithSpaces = /^ +/.test(line) && !startsWithTab;
        if (startsWithTab) {
            // recipe or stray tab line
            i++;
            continue;
        }
        const stripped = stripComment(line);
        const trimmed = stripped.trim();
        if (!trimmed) {
            i++;
            continue;
        }
        if (afterRule && startsWithSpaces && !parseAssignment(trimmed) && !parseRule(trimmed) && !isDirective(trimmed)) {
            findings.push({
                severity: "error",
                rule: "recipe_spaces",
                advice: `Line ${lineNo} looks like a recipe but starts with spaces, not a tab. GNU make recipes must begin with a tab.`,
            });
            i++;
            continue;
        }
        const assign = parseAssignment(trimmed);
        if (assign) {
            afterRule = false;
            vars.push({
                name: assign.name,
                value: assign.value,
                flavor: flavorOf(assign.op),
            });
            i++;
            continue;
        }
        if (isDirective(trimmed)) {
            afterRule = false;
            i++;
            continue;
        }
        const rule = parseRule(trimmed);
        if (rule) {
            afterRule = true;
            const isPhonyDecl = rule.targets.length === 1 && rule.targets[0] === ".PHONY";
            if (isPhonyDecl) {
                for (const name of rule.deps) {
                    if (name && !phony.includes(name))
                        phony.push(name);
                }
                i++;
                continue;
            }
            if (rule.staticPattern) {
                i++;
                continue;
            }
            for (const name of rule.targets) {
                if (SPECIAL_TARGETS.has(name))
                    continue;
                if (isPatternName(name))
                    continue;
                const entry = { name, line: lineNo };
                if (rule.deps.length)
                    entry.deps = rule.deps;
                targets.push(entry);
                const lines = targetSeen.get(name) ?? [];
                lines.push(lineNo);
                targetSeen.set(name, lines);
                if (rule.doubleColon)
                    doubleColon.add(name);
            }
            i++;
            continue;
        }
        afterRule = false;
        i++;
    }
    if (empty) {
        findings.push({
            severity: "info",
            rule: "empty_file",
            advice: "Makefile text is empty or comment-only — nothing to parse.",
        });
    }
    const assigned = new Set(vars.map((v) => v.name));
    const phonySet = new Set(phony);
    const targetNames = new Set(targets.map((t) => t.name));
    const missingPhony = COMMON_PHONY.filter((n) => targetNames.has(n) && !phonySet.has(n));
    if (missingPhony.length) {
        findings.push({
            severity: "warning",
            rule: "missing_phony",
            advice: `Common targets without .PHONY: ${missingPhony.join(", ")}. Mark them .PHONY so a same-named file cannot shadow the rule.`,
        });
    }
    if (/\$\(MAKE\)|\$\{MAKE\}|(^|[\s;|&])make\s+-[Ccf]/.test(raw)) {
        findings.push({
            severity: "warning",
            rule: "recursive_make",
            advice: "Recursive make smell ($(MAKE) / make -C / make -f). Prefer a single make graph or documented subdir contract — heuristic only.",
        });
    }
    const refs = collectVarRefs(raw);
    const undefinedSeen = new Set();
    for (const name of refs) {
        if (assigned.has(name))
            continue;
        if (WELL_KNOWN_VARS.has(name))
            continue;
        if (MAKE_FUNCTIONS.has(name))
            continue;
        if (undefinedSeen.has(name))
            continue;
        undefinedSeen.add(name);
        findings.push({
            severity: "info",
            rule: "undefined_var",
            advice: `$(${name}) is referenced but no assignment for ${name} was seen in this text (best-effort; ignores includes and implicit rules).`,
        });
    }
    for (const [name, lines] of targetSeen) {
        if (lines.length > 1 && !doubleColon.has(name)) {
            findings.push({
                severity: "warning",
                rule: "duplicate_target",
                advice: `Target "${name}" is defined more than once (lines ${lines.join(", ")}). Later explicit rules override or merge depending on make flavor.`,
            });
        }
    }
    return { targets, phony, vars, findings, empty };
}
export function listTargets(text) {
    const parsed = parseMakefileText(text);
    return { targets: parsed.targets, count: parsed.targets.length };
}
export function listPhony(text) {
    const parsed = parseMakefileText(text);
    return { phony: parsed.phony, count: parsed.phony.length };
}
export function lookupVars(text, name) {
    const parsed = parseMakefileText(text);
    const vars = name
        ? parsed.vars.filter((v) => v.name === name)
        : parsed.vars;
    return { vars, count: vars.length };
}
export function lintMakefile(text) {
    return parseMakefileText(text).findings;
}
