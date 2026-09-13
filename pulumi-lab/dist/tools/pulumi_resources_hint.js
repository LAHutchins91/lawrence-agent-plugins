import { extractResources } from "../lib/pulumi_heuristics.js";
export function pulumiResourcesHint(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { resources: [], count: 0 };
    }
    const resources = extractResources(text);
    return { resources, count: resources.length };
}
