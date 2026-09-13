import { type Finding } from "../lib/capacitor_config.js";
export type CapLintLiteInput = {
    text: string;
};
export type CapLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function capLintLite(input: CapLintLiteInput): CapLintLiteOutput;
