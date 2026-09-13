import { type Finding } from "../lib/salt_heuristics.js";
export type SaltLintLiteInput = {
    text: string;
};
export type SaltLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function saltLintLite(input: SaltLintLiteInput): SaltLintLiteOutput;
