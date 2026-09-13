import { extractResources } from "../lib/arm_heuristics.js";
export function armResourcesList(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { resources: [], count: 0 };
    }
    const resources = extractResources(text);
    return { resources, count: resources.length };
}
