import { type Finding } from "../lib/sg_heuristics.js";
export type SgLintLiteInput = {
    text: string;
};
export type SgLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function sgLintLite(input: SgLintLiteInput): SgLintLiteOutput;
