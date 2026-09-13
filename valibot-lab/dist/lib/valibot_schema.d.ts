/**
 * Best-effort Valibot schema TS/JS text heuristics.
 * No valibot runtime, no network, no filesystem follow, no eval / no TS AST.
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
export type PipeInfo = {
    on?: string;
    steps: string[];
};
export type ActionInfo = {
    name: string;
    count: number;
};
/** Strip line and block comments; leave strings roughly intact. */
export declare function stripComments(raw: string): string;
/**
 * List Valibot schemas from `const Foo = v.object` / named imports / export const.
 */
export declare function listSchemas(text: string): {
    schemas: SchemaInfo[];
    count: number;
};
/**
 * Extract v.pipe(...) / pipe(...) chains with step names.
 */
export declare function listPipes(text: string): {
    pipes: PipeInfo[];
    count: number;
};
/**
 * Count Valibot action calls like v.minLength, v.email, v.transform, etc.
 */
export declare function listActions(text: string): {
    actions: ActionInfo[];
    total: number;
};
export declare function lintValibot(text: string): Finding[];
