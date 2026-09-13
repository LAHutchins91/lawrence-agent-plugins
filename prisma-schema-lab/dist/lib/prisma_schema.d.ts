/**
 * Best-effort Prisma schema.prisma text heuristics.
 * No Prisma CLI, no network, no DB, no filesystem follow.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type PrismaField = {
    name: string;
    type: string;
    attrs?: string[];
};
export type PrismaModel = {
    name: string;
    fields: PrismaField[];
    "@@attrs"?: string[];
};
export type PrismaEnum = {
    name: string;
    values: string[];
};
export type PrismaDatasource = {
    name: string;
    provider?: string;
    urlHint?: string;
};
export type PrismaGenerator = {
    name: string;
    provider?: string;
};
export type PrismaRelation = {
    from: string;
    field: string;
    to?: string;
    kind?: string;
};
/** Strip line and block comments; leave strings roughly intact for attrs. */
export declare function stripComments(raw: string): string;
export type BlockKind = "model" | "enum" | "datasource" | "generator" | "type" | "view";
export type SchemaBlock = {
    kind: BlockKind;
    name: string;
    body: string;
};
export declare function parseBlocks(text: string): SchemaBlock[];
/**
 * Parse a field line: name Type modifiers? @attrs...
 * Examples:
 *   id String @id @default(cuid())
 *   posts Post[]
 *   author User? @relation(fields: [authorId], references: [id])
 *   authorId Int
 */
export declare function parseFieldLine(line: string): PrismaField | null;
export declare function parseEnumValues(body: string): string[];
/**
 * Redact URL values to provider/env-ref hints — never echo full connection secrets.
 */
export declare function urlHintFromValue(raw: string | undefined): string | undefined;
export declare function listModels(text: string): {
    models: PrismaModel[];
    enums?: PrismaEnum[];
    count: number;
};
export declare function listDatasources(text: string): {
    datasources: PrismaDatasource[];
    generators?: PrismaGenerator[];
};
export declare function listRelations(text: string): {
    relations: PrismaRelation[];
    count: number;
};
export declare function lintSchema(text: string): Finding[];
