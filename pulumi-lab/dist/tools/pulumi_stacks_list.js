import { extractStacks } from "../lib/pulumi_heuristics.js";
export function pulumiStacksList(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { stacks: [], count: 0 };
    }
    const stacks = extractStacks(text);
    return { stacks, count: stacks.length };
}
