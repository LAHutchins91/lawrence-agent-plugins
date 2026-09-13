/**
 * Shared tsconfig.json / JSONC text helpers.
 * String analysis only — strip comments, parse JSON; no tsc exec, no FS.
 */
export type TsconfigDoc = {
    raw: Record<string, unknown> | null;
    parseError?: string;
};
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export declare function asMap(value: unknown): Record<string, unknown> | null;
/**
 * Strip // line comments and block comments from JSONC-ish text,
 * respecting double-quoted strings (escape-aware).
 */
export declare function stripJsonComments(text: string): string;
export declare function parseTsconfigText(text: string): TsconfigDoc;
export declare function compilerOptionsMap(raw: Record<string, unknown> | null): Record<string, unknown>;
/**
 * Normalize paths map values to string[].
 */
export declare function normalizePaths(value: unknown): Record<string, string[]>;
/**
 * Report extends as declared string | string[] | null; chain = flattened declared refs.
 * Does NOT fetch or read files.
 */
export declare function parseExtends(raw: Record<string, unknown> | null): {
    extends: string | string[] | null;
    chain: string[];
};
export declare function lintTsconfig(raw: Record<string, unknown> | null, parseError?: string): Finding[];
