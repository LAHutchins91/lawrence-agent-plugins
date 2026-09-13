import { type Finding } from "../lib/app_spec.js";
export type DoLintLiteInput = {
    text: string;
};
export type DoLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function doLintLite(input: DoLintLiteInput): DoLintLiteOutput;
