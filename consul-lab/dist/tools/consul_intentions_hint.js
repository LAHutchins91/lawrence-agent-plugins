import { extractIntentions, } from "../lib/consul_heuristics.js";
export function consulIntentionsHint(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { intentions: [], count: 0 };
    }
    const intentions = extractIntentions(text);
    return { intentions, count: intentions.length };
}
