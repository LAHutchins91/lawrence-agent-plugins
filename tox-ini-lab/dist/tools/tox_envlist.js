import { expandEnvlist, getToxSection, parseToxIni } from "../lib/toxini.js";
/**
 * From [tox] envlist= — best-effort expand simple py{310,311} style factors.
 */
export function toxEnvlist(args) {
    const parsed = parseToxIni(args.text ?? "");
    const tox = getToxSection(parsed);
    const raw = tox?.props["envlist"] ?? "";
    if (!raw.trim()) {
        return { envlist: [], count: 0 };
    }
    const { envlist, expanded } = expandEnvlist(raw);
    const needsExpand = expanded.length !== envlist.length || envlist.some((e) => e.includes("{"));
    // Always include expanded when factors were present or expansion differs
    const factorPresent = envlist.some((e) => e.includes("{")) || expanded.join(",") !== envlist.join(",");
    if (factorPresent || needsExpand) {
        return { envlist, expanded, count: expanded.length };
    }
    return { envlist, count: envlist.length };
}
