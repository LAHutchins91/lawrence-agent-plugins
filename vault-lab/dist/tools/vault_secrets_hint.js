import { extractEngines } from "../lib/vault_heuristics.js";
export function vaultSecretsHint(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { engines: [], count: 0 };
    }
    const engines = extractEngines(text);
    return { engines, count: engines.length };
}
