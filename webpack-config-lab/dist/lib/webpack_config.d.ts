/**
 * Shared webpack config text helpers.
 * Prefer robust JSONC; JS/TS configs via best-effort regex (no eval).
 * No webpack binary, no network, no filesystem follow.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type ParsedConfig = {
    raw: Record<string, unknown> | null;
    format: "jsonc" | "js-heuristic" | "empty" | "unknown";
    parseError?: string;
    heuristic?: boolean;
    multiCompiler?: boolean;
    /** Original source retained for plugin-name regex (JS configs). */
    source?: string;
};
export declare function asMap(value: unknown): Record<string, unknown> | null;
/**
 * Strip // line comments and block comments from JSONC-ish text,
 * respecting double-quoted strings (escape-aware).
 */
export declare function stripJsonComments(text: string): string;
/**
 * Extract a balanced [...] or {...} starting at index (must be [ or {).
 * String-aware; best-effort for JS source.
 */
export declare function extractBalanced(src: string, start: number): string | null;
/**
 * Heuristic JS/TS extraction for webpack.config.js / .ts / .mjs.
 * Limits: no eval, no require resolution, no spread/computed keys.
 */
export declare function heuristicExtractJs(text: string): Record<string, unknown>;
export declare function parseWebpackConfigText(text: string): ParsedConfig;
export type EntryItem = {
    name?: string;
    path?: string;
};
export type OutputSummary = {
    path?: string;
    filename?: string;
    publicPath?: string;
};
export type EntryPointsResult = {
    entry: unknown;
    entries: EntryItem[];
    mode?: string;
    output?: OutputSummary;
};
export declare function extractEntryPoints(raw: Record<string, unknown> | null): EntryPointsResult;
export type LoaderRule = {
    test?: string;
    use?: unknown;
    loader?: string;
    exclude?: string;
};
export type LoadersSummary = {
    rules: LoaderRule[];
    count: number;
};
export declare function extractLoaders(raw: Record<string, unknown> | null): LoadersSummary;
/**
 * Best-effort plugin names from parsed plugins array plus source regex.
 */
export declare function extractPlugins(raw: Record<string, unknown> | null, source?: string): {
    plugins: string[];
    count: number;
};
export declare function lintWebpackConfig(raw: Record<string, unknown> | null, parseError?: string, format?: ParsedConfig["format"], source?: string, multiCompiler?: boolean): Finding[];
