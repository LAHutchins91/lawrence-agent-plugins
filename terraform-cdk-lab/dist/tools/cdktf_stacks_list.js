import { extractStacks } from "../lib/cdktf_heuristics.js";
export function cdktfStacksList(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { stacks: [], count: 0 };
    }
    const result = extractStacks(text);
    const out = {
        stacks: result.stacks,
        count: result.stacks.length,
    };
    if (result.language)
        out.language = result.language;
    if (result.providers && result.providers.length > 0) {
        out.providers = result.providers;
    }
    return out;
}
