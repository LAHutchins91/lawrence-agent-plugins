import { extractPipeline, parseYamlDocs, parseYamlObject, } from "../lib/skaffold_heuristics.js";
export function skPipelinesList(input) {
    const text = input.text ?? "";
    const trimmed = text.trim();
    if (!trimmed) {
        return { pipelines: [], profiles: [], count: 0 };
    }
    let docs = parseYamlDocs(trimmed);
    if (docs.length === 0) {
        const raw = parseYamlObject(trimmed);
        if (raw !== null)
            docs = [raw];
    }
    const pipelines = [];
    const profileSet = new Set();
    for (const doc of docs) {
        const p = extractPipeline(doc);
        if (!p)
            continue;
        pipelines.push(p);
        for (const name of p.profiles ?? [])
            profileSet.add(name);
    }
    return {
        pipelines,
        profiles: [...profileSet],
        count: pipelines.length,
    };
}
