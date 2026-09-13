import { type WranglerBindingsHint } from "../lib/wrangler_toml.js";
export type WranglerBindingsHintInput = {
    text: string;
};
export type WranglerBindingsHintOutput = WranglerBindingsHint;
export declare function wranglerBindingsHint(input: WranglerBindingsHintInput): WranglerBindingsHintOutput;
