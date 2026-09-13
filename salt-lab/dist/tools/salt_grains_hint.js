import { extractGrains } from "../lib/salt_heuristics.js";
export function saltGrainsHint(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { grains: [], count: 0 };
    }
    const grains = extractGrains(text);
    return { grains, count: grains.length };
}
