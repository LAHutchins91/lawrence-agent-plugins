/**
 * Best-effort class-validator / class-transformer TS decorator text heuristics.
 * No class-validator runtime, no network, no filesystem follow, no eval / no TS AST.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type DtoInfo = {
    name: string;
    properties: string[];
};
export type DecoratorInfo = {
    dto?: string;
    property?: string;
    name: string;
};
export type NestedInfo = {
    dto?: string;
    property?: string;
    type?: string;
    each?: boolean;
};
/** Strip line and block comments; leave strings roughly intact. */
export declare function stripComments(raw: string): string;
/**
 * List DTO classes that use class-validator (or class-transformer) decorators.
 */
export declare function listDtos(text: string): {
    dtos: DtoInfo[];
    count: number;
};
/**
 * List CV / CT decorator usages per property.
 */
export declare function listDecorators(text: string): {
    decorators: DecoratorInfo[];
    count: number;
};
/**
 * Nested hints from @ValidateNested / @Type(() => Foo).
 */
export declare function listNested(text: string): {
    nested: NestedInfo[];
    count: number;
};
export declare function lintCv(text: string): Finding[];
