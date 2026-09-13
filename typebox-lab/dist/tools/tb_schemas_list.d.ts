import { type SchemaInfo } from "../lib/typebox_schema.js";
export type TbSchemasListInput = {
    text: string;
};
export type TbSchemasListOutput = {
    schemas: SchemaInfo[];
    count: number;
};
export declare function tbSchemasList(input: TbSchemasListInput): TbSchemasListOutput;
