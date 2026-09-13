import { type Finding } from "../lib/kb_heuristics.js";
export type KbLintLiteInput = {
    text: string;
};
export type KbLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function kbLintLite(input: KbLintLiteInput): KbLintLiteOutput;
