export type VagrantProvisionsHintInput = {
    text: string;
};
export type VagrantProvisionsHintOutput = {
    provisions: Array<{
        type?: string;
        name?: string;
    }>;
    count: number;
};
export declare function vagrantProvisionsHint(input: VagrantProvisionsHintInput): VagrantProvisionsHintOutput;
