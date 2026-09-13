import { type Finding } from "../lib/expo_config.js";
export type ExpoLintLiteInput = {
    text: string;
};
export type ExpoLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function expoLintLite(input: ExpoLintLiteInput): ExpoLintLiteOutput;
