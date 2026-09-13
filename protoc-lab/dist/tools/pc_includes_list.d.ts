export type PcIncludesListInput = {
    text: string;
};
export type PcIncludesListOutput = {
    includes: string[];
    protos: string[];
    count: number;
};
export declare function pcIncludesList(input: PcIncludesListInput): PcIncludesListOutput;
