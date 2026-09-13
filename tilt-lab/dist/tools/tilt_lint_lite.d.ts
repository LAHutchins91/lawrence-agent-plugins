import { type Finding } from "../lib/tilt_heuristics.js";
export type TiltLintLiteInput = {
    text: string;
};
export type TiltLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function tiltLintLite(input: TiltLintLiteInput): TiltLintLiteOutput;
