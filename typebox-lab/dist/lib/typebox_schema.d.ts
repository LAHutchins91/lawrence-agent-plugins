/**
 * Best-effort TypeBox TS/JS text heuristics.
 * No @sinclair/typebox runtime, no network, no filesystem follow, no eval / no TS AST.
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
export type PropInfo = {
    schema?: string;
    name: string;
    typeHint?: string;
};
export type ComposeInfo = {
    on?: string;
    kind: string;
};
/** Strip line and block comments; leave strings roughly intact. */
export declare function stripComments(raw: string): string;
/** Detect Type / T namespace prefixes from imports. */
export declare function detectTypePrefixes(cleaned: string): string[];
/**
 * List TypeBox assignments: const Foo = Type.Object / Type.String etc.
 */
export declare function listSchemas(text: string): {
    schemas: SchemaInfo[];
    count: number;
};
/**
 * Keys inside Type.Object({ ... }) best-effort.
 */
export declare function listProps(text: string): {
    props: PropInfo[];
    count: number;
};
/**
 * Type.Union / Intersect / Partial / Pick / Omit / Ref / Recursive etc.
 */
export declare function listCompose(text: string): {
    compose: ComposeInfo[];
    count: number;
};
export declare function lintTypeBox(text: string): Finding[];
