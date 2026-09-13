import { type SchemaHint } from "../lib/openapi_zod.js";
export type OzSchemasHintInput = {
    text: string;
};
export type OzSchemasHintOutput = {
    schemas: SchemaHint[];
    count: number;
};
export declare function ozSchemasHint(input: OzSchemasHintInput): OzSchemasHintOutput;
