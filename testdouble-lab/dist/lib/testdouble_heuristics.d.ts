/**
 * Best-effort testdouble.js JS/TS text heuristics.
 * No testdouble runtime, no network, no filesystem follow, no eval / no TS AST.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type ReplacementInfo = {
    module?: string;
    name?: string;
};
export type WhenInfo = {
    call?: string;
    then?: string;
};
export type VerifyInfo = {
    call?: string;
    config?: string;
};
/** Strip line and block comments; leave strings roughly intact. */
export declare function stripComments(raw: string): string;
/**
 * Detect td / testdouble identifiers from imports and heuristics.
 */
export declare function detectTdImports(cleaned: string): {
    td: string[];
};
/**
 * List replacements from td.replace( / td.replaceEsm(
 */
export declare function listReplacements(text: string): {
    replacements: ReplacementInfo[];
    count: number;
};
/**
 * List td.when(...).thenReturn/thenResolve/thenReject/thenCallback
 */
export declare function listWhens(text: string): {
    whens: WhenInfo[];
    count: number;
};
/**
 * List td.verify( call [, config] )
 */
export declare function listVerifies(text: string): {
    verifies: VerifyInfo[];
    count: number;
};
export declare function lintTestdouble(text: string): Finding[];
