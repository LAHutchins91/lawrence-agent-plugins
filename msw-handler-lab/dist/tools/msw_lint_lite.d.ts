import { type Finding } from "../lib/msw_handlers.js";
export type MswLintLiteInput = {
    text: string;
};
export type MswLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function mswLintLite(input: MswLintLiteInput): MswLintLiteOutput;
