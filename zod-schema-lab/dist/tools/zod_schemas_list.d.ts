import { type SchemaInfo } from "../lib/zod_schema.js";
export type ZodSchemasListInput = {
    text: string;
};
export type ZodSchemasListOutput = {
    schemas: SchemaInfo[];
    count: number;
};
export declare function zodSchemasList(input: ZodSchemasListInput): ZodSchemasListOutput;
