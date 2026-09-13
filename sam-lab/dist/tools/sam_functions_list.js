import { extractFunctions } from "../lib/sam_heuristics.js";
export function samFunctionsList(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { functions: [], count: 0 };
    }
    const functions = extractFunctions(text);
    return { functions, count: functions.length };
}
