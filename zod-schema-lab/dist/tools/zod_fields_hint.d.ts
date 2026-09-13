import { type FieldInfo } from "../lib/zod_schema.js";
export type ZodFieldsHintInput = {
    text: string;
};
export type ZodFieldsHintOutput = {
    fields: FieldInfo[];
    count: number;
};
export declare function zodFieldsHint(input: ZodFieldsHintInput): ZodFieldsHintOutput;
