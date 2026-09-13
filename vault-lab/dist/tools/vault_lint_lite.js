import { lintVault } from "../lib/vault_heuristics.js";
export function vaultLintLite(input) {
    const findings = lintVault(input.text ?? "");
    return { findings, findingCount: findings.length };
}
