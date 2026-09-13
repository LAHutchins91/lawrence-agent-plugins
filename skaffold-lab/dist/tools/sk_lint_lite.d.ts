import { type Finding } from "../lib/skaffold_heuristics.js";
export type SkLintLiteInput = {
    text: string;
};
export type SkLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function skLintLite(input: SkLintLiteInput): SkLintLiteOutput;
