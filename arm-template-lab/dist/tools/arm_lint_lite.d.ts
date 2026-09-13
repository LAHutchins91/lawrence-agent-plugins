import { type Finding } from "../lib/arm_heuristics.js";
export type ArmLintLiteInput = {
    text: string;
};
export type ArmLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function armLintLite(input: ArmLintLiteInput): ArmLintLiteOutput;
