import { extractSources } from "../lib/packer_heuristics.js";
export function packerSourcesHint(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { sources: [], count: 0 };
    }
    const sources = extractSources(text);
    return { sources, count: sources.length };
}
