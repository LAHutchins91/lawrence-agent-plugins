import { extractDeploys, parseYamlDocs, parseYamlObject, } from "../lib/skaffold_heuristics.js";
export function skDeploysHint(input) {
    const text = input.text ?? "";
    const trimmed = text.trim();
    if (!trimmed) {
        return { deploys: [], count: 0 };
    }
    let docs = parseYamlDocs(trimmed);
    if (docs.length === 0) {
        const raw = parseYamlObject(trimmed);
        if (raw !== null)
            docs = [raw];
    }
    const deploys = [];
    for (const doc of docs) {
        deploys.push(...extractDeploys(doc));
    }
    return { deploys, count: deploys.length };
}
