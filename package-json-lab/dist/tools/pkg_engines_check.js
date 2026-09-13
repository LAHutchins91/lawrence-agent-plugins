import semver from "semver";
import { asMap, parsePackageText } from "../lib/package.js";
function coerceEngines(raw) {
    const eng = asMap(raw?.engines);
    if (!eng)
        return undefined;
    const out = {};
    for (const [k, v] of Object.entries(eng)) {
        if (typeof v === "string" && v.trim() !== "") {
            out[k] = v.trim();
        }
        else if (typeof v === "number") {
            out[k] = String(v);
        }
    }
    return Object.keys(out).length ? out : undefined;
}
/**
 * Try to decide if nodeVersion satisfies engines.node using simple semver ranges.
 * Returns { ok, note } where ok is undefined if we cannot decide.
 */
function checkNodeRange(rangeRaw, nodeVersion) {
    const range = rangeRaw.trim();
    const version = nodeVersion.trim().replace(/^v/i, "");
    if (!semver.valid(version) && !semver.coerce(version)) {
        return {
            note: `Provided nodeVersion "${nodeVersion}" is not a valid semver; could not evaluate against engines.node "${range}".`,
        };
    }
    const ver = semver.valid(version) ?? semver.coerce(version)?.version;
    if (!ver) {
        return {
            note: `Could not coerce nodeVersion "${nodeVersion}" for comparison.`,
        };
    }
    // Complex / unsupported patterns → note only
    if (/[|]{2}|&&|\s+or\s+/i.test(range) && !semver.validRange(range)) {
        return {
            note: `engines.node range "${range}" looks complex; simple semver evaluation skipped.`,
        };
    }
    const validRange = semver.validRange(range);
    if (!validRange) {
        // Try a few common npm engine shortcuts
        if (/^>=?\s*\d+(\.\d+)?(\.\d+)?$/.test(range.replace(/\s+/g, ""))) {
            const cleaned = range.replace(/\s+/g, "");
            if (semver.validRange(cleaned) && semver.satisfies(ver, cleaned)) {
                return { ok: true, note: `Node ${ver} satisfies engines.node "${range}".` };
            }
            if (semver.validRange(cleaned)) {
                return { ok: false, note: `Node ${ver} does not satisfy engines.node "${range}".` };
            }
        }
        return {
            note: `engines.node "${range}" is not a simple semver range; could not evaluate against Node ${ver}.`,
        };
    }
    try {
        const ok = semver.satisfies(ver, validRange, { includePrerelease: true });
        return {
            ok,
            note: ok
                ? `Node ${ver} satisfies engines.node "${range}".`
                : `Node ${ver} does not satisfy engines.node "${range}".`,
        };
    }
    catch {
        return {
            note: `Could not evaluate engines.node "${range}" against Node ${ver}.`,
        };
    }
}
export function pkgEnginesCheck(input) {
    const doc = parsePackageText(input.text ?? "");
    const notes = [];
    if (doc.parseError) {
        notes.push(`Invalid JSON: ${doc.parseError}`);
        return { notes };
    }
    if (!doc.raw) {
        notes.push("No package.json content provided.");
        return { notes };
    }
    const engines = coerceEngines(doc.raw);
    const out = { notes };
    if (engines) {
        out.engines = engines;
    }
    else {
        notes.push("No engines field present.");
    }
    const nodeRange = engines?.node;
    const nodeVersion = input.nodeVersion?.trim();
    if (nodeVersion && nodeRange) {
        const result = checkNodeRange(nodeRange, nodeVersion);
        notes.push(result.note);
        if (result.ok !== undefined) {
            out.satisfies = result.ok;
        }
    }
    else if (nodeVersion && !nodeRange) {
        notes.push(`nodeVersion "${nodeVersion}" provided but engines.node is missing — nothing to compare.`);
    }
    else if (!nodeVersion && nodeRange) {
        notes.push(`engines.node is "${nodeRange}". Pass nodeVersion to evaluate satisfaction.`);
    }
    return out;
}
