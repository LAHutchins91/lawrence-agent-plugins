import { type PropInfo } from "../lib/fast_check.js";
export type FcPropsHintInput = {
    text: string;
};
export type FcPropsHintOutput = {
    properties: PropInfo[];
    count: number;
};
export declare function fcPropsHint(input: FcPropsHintInput): FcPropsHintOutput;
