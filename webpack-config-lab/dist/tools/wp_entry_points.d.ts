import { type EntryPointsResult } from "../lib/webpack_config.js";
export type WpEntryPointsInput = {
    text: string;
};
export type WpEntryPointsOutput = EntryPointsResult;
export declare function wpEntryPoints(input: WpEntryPointsInput): WpEntryPointsOutput;
