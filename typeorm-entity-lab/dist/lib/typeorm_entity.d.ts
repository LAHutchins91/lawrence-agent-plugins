/**
 * Best-effort TypeORM entity TS/JS text heuristics.
 * No TypeORM CLI, no network, no DB, no filesystem follow, no eval / no tsc AST.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type EntityInfo = {
    name: string;
    tableName?: string;
    columns: string[];
};
export type RelationInfo = {
    entity?: string;
    field: string;
    kind: string;
    target?: string;
};
export type ColumnInfo = {
    entity?: string;
    name: string;
    type?: string;
    primary?: boolean;
    unique?: boolean;
    nullable?: boolean;
};
/** Strip line and block comments; leave strings roughly intact. */
export declare function stripComments(raw: string): string;
type ClassBlock = {
    name: string;
    body: string;
    start: number;
    decoratorsBefore: string;
};
export declare function parseClassBlocks(text: string): ClassBlock[];
export declare function listEntities(text: string): {
    entities: EntityInfo[];
    count: number;
};
export declare function listRelations(text: string): {
    relations: RelationInfo[];
    count: number;
};
export declare function listColumns(text: string): {
    columns: ColumnInfo[];
    count: number;
};
export declare function lintEntities(text: string): Finding[];
export {};
