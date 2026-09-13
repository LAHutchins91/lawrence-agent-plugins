export type VaultPoliciesListInput = {
    text: string;
};
export type VaultPoliciesListOutput = {
    policies: Array<{
        path?: string;
        capabilities?: string[];
    }>;
    count: number;
};
export declare function vaultPoliciesList(input: VaultPoliciesListInput): VaultPoliciesListOutput;
