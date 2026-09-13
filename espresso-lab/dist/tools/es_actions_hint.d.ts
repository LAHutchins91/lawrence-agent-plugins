export type EsActionsHintInput = {
    text: string;
};
export type EsActionsHintOutput = {
    actions: {
        name: string;
    }[];
    count: number;
};
export declare function esActionsHint(input: EsActionsHintInput): EsActionsHintOutput;
