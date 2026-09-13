import { type FieldInfo } from "../lib/joi_schema.js";
export type JoiFieldsHintInput = {
    text: string;
};
export type JoiFieldsHintOutput = {
    fields: FieldInfo[];
    count: number;
};
export declare function joiFieldsHint(input: JoiFieldsHintInput): JoiFieldsHintOutput;
