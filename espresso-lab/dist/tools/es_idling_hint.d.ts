export type EsIdlingHintInput = {
    text: string;
};
export type EsIdlingHintOutput = {
    idling: {
        kind: string;
    }[];
    count: number;
};
export declare function esIdlingHint(input: EsIdlingHintInput): EsIdlingHintOutput;
