import { type Finding } from "../lib/cdktf_heuristics.js";
export type CdktfLintLiteInput = {
    text: string;
};
export type CdktfLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function cdktfLintLite(input: CdktfLintLiteInput): CdktfLintLiteOutput;
