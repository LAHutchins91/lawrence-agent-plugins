import { type StackInfo } from "../lib/pulumi_heuristics.js";
export type PulumiStacksListInput = {
    text: string;
};
export type PulumiStacksListOutput = {
    stacks: StackInfo[];
    count: number;
};
export declare function pulumiStacksList(input: PulumiStacksListInput): PulumiStacksListOutput;
