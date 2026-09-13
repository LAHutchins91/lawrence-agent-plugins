import { type Finding } from "../lib/testing_library_heuristics.js";
export type TlLintLiteInput = {
    text: string;
};
export type TlLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function tlLintLite(input: TlLintLiteInput): TlLintLiteOutput;
