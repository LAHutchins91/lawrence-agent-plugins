import { type TransformInfo } from "../lib/effect_schema.js";
export type EffTransformHintInput = {
    text: string;
};
export type EffTransformHintOutput = {
    transforms: TransformInfo[];
    count: number;
};
export declare function effTransformHint(input: EffTransformHintInput): EffTransformHintOutput;
