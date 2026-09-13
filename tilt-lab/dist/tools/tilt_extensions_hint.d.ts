import { type ExtensionInfo } from "../lib/tilt_heuristics.js";
export type TiltExtensionsHintInput = {
    text: string;
};
export type TiltExtensionsHintOutput = {
    extensions: ExtensionInfo[];
    count: number;
};
export declare function tiltExtensionsHint(input: TiltExtensionsHintInput): TiltExtensionsHintOutput;
