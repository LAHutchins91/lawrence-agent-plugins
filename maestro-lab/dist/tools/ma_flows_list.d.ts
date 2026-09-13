export type MaFlowsListInput = {
    text: string;
};
export type MaFlowsListOutput = {
    appId?: string;
    name?: string;
    tags?: string[];
    steps: string[];
    count: number;
};
export declare function maFlowsList(input: MaFlowsListInput): MaFlowsListOutput;
