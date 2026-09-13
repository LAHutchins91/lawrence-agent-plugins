import { type Finding } from "../lib/sc_heuristics.js";
export type ScLintLiteInput = {
    text: string;
};
export type ScLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function scLintLite(input: ScLintLiteInput): ScLintLiteOutput;
