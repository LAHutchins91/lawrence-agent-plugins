import { type Finding } from "../lib/joi_schema.js";
export type JoiLintLiteInput = {
    text: string;
};
export type JoiLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function joiLintLite(input: JoiLintLiteInput): JoiLintLiteOutput;
