import { type Finding } from "../lib/espresso_heuristics.js";
export type EsLintLiteInput = {
    text: string;
};
export type EsLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function esLintLite(input: EsLintLiteInput): EsLintLiteOutput;
