import { extractAuths } from "../lib/vault_heuristics.js";
export function vaultAuthsHint(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { auths: [], count: 0 };
    }
    const auths = extractAuths(text);
    return { auths, count: auths.length };
}
