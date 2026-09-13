import { type Finding } from "../lib/cdk8s_heuristics.js";
export type Cdk8sLintLiteInput = {
    text: string;
};
export type Cdk8sLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function cdk8sLintLite(input: Cdk8sLintLiteInput): Cdk8sLintLiteOutput;
