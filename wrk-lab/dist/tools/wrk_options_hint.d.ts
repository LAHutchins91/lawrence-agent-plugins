export type WrkOptionsHintInput = {
    text: string;
};
export type WrkOptionsHintOutput = {
    options: {
        flag: string;
        value?: string;
    }[];
    count: number;
};
export declare function wrkOptionsHint(input: WrkOptionsHintInput): WrkOptionsHintOutput;
