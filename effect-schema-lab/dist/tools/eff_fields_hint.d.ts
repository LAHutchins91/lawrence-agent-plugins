import { type FieldInfo } from "../lib/effect_schema.js";
export type EffFieldsHintInput = {
    text: string;
};
export type EffFieldsHintOutput = {
    fields: FieldInfo[];
    count: number;
};
export declare function effFieldsHint(input: EffFieldsHintInput): EffFieldsHintOutput;
