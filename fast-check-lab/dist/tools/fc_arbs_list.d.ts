import { type ArbInfo } from "../lib/fast_check.js";
export type FcArbsListInput = {
    text: string;
};
export type FcArbsListOutput = {
    arbs: ArbInfo[];
    count: number;
};
export declare function fcArbsList(input: FcArbsListInput): FcArbsListOutput;
