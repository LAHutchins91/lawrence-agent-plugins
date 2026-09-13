/**
 * Shared package.json text helpers.
 * String/JSON analysis only — no npm install, no network.
 */
export function asMap(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value;
    }
    return null;
}
export function parsePackageText(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed) {
        return { raw: null };
    }
    try {
        const raw = JSON.parse(trimmed);
        const map = asMap(raw);
        if (!map) {
            return {
                raw: null,
                parseError: "package.json root must be a JSON object",
            };
        }
        return { raw: map };
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { raw: null, parseError: msg };
    }
}
export function stringKeys(map) {
    if (!map)
        return [];
    return Object.keys(map).filter((k) => typeof k === "string").sort();
}
export function depKeys(raw, field) {
    if (!raw)
        return [];
    return stringKeys(asMap(raw[field]));
}
export function pkgName(raw) {
    if (!raw)
        return undefined;
    const n = raw.name;
    if (typeof n === "string" && n.trim() !== "")
        return n.trim();
    return undefined;
}
export function lintPackage(text, raw, parseError) {
    const findings = [];
    if (parseError) {
        findings.push({
            severity: "error",
            rule: "invalid_json",
            advice: `Could not parse package.json: ${parseError}`,
        });
        return findings;
    }
    if (!raw) {
        findings.push({
            severity: "info",
            rule: "empty_input",
            advice: "No package.json content provided.",
        });
        return findings;
    }
    if (typeof raw.name !== "string" || raw.name.trim() === "") {
        findings.push({
            severity: "warn",
            rule: "missing_name",
            advice: "Missing or empty top-level `name` field.",
        });
    }
    if (typeof raw.version !== "string" || raw.version.trim() === "") {
        findings.push({
            severity: "warn",
            rule: "missing_version",
            advice: "Missing or empty top-level `version` field (needed for publishable packages).",
        });
    }
    const isPrivate = raw.private === true;
    const publishConfig = asMap(raw.publishConfig);
    if (isPrivate && publishConfig) {
        findings.push({
            severity: "warn",
            rule: "private_publish_config",
            advice: "`private: true` with `publishConfig` present — unusual; confirm you do not intend to publish.",
        });
    }
    const depFields = [
        "dependencies",
        "devDependencies",
        "peerDependencies",
        "optionalDependencies",
    ];
    for (const field of depFields) {
        const map = asMap(raw[field]);
        if (!map)
            continue;
        for (const [name, range] of Object.entries(map)) {
            if (typeof range !== "string")
                continue;
            const r = range.trim();
            if (r === "*" || r === "x" || r === "X") {
                findings.push({
                    severity: "warn",
                    rule: "star_range",
                    advice: `${field}.${name} uses unrestricted range "${r}" — pin a range for reproducible installs.`,
                });
            }
            if (/^file:/i.test(r) || r.startsWith("./") || r.startsWith("../")) {
                findings.push({
                    severity: "info",
                    rule: "file_dependency",
                    advice: `${field}.${name} resolves via local path/file ("${r}") — not published from the registry.`,
                });
            }
            if (/^git(\+|hub:)/i.test(r) || /^github:/i.test(r) || r.includes("github.com/")) {
                findings.push({
                    severity: "info",
                    rule: "git_dependency",
                    advice: `${field}.${name} appears to be a git URL dependency ("${r}").`,
                });
            }
        }
    }
    const scripts = asMap(raw.scripts);
    if (scripts) {
        for (const [name, command] of Object.entries(scripts)) {
            if (typeof command !== "string")
                continue;
            const c = command;
            // Educational smell: curl|bash / wget|sh style pipes in scripts
            if (/curl\b[^|\n]*\|\s*(ba)?sh\b/i.test(c) ||
                /wget\b[^|\n]*\|\s*(ba)?sh\b/i.test(c) ||
                /\|\s*(ba)?sh\b/i.test(c) && /\b(curl|wget)\b/i.test(c)) {
                findings.push({
                    severity: "warn",
                    rule: "curl_pipe_shell",
                    advice: `scripts.${name} pipes remote download into a shell (curl|bash style) — review trust of the source.`,
                });
            }
        }
    }
    // Duplicate keys across deps and devDeps (smell)
    const deps = new Set(depKeys(raw, "dependencies"));
    const dev = new Set(depKeys(raw, "devDependencies"));
    for (const name of deps) {
        if (dev.has(name)) {
            findings.push({
                severity: "info",
                rule: "deps_dev_overlap",
                advice: `"${name}" appears in both dependencies and devDependencies.`,
            });
        }
    }
    return findings;
}
