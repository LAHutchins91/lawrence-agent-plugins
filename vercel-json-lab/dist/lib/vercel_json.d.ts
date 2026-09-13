/**
 * Shared vercel.json text helpers.
 * JSON / JSONC best-effort heuristics. No vercel CLI, no network, no filesystem follow.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type ParsedConfig = {
    raw: Record<string, unknown> | null;
    format: "jsonc" | "empty" | "unknown";
    parseError?: string;
    source?: string;
};
export type VercelRewrite = {
    source?: string;
    destination?: string;
    has?: unknown;
};
export type VercelRedirect = {
    source?: string;
    destination?: string;
    permanent?: boolean;
    statusCode?: number;
};
export type VercelHeaderEntry = {
    key: string;
    value: string;
};
export type VercelHeadersRule = {
    source?: string;
    headers: VercelHeaderEntry[];
};
export declare function asMap(value: unknown): Record<string, unknown> | null;
export declare function stripJsonComments(text: string): string;
export declare function parseVercelJsonText(text: string): ParsedConfig;
export declare function extractRewrites(raw: Record<string, unknown> | null): {
    rewrites: VercelRewrite[];
    count: number;
};
export declare function extractRedirects(raw: Record<string, unknown> | null): {
    redirects: VercelRedirect[];
    count: number;
};
export declare function extractHeadersHint(raw: Record<string, unknown> | null): {
    headers: VercelHeadersRule[];
    count: number;
    keys: string[];
};
export type TopLevelSummary = {
    version?: number | string;
    hasBuilds: boolean;
    buildsCount: number;
    hasFunctions: boolean;
    functionKeys: string[];
    cleanUrls?: boolean;
    trailingSlash?: boolean;
    hasRoutes: boolean;
    routesCount: number;
};
export declare function extractTopLevelSummary(raw: Record<string, unknown> | null): TopLevelSummary;
export declare function lintVercelJson(raw: Record<string, unknown> | null, parseError?: string, format?: ParsedConfig["format"]): Finding[];
