import { type SlugNameResult } from "../lib/expo_config.js";
export type ExpoSlugNameInput = {
    text: string;
};
export type ExpoSlugNameOutput = SlugNameResult;
export declare function expoSlugName(input: ExpoSlugNameInput): ExpoSlugNameOutput;
