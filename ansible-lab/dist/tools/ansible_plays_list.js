import { extractPlays } from "../lib/ansible_heuristics.js";
export function ansiblePlaysList(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { plays: [], count: 0 };
    }
    const plays = extractPlays(text);
    return { plays, count: plays.length };
}
