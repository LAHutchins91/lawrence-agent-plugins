import { type Finding } from "../lib/pc_heuristics.js";
export type PcLintLiteInput = {
    text: string;
};
export type PcLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function pcLintLite(input: PcLintLiteInput): PcLintLiteOutput;
