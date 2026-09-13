import { type SelectorInfo } from "../lib/puppeteer_heuristics.js";
export type PptrSelectorsHintInput = {
    text: string;
};
export type PptrSelectorsHintOutput = {
    selectors: SelectorInfo[];
    count: number;
};
export declare function pptrSelectorsHint(input: PptrSelectorsHintInput): PptrSelectorsHintOutput;
