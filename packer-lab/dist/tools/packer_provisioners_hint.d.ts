export type PackerProvisionersHintInput = {
    text: string;
};
export type PackerProvisionersHintOutput = {
    provisioners: Array<{
        type?: string;
        only?: string[];
    }>;
    postProcessors?: string[];
    count: number;
};
export declare function packerProvisionersHint(input: PackerProvisionersHintInput): PackerProvisionersHintOutput;
