import { type Finding } from "../lib/effect_schema.js";
export type EffLintLiteInput = {
    text: string;
};
export type EffLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function effLintLite(input: EffLintLiteInput): EffLintLiteOutput;
