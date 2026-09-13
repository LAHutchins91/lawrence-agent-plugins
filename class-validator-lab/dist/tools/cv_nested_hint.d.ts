import { type NestedInfo } from "../lib/cv_schema.js";
export type CvNestedHintInput = {
    text: string;
};
export type CvNestedHintOutput = {
    nested: NestedInfo[];
    count: number;
};
export declare function cvNestedHint(input: CvNestedHintInput): CvNestedHintOutput;
