export type GatInjectsHintInput = {
    text: string;
};
export type GatInjectsHintOutput = {
    injects: {
        kind: string;
        args?: string;
    }[];
    count: number;
};
export declare function gatInjectsHint(input: GatInjectsHintInput): GatInjectsHintOutput;
