/**
 * Shared Expo app.json / app.config text helpers.
 * Root or nested expo: {} — best-effort heuristics (no eval).
 * No expo binary, no network, no filesystem follow.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type ParsedConfig = {
    raw: Record<string, unknown> | null;
    /** ExpoConfig object (unwrapped from expo: {} when present) */
    expo: Record<string, unknown> | null;
    format: "jsonc" | "js-heuristic" | "empty" | "unknown";
    parseError?: string;
    heuristic?: boolean;
    source?: string;
};
export declare function asMap(value: unknown): Record<string, unknown> | null;
export declare function stripJsonComments(text: string): string;
export declare function extractBalanced(src: string, start: number): string | null;
export declare function unwrapExpo(raw: Record<string, unknown> | null): Record<string, unknown> | null;
export declare function heuristicExtractJs(text: string): Record<string, unknown>;
export declare function parseExpoConfigText(text: string): ParsedConfig;
export type SlugNameResult = {
    name?: string;
    slug?: string;
    version?: string;
    orientation?: string;
    sdkVersion?: string;
    owner?: string;
};
export declare function extractSlugName(expo: Record<string, unknown> | null, source?: string): SlugNameResult;
export type PluginsListResult = {
    plugins: (string | object)[];
    names: string[];
    count: number;
};
export declare function extractPluginsList(expo: Record<string, unknown> | null, source?: string): PluginsListResult;
export type SchemeListResult = {
    scheme?: string | string[];
    schemes: string[];
    iosBundleId?: string;
    androidPackage?: string;
};
export declare function extractSchemeList(expo: Record<string, unknown> | null, source?: string): SchemeListResult;
export declare function lintExpoConfig(expo: Record<string, unknown> | null, parseError?: string, format?: ParsedConfig["format"], source?: string): Finding[];
