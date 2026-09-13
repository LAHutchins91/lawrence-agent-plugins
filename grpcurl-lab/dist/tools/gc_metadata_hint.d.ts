export type GcMetadataHintInput = {
    text: string;
};
export type GcMetadataHintOutput = {
    metadata: {
        flag: string;
        value?: string;
    }[];
    count: number;
};
export declare function gcMetadataHint(input: GcMetadataHintInput): GcMetadataHintOutput;
