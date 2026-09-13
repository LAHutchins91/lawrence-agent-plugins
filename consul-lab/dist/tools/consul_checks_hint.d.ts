export type ConsulChecksHintInput = {
    text: string;
};
export type ConsulChecksHintOutput = {
    checks: Array<{
        name?: string;
        type?: string;
        interval?: string;
    }>;
    count: number;
};
export declare function consulChecksHint(input: ConsulChecksHintInput): ConsulChecksHintOutput;
