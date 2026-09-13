export type BbOptionsHintInput = {
    text: string;
};
export type BbOptionsHintOutput = {
    options: {
        flag: string;
        value?: string;
    }[];
    count: number;
};
export declare function bbOptionsHint(input: BbOptionsHintInput): BbOptionsHintOutput;
