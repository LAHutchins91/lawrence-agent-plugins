import { type OutputModeResult } from "../lib/astro_config.js";
export type AstroOutputModeInput = {
    text: string;
};
export type AstroOutputModeOutput = OutputModeResult;
export declare function astroOutputMode(input: AstroOutputModeInput): AstroOutputModeOutput;
