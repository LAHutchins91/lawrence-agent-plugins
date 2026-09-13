import { type WhenInfo } from "../lib/testdouble_heuristics.js";
export type TdWhenHintInput = {
    text: string;
};
export type TdWhenHintOutput = {
    whens: WhenInfo[];
    count: number;
};
export declare function tdWhenHint(input: TdWhenHintInput): TdWhenHintOutput;
