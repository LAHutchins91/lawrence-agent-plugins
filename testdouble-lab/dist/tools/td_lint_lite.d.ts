import { type Finding } from "../lib/testdouble_heuristics.js";
export type TdLintLiteInput = {
    text: string;
};
export type TdLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function tdLintLite(input: TdLintLiteInput): TdLintLiteOutput;
