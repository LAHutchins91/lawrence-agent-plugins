import { extractTriggers } from "../lib/tilt_heuristics.js";
export function tiltTriggersHint(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { triggers: [], count: 0 };
    }
    const triggers = extractTriggers(text);
    return { triggers, count: triggers.length };
}
