import { type ConstraintInfo } from "../lib/fast_check.js";
export type FcConstraintsHintInput = {
    text: string;
};
export type FcConstraintsHintOutput = {
    constraints: ConstraintInfo[];
    count: number;
};
export declare function fcConstraintsHint(input: FcConstraintsHintInput): FcConstraintsHintOutput;
