/**
 * Best-effort Effect Schema TS/JS text heuristics.
 * No Effect runtime, no network, no filesystem follow, no eval / no TS AST.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type SchemaInfo = {
    name: string;
    kind?: string;
};
export type FieldInfo = {
    schema?: string;
    name: string;
    typeHint?: string;
};
export type TransformInfo = {
    on?: string;
    kind: string;
};
/** Strip line and block comments; leave strings roughly intact. */
export declare function stripComments(raw: string): string;
/** Detect Schema / S namespace prefixes from imports. */
export declare function detectSchemaPrefixes(cleaned: string): string[];
/**
 * List Effect Schema assignments: const Foo = Schema.Struct / S.String etc.
 */
export declare function listSchemas(text: string): {
    schemas: SchemaInfo[];
    count: number;
};
/**
 * Keys inside Schema.Struct({ ... }) best-effort.
 */
export declare function listFields(text: string): {
    fields: FieldInfo[];
    count: number;
};
/**
 * Schema.transform / filter / pipe / optional / NullOr / Union etc.
 */
export declare function listTransforms(text: string): {
    transforms: TransformInfo[];
    count: number;
};
export declare function lintEffect(text: string): Finding[];
