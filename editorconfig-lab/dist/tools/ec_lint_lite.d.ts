import { type Finding } from "../lib/editorconfig.js";
export type EcLintLiteInput = {
    text: string;
};
export type EcLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function ecLintLite(input: EcLintLiteInput): EcLintLiteOutput;
