import { extractPillars } from "../lib/salt_heuristics.js";
export function saltPillarsHint(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { pillars: [], count: 0 };
    }
    const hint = extractPillars(text);
    const out = {
        pillars: hint.pillars,
        count: hint.pillars.length,
    };
    if (hint.secretKeyNames.length)
        out.secretKeyNames = hint.secretKeyNames;
    return out;
}
