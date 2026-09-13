import { type WaitInfo } from "../lib/testing_library_heuristics.js";
export type TlWaitHintInput = {
    text: string;
};
export type TlWaitHintOutput = {
    waits: WaitInfo[];
    count: number;
};
export declare function tlWaitHint(input: TlWaitHintInput): TlWaitHintOutput;
