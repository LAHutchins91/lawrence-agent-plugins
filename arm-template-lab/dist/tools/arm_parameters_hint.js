import { extractParameters, } from "../lib/arm_heuristics.js";
export function armParametersHint(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { parameters: [], count: 0 };
    }
    const parameters = extractParameters(text);
    return { parameters, count: parameters.length };
}
