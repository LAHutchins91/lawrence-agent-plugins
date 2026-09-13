export type JmxAssertionsHintInput = {
    text: string;
};
export type JmxAssertionsHintOutput = {
    assertions: {
        type: string;
        name?: string;
    }[];
    count: number;
};
export declare function jmxAssertionsHint(input: JmxAssertionsHintInput): JmxAssertionsHintOutput;
