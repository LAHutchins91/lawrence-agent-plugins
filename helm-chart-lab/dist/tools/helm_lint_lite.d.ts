import { type Finding } from "../lib/helm_heuristics.js";
export type HelmLintLiteInput = {
    text?: string;
    chartText?: string;
    valuesText?: string;
    templatesText?: string;
};
export type HelmLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function helmLintLite(input: HelmLintLiteInput): HelmLintLiteOutput;
