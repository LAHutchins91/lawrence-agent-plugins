export type PackerBuildsListInput = {
    text: string;
};
export type PackerBuildsListOutput = {
    builds: Array<{
        name?: string;
        type?: string;
        sources?: string[];
    }>;
    count: number;
};
export declare function packerBuildsList(input: PackerBuildsListInput): PackerBuildsListOutput;
