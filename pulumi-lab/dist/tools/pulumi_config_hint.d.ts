export type PulumiConfigHintInput = {
    text: string;
};
export type PulumiConfigHintOutput = {
    configKeys: string[];
    secretKeys?: string[];
    count: number;
};
export declare function pulumiConfigHint(input: PulumiConfigHintInput): PulumiConfigHintOutput;
