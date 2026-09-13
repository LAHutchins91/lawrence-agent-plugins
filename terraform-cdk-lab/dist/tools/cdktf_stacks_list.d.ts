import { type StackInfo } from "../lib/cdktf_heuristics.js";
export type CdktfStacksListInput = {
    text: string;
};
export type CdktfStacksListOutput = {
    stacks: StackInfo[];
    language?: string;
    providers?: string[];
    count: number;
};
export declare function cdktfStacksList(input: CdktfStacksListInput): CdktfStacksListOutput;
