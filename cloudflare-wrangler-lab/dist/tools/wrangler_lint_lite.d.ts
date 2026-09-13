import { type Finding } from "../lib/wrangler_toml.js";
export type WranglerLintLiteInput = {
    text: string;
};
export type WranglerLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function wranglerLintLite(input: WranglerLintLiteInput): WranglerLintLiteOutput;
