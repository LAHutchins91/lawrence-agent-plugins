import { type SelectorInfo } from "../lib/wdio_heuristics.js";
export type WdioSelectorsHintInput = {
    text: string;
};
export type WdioSelectorsHintOutput = {
    selectors: SelectorInfo[];
    count: number;
};
export declare function wdioSelectorsHint(input: WdioSelectorsHintInput): WdioSelectorsHintOutput;
