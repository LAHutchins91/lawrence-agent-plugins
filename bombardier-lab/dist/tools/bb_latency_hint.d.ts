export type BbLatencyHintInput = {
    text: string;
};
export type BbLatencyHintOutput = {
    latency: {
        kind: string;
    }[];
    count: number;
};
export declare function bbLatencyHint(input: BbLatencyHintInput): BbLatencyHintOutput;
