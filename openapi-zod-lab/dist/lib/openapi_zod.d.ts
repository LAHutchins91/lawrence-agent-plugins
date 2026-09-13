export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type PathInfo = {
    path: string;
    methods: string[];
};
export type SchemaHint = {
    name: string;
    type?: string;
    zodHint?: string;
};
export type OpHint = {
    operationId?: string;
    method: string;
    path: string;
    tags?: string[];
    requestBody?: string;
    responses: string[];
};
export type OpenAPIDoc = {
    openapi?: string;
    swagger?: string;
    info?: {
        title?: string;
        version?: string;
        [k: string]: unknown;
    };
    paths?: Record<string, Record<string, unknown>>;
    components?: {
        schemas?: Record<string, JsonSchema>;
        [k: string]: unknown;
    };
    definitions?: Record<string, JsonSchema>;
    [k: string]: unknown;
};
export type JsonSchema = {
    $ref?: string;
    type?: string | string[];
    nullable?: boolean;
    enum?: unknown[];
    const?: unknown;
    properties?: Record<string, JsonSchema>;
    required?: string[];
    items?: JsonSchema | JsonSchema[];
    oneOf?: JsonSchema[];
    anyOf?: JsonSchema[];
    allOf?: JsonSchema[];
    format?: string;
    additionalProperties?: boolean | JsonSchema;
    [key: string]: unknown;
};
/** Strip line and block comments from JSONC-ish text (double-quoted strings). */
export declare function stripJsonComments(text: string): string;
/**
 * Parse OpenAPI text: prefer JSON, then JSONC (comment-strip), then YAML.
 */
export declare function parseOpenApiText(text: string): {
    doc: OpenAPIDoc | null;
    format: "json" | "jsonc" | "yaml" | "empty" | "error";
    parseError?: string;
};
/**
 * Best-effort Zod type hint for a JSON Schema / OpenAPI schema node.
 */
export declare function zodHintForSchema(schema: JsonSchema | undefined | null): string | undefined;
export declare function getSchemaMap(doc: OpenAPIDoc): Record<string, JsonSchema>;
export declare function listPaths(text: string): {
    paths: PathInfo[];
    count: number;
};
export declare function listSchemaHints(text: string): {
    schemas: SchemaHint[];
    count: number;
};
export declare function listOps(text: string): {
    operations: OpHint[];
    count: number;
};
export declare function lintOpenApi(text: string): Finding[];
