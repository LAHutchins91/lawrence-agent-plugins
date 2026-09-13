import { type ReplacementInfo } from "../lib/testdouble_heuristics.js";
export type TdReplacementsListInput = {
    text: string;
};
export type TdReplacementsListOutput = {
    replacements: ReplacementInfo[];
    count: number;
};
export declare function tdReplacementsList(input: TdReplacementsListInput): TdReplacementsListOutput;
