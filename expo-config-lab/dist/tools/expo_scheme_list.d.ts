import { type SchemeListResult } from "../lib/expo_config.js";
export type ExpoSchemeListInput = {
    text: string;
};
export type ExpoSchemeListOutput = SchemeListResult;
export declare function expoSchemeList(input: ExpoSchemeListInput): ExpoSchemeListOutput;
