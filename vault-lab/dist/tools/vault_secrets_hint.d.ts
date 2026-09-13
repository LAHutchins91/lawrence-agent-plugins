export type VaultSecretsHintInput = {
    text: string;
};
export type VaultSecretsHintOutput = {
    engines: Array<{
        type?: string;
        path?: string;
    }>;
    count: number;
};
export declare function vaultSecretsHint(input: VaultSecretsHintInput): VaultSecretsHintOutput;
