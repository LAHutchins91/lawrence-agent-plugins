import { type Finding } from "../lib/sam_heuristics.js";
export type SamLintLiteInput = {
    text: string;
};
export type SamLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function samLintLite(input: SamLintLiteInput): SamLintLiteOutput;
