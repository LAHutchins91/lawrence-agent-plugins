import { type Finding } from "../lib/eslint_config.js";
export type EslintLintLiteInput = {
    text: string;
};
export type EslintLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function eslintLintLite(input: EslintLintLiteInput): EslintLintLiteOutput;
