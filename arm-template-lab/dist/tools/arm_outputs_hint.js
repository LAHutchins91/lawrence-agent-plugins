import { extractOutputs } from "../lib/arm_heuristics.js";
export function armOutputsHint(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { outputs: [], count: 0 };
    }
    const outputs = extractOutputs(text);
    return { outputs, count: outputs.length };
}
