import { type Finding } from "../lib/pulumi_heuristics.js";
export type PulumiLintLiteInput = {
    text: string;
};
export type PulumiLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function pulumiLintLite(input: PulumiLintLiteInput): PulumiLintLiteOutput;
