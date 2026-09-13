import { type ConcurrencyHint } from "../lib/sg_heuristics.js";
export type SgConcurrencyHintInput = {
    text: string;
};
export type SgConcurrencyHintOutput = ConcurrencyHint;
export declare function sgConcurrencyHint(input: SgConcurrencyHintInput): SgConcurrencyHintOutput;
