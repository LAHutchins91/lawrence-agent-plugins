import { type Finding } from "../lib/cv_schema.js";
export type CvLintLiteInput = {
    text: string;
};
export type CvLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function cvLintLite(input: CvLintLiteInput): CvLintLiteOutput;
