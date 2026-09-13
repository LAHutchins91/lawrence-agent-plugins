import { type Finding } from "../lib/maestro_heuristics.js";
export type MaLintLiteInput = {
    text: string;
};
export type MaLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function maLintLite(input: MaLintLiteInput): MaLintLiteOutput;
