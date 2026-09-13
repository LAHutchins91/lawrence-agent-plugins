import { type ViteHintResult } from "../lib/astro_config.js";
export type AstroViteHintInput = {
    text: string;
};
export type AstroViteHintOutput = ViteHintResult;
export declare function astroViteHint(input: AstroViteHintInput): AstroViteHintOutput;
