import { type Finding } from "../lib/fast_check.js";
export type FcLintLiteInput = {
    text: string;
};
export type FcLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function fcLintLite(input: FcLintLiteInput): FcLintLiteOutput;
