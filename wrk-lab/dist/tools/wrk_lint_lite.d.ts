import { type Finding } from "../lib/wrk_heuristics.js";
export type WrkLintLiteInput = {
    text: string;
};
export type WrkLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function wrkLintLite(input: WrkLintLiteInput): WrkLintLiteOutput;
