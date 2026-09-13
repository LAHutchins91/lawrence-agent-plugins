import { type SchemaInfo } from "../lib/effect_schema.js";
export type EffSchemasListInput = {
    text: string;
};
export type EffSchemasListOutput = {
    schemas: SchemaInfo[];
    count: number;
};
export declare function effSchemasList(input: EffSchemasListInput): EffSchemasListOutput;
