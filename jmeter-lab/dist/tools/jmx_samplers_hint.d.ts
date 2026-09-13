export type JmxSamplersHintInput = {
    text: string;
};
export type JmxSamplersHintOutput = {
    samplers: {
        type: string;
        name?: string;
        path?: string;
    }[];
    count: number;
};
export declare function jmxSamplersHint(input: JmxSamplersHintInput): JmxSamplersHintOutput;
