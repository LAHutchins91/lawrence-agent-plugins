import { type SelectorInfo } from "../lib/maestro_heuristics.js";
export type MaSelectorsHintInput = {
    text: string;
};
export type MaSelectorsHintOutput = {
    selectors: SelectorInfo[];
    count: number;
};
export declare function maSelectorsHint(input: MaSelectorsHintInput): MaSelectorsHintOutput;
