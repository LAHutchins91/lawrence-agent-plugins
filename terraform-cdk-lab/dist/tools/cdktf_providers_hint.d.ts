export type CdktfProvidersHintInput = {
    text: string;
};
export type CdktfProvidersHintOutput = {
    providers: string[];
    count: number;
};
export declare function cdktfProvidersHint(input: CdktfProvidersHintInput): CdktfProvidersHintOutput;
