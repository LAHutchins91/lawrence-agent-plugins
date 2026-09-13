import { type Finding } from "../lib/vault_heuristics.js";
export type VaultLintLiteInput = {
    text: string;
};
export type VaultLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function vaultLintLite(input: VaultLintLiteInput): VaultLintLiteOutput;
