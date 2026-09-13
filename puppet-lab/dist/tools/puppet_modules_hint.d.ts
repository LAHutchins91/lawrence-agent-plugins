export type PuppetModulesHintInput = {
    text: string;
};
export type PuppetModulesHintOutput = {
    modules: string[];
    count: number;
};
export declare function puppetModulesHint(input: PuppetModulesHintInput): PuppetModulesHintOutput;
