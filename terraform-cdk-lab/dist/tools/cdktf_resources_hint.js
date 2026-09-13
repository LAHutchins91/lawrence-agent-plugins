import { extractResources } from "../lib/cdktf_heuristics.js";
export function cdktfResourcesHint(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { resources: [], count: 0 };
    }
    const resources = extractResources(text);
    return { resources, count: resources.length };
}
