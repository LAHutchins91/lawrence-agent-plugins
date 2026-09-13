import { type Finding } from "../lib/valibot_schema.js";
export type VbLintLiteInput = {
    text: string;
};
export type VbLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function vbLintLite(input: VbLintLiteInput): VbLintLiteOutput;
