export type BbTargetsListInput = {
    text: string;
};
export type BbTargetsListOutput = {
    targets: {
        url?: string;
    }[];
    count: number;
};
export declare function bbTargetsList(input: BbTargetsListInput): BbTargetsListOutput;
