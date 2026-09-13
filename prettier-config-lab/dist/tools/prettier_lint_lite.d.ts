import { type Finding } from "../lib/prettier_config.js";
export type PrettierLintLiteInput = {
    text: string;
};
export type PrettierLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function prettierLintLite(input: PrettierLintLiteInput): PrettierLintLiteOutput;
