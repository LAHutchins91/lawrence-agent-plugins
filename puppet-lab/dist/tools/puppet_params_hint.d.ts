export type PuppetParamsHintInput = {
    text: string;
};
export type PuppetParamsHintOutput = {
    params: string[];
    secretKeyNames?: string[];
    count: number;
};
export declare function puppetParamsHint(input: PuppetParamsHintInput): PuppetParamsHintOutput;
