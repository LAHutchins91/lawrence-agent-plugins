import { extractProviders } from "../lib/cdktf_heuristics.js";
export function cdktfProvidersHint(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { providers: [], count: 0 };
    }
    const providers = extractProviders(text);
    return { providers, count: providers.length };
}
