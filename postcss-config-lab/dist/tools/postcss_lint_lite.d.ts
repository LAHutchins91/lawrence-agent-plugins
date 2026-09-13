import { type Finding } from "../lib/postcss_config.js";
export type PostcssLintLiteInput = {
    text: string;
};
export type PostcssLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function postcssLintLite(input: PostcssLintLiteInput): PostcssLintLiteOutput;
