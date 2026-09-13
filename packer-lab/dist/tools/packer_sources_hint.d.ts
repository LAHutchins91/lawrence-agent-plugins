export type PackerSourcesHintInput = {
    text: string;
};
export type PackerSourcesHintOutput = {
    sources: Array<{
        type?: string;
        name?: string;
        labels?: Record<string, string>;
    }>;
    count: number;
};
export declare function packerSourcesHint(input: PackerSourcesHintInput): PackerSourcesHintOutput;
