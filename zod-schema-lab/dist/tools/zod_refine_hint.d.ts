import { type RefinementInfo } from "../lib/zod_schema.js";
export type ZodRefineHintInput = {
    text: string;
};
export type ZodRefineHintOutput = {
    refinements: RefinementInfo[];
    count: number;
};
export declare function zodRefineHint(input: ZodRefineHintInput): ZodRefineHintOutput;
