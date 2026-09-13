import { extractGroups } from "../lib/nomad_heuristics.js";
export function nomadGroupsHint(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { groups: [], count: 0 };
    }
    const groups = extractGroups(text);
    return { groups, count: groups.length };
}
