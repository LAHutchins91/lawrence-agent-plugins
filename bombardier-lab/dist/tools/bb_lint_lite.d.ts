import { type Finding } from "../lib/bb_heuristics.js";
export type BbLintLiteInput = {
    text: string;
};
export type BbLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function bbLintLite(input: BbLintLiteInput): BbLintLiteOutput;
