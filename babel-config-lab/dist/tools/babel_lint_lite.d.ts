import { type Finding } from "../lib/babel_config.js";
export type BabelLintLiteInput = {
    text: string;
};
export type BabelLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function babelLintLite(input: BabelLintLiteInput): BabelLintLiteOutput;
