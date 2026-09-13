export type VaultAuthsHintInput = {
    text: string;
};
export type VaultAuthsHintOutput = {
    auths: string[];
    count: number;
};
export declare function vaultAuthsHint(input: VaultAuthsHintInput): VaultAuthsHintOutput;
