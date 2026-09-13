import { type OutputFormatsResult } from "../lib/rollup_config.js";
export type RollupOutputFormatsInput = {
    text: string;
};
export type RollupOutputFormatsOutput = OutputFormatsResult;
export declare function rollupOutputFormats(input: RollupOutputFormatsInput): RollupOutputFormatsOutput;
