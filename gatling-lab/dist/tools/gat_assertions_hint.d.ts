export type GatAssertionsHintInput = {
    text: string;
};
export type GatAssertionsHintOutput = {
    assertions: {
        kind: string;
    }[];
    count: number;
};
export declare function gatAssertionsHint(input: GatAssertionsHintInput): GatAssertionsHintOutput;
