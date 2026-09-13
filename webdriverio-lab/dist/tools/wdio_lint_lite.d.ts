import { type Finding } from "../lib/wdio_heuristics.js";
export type WdioLintLiteInput = {
    text: string;
};
export type WdioLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function wdioLintLite(input: WdioLintLiteInput): WdioLintLiteOutput;
