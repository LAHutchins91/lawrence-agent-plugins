import { type SchemaInfo } from "../lib/valibot_schema.js";
export type VbSchemasListInput = {
    text: string;
};
export type VbSchemasListOutput = {
    schemas: SchemaInfo[];
    count: number;
};
export declare function vbSchemasList(input: VbSchemasListInput): VbSchemasListOutput;
