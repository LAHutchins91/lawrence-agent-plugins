import { type Finding } from "../lib/tsconfig.js";
export type TscLintLiteInput = {
    text: string;
};
export type TscLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function tscLintLite(input: TscLintLiteInput): TscLintLiteOutput;
