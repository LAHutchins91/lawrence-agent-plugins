import { type Finding } from "../lib/gc_heuristics.js";
export type GcLintLiteInput = {
    text: string;
};
export type GcLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function gcLintLite(input: GcLintLiteInput): GcLintLiteOutput;
