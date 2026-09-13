import { extractBuilds, parseYamlDocs, parseYamlObject, } from "../lib/skaffold_heuristics.js";
export function skBuildsHint(input) {
    const text = input.text ?? "";
    const trimmed = text.trim();
    if (!trimmed) {
        return { builds: [], count: 0 };
    }
    let docs = parseYamlDocs(trimmed);
    if (docs.length === 0) {
        const raw = parseYamlObject(trimmed);
        if (raw !== null)
            docs = [raw];
    }
    const builds = [];
    for (const doc of docs) {
        builds.push(...extractBuilds(doc));
    }
    return { builds, count: builds.length };
}
