export type KbOutputsListInput = {
    text: string;
};
export type KbOutputsListOutput = {
    outputs: Array<{
        path?: string;
        plugin?: string;
    }>;
    count: number;
};
export declare function kbOutputsList(input: KbOutputsListInput): KbOutputsListOutput;
