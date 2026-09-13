/**
 * Best-effort Joi schema JS/TS text heuristics.
 * No joi runtime, no network, no filesystem follow, no eval / no TS AST.
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
    joiType?: string;
    required?: boolean;
    optional?: boolean;
};
export type RuleInfo = {
    on?: string;
    kind: string;
};
/** Strip line and block comments; leave strings roughly intact. */
export declare function stripComments(raw: string): string;
/**
 * List Joi schemas from `const Foo = Joi.object` / `joi.string` / `export const` assignments.
 */
export declare function listSchemas(text: string): {
    schemas: SchemaInfo[];
    count: number;
};
/**
 * Keys inside Joi.object({ ... }) best-effort.
 */
export declare function listFields(text: string): {
    fields: FieldInfo[];
    count: number;
};
/**
 * Chained Joi rule methods (.min/.max/.email/.uri/.pattern/.valid/.when/.custom/.messages …).
 */
export declare function listRules(text: string): {
    rules: RuleInfo[];
    count: number;
};
export declare function lintJoi(text: string): Finding[];
