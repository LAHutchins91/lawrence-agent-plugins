export type SamGlobalsHintInput = {
    text: string;
};
export type SamGlobalsHintOutput = {
    globals?: object;
    transform?: string | string[];
    description?: string;
    parameters?: string[];
    count: number;
};
export declare function samGlobalsHint(input: SamGlobalsHintInput): SamGlobalsHintOutput;
