/**
 * Shared postcss config text helpers.
 * Prefer robust JSONC; JS/TS configs via best-effort regex (no eval).
 * No postcss binary, no network, no filesystem follow.
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
    unwrappedPackagePostcss?: boolean;
    source?: string;
};
export declare function asMap(value: unknown): Record<string, unknown> | null;
export declare function stripJsonComments(text: string): string;
export declare function extractBalanced(src: string, start: number): string | null;
export declare function heuristicExtractJs(text: string): Record<string, unknown>;
export declare function parsePostcssConfigText(text: string): ParsedConfig;
export type PluginListResult = {
    plugins: string[];
    count: number;
};
export declare function extractPlugins(raw: Record<string, unknown> | null, source?: string): PluginListResult;
export type SyntaxHintResult = {
    syntax?: string;
    parser?: string;
    stringifier?: string;
};
export declare function extractSyntaxHint(raw: Record<string, unknown> | null, source?: string): SyntaxHintResult;
export type MapOptionsResult = {
    map?: boolean | object;
    from?: string;
    to?: string;
};
export declare function extractMapOptions(raw: Record<string, unknown> | null, source?: string): MapOptionsResult;
export declare function lintPostcssConfig(raw: Record<string, unknown> | null, parseError?: string, format?: ParsedConfig["format"], source?: string, unwrappedPackagePostcss?: boolean): Finding[];
