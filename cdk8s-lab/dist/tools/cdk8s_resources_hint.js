import { extractResources } from "../lib/cdk8s_heuristics.js";
export function cdk8sResourcesHint(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { resources: [], count: 0 };
    }
    const resources = extractResources(text);
    return { resources, count: resources.length };
}
