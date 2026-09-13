import { type AppIdResult } from "../lib/capacitor_config.js";
export type CapAppIdInput = {
    text: string;
};
export type CapAppIdOutput = AppIdResult;
export declare function capAppId(input: CapAppIdInput): CapAppIdOutput;
