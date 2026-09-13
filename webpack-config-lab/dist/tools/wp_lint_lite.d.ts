import { type Finding } from "../lib/webpack_config.js";
export type WpLintLiteInput = {
    text: string;
};
export type WpLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function wpLintLite(input: WpLintLiteInput): WpLintLiteOutput;
