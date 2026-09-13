import { extractProviders } from "../lib/vagrant_heuristics.js";
export function vagrantProvidersHint(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { providers: [], count: 0 };
    }
    const providers = extractProviders(text);
    return { providers, count: providers.length };
}
