/**
 * Shared package.json text helpers.
 * String/JSON analysis only — no npm install, no network.
 */
export type PkgDoc = {
    raw: Record<string, unknown> | null;
    parseError?: string;
};
export declare function asMap(value: unknown): Record<string, unknown> | null;
export declare function parsePackageText(text: string): PkgDoc;
export declare function stringKeys(map: Record<string, unknown> | null | undefined): string[];
export declare function depKeys(raw: Record<string, unknown> | null, field: string): string[];
export declare function pkgName(raw: Record<string, unknown> | null): string | undefined;
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export declare function lintPackage(text: string, raw: Record<string, unknown> | null, parseError?: string): Finding[];
