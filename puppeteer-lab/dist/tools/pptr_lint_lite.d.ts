import { type Finding } from "../lib/puppeteer_heuristics.js";
export type PptrLintLiteInput = {
    text: string;
};
export type PptrLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function pptrLintLite(input: PptrLintLiteInput): PptrLintLiteOutput;
