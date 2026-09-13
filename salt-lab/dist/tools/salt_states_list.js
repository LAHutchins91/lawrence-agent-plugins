import { extractStates } from "../lib/salt_heuristics.js";
export function saltStatesList(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { states: [], count: 0 };
    }
    const states = extractStates(text);
    return { states, count: states.length };
}
