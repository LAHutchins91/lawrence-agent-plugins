import { type Finding } from "../lib/jest_config.js";
export type JestLintLiteInput = {
    text: string;
};
export type JestLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function jestLintLite(input: JestLintLiteInput): JestLintLiteOutput;
