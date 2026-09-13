export type VagrantProvidersHintInput = {
    text: string;
};
export type VagrantProvidersHintOutput = {
    providers: string[];
    count: number;
};
export declare function vagrantProvidersHint(input: VagrantProvidersHintInput): VagrantProvidersHintOutput;
