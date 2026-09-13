import { type OptionInfo } from "../lib/pc_heuristics.js";
export type PcOptionsHintInput = {
    text: string;
};
export type PcOptionsHintOutput = {
    options: OptionInfo[];
    count: number;
};
export declare function pcOptionsHint(input: PcOptionsHintInput): PcOptionsHintOutput;
