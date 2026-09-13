import { type Finding } from "../lib/gatling_heuristics.js";
export type GatLintLiteInput = {
    text: string;
};
export type GatLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function gatLintLite(input: GatLintLiteInput): GatLintLiteOutput;
