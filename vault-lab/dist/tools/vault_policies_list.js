import { extractPolicies } from "../lib/vault_heuristics.js";
export function vaultPoliciesList(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { policies: [], count: 0 };
    }
    const policies = extractPolicies(text);
    return { policies, count: policies.length };
}
