import { extractResources } from "../lib/tilt_heuristics.js";
export function tiltResourcesList(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { resources: [], count: 0 };
    }
    const resources = extractResources(text);
    return { resources, count: resources.length };
}
