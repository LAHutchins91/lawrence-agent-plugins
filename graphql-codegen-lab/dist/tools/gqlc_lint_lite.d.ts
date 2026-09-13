import { type Finding } from "../lib/gqlc_heuristics.js";
export type GqlcLintLiteInput = {
    text: string;
};
export type GqlcLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function gqlcLintLite(input: GqlcLintLiteInput): GqlcLintLiteOutput;
