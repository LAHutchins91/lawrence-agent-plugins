import { type Finding } from "../lib/workflow.js";
export type GhaLintLiteInput = {
    text: string;
};
export type GhaLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function ghaLintLite(input: GhaLintLiteInput): GhaLintLiteOutput;
