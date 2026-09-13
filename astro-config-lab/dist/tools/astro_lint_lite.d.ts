import { type Finding } from "../lib/astro_config.js";
export type AstroLintLiteInput = {
    text: string;
};
export type AstroLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function astroLintLite(input: AstroLintLiteInput): AstroLintLiteOutput;
