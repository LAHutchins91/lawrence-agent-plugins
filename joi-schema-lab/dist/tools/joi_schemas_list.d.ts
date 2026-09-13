import { type SchemaInfo } from "../lib/joi_schema.js";
export type JoiSchemasListInput = {
    text: string;
};
export type JoiSchemasListOutput = {
    schemas: SchemaInfo[];
    count: number;
};
export declare function joiSchemasList(input: JoiSchemasListInput): JoiSchemasListOutput;
