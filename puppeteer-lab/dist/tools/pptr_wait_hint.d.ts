import { type WaitInfo } from "../lib/puppeteer_heuristics.js";
export type PptrWaitHintInput = {
    text: string;
};
export type PptrWaitHintOutput = {
    waits: WaitInfo[];
    count: number;
};
export declare function pptrWaitHint(input: PptrWaitHintInput): PptrWaitHintOutput;
