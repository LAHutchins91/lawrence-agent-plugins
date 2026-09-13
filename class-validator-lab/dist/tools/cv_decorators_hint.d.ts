import { type DecoratorInfo } from "../lib/cv_schema.js";
export type CvDecoratorsHintInput = {
    text: string;
};
export type CvDecoratorsHintOutput = {
    decorators: DecoratorInfo[];
    count: number;
};
export declare function cvDecoratorsHint(input: CvDecoratorsHintInput): CvDecoratorsHintOutput;
