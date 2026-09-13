export type ConsulIntentionsHintInput = {
    text: string;
};
export type ConsulIntentionsHintOutput = {
    intentions: Array<{
        source?: string;
        destination?: string;
        action?: string;
    }>;
    count: number;
};
export declare function consulIntentionsHint(input: ConsulIntentionsHintInput): ConsulIntentionsHintOutput;
