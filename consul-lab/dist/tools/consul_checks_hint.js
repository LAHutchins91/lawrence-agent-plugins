import { extractChecks } from "../lib/consul_heuristics.js";
export function consulChecksHint(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { checks: [], count: 0 };
    }
    const checks = extractChecks(text);
    return { checks, count: checks.length };
}
