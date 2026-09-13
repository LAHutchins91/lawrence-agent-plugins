/**
 * Best-effort Zod schema TS/JS text heuristics.
 * No zod runtime, no network, no filesystem follow, no eval / no TS AST.
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
    zodType?: string;
    optional?: boolean;
    nullable?: boolean;
};
export type RefinementInfo = {
    on?: string;
    kind: "refine" | "superRefine" | "transform" | "pipe" | "brand";
};
/** Strip line and block comments; leave strings roughly intact. */
export declare function stripComments(raw: string): string;
/**
 * List Zod schemas from `const Foo = z.object` / `export const` assignments.
 */
export declare function listSchemas(text: string): {
    schemas: SchemaInfo[];
    count: number;
};
/**
 * Keys inside z.object({ ... }) best-effort.
 */
export declare function listFields(text: string): {
    fields: FieldInfo[];
    count: number;
};
/**
 * Chained refine / superRefine / transform / pipe / brand methods.
 */
export declare function listRefinements(text: string): {
    refinements: RefinementInfo[];
    count: number;
};
export declare function lintZod(text: string): Finding[];
