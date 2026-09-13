import { type SpecInfo } from "../lib/wdio_heuristics.js";
export type WdioSpecsListInput = {
    text: string;
};
export type WdioSpecsListOutput = {
    specs: SpecInfo[];
    count: number;
};
export declare function wdioSpecsList(input: WdioSpecsListInput): WdioSpecsListOutput;
