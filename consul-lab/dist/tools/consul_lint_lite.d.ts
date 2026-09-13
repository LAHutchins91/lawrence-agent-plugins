import { type Finding } from "../lib/consul_heuristics.js";
export type ConsulLintLiteInput = {
    text: string;
};
export type ConsulLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function consulLintLite(input: ConsulLintLiteInput): ConsulLintLiteOutput;
