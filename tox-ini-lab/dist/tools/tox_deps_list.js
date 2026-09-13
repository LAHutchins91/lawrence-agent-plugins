import { getTestenvSections, parseToxIni, splitDepsItems, testenvName, } from "../lib/toxini.js";
/**
 * From deps = lines across [testenv] / [testenv:NAME].
 */
export function toxDepsList(args) {
    const parsed = parseToxIni(args.text ?? "");
    const sections = getTestenvSections(parsed);
    const deps = [];
    const seen = new Set();
    const unique = [];
    for (const sec of sections) {
        const raw = sec.props["deps"];
        if (raw === undefined)
            continue;
        const items = splitDepsItems(raw);
        const env = testenvName(sec);
        for (const pkg of items) {
            deps.push({ env, package: pkg });
            if (!seen.has(pkg)) {
                seen.add(pkg);
                unique.push(pkg);
            }
        }
    }
    return { deps, unique, count: deps.length };
}
