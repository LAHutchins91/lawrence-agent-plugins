import { type VerifyInfo } from "../lib/testdouble_heuristics.js";
export type TdVerifyHintInput = {
    text: string;
};
export type TdVerifyHintOutput = {
    verifies: VerifyInfo[];
    count: number;
};
export declare function tdVerifyHint(input: TdVerifyHintInput): TdVerifyHintOutput;
