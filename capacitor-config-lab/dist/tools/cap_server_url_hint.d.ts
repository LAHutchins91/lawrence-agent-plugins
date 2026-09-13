import { type ServerUrlHintResult } from "../lib/capacitor_config.js";
export type CapServerUrlHintInput = {
    text: string;
};
export type CapServerUrlHintOutput = ServerUrlHintResult;
export declare function capServerUrlHint(input: CapServerUrlHintInput): CapServerUrlHintOutput;
