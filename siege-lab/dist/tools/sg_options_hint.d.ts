export type SgOptionsHintInput = {
    text: string;
};
export type SgOptionsHintOutput = {
    options: {
        flag: string;
        value?: string;
    }[];
    count: number;
};
export declare function sgOptionsHint(input: SgOptionsHintInput): SgOptionsHintOutput;
