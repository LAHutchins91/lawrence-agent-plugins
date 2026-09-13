/**
 * Shared babel config text helpers.
 * Prefer robust JSONC; JS/TS configs via best-effort regex (no eval).
 * No babel binary, no network, no filesystem follow.
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
    unwrappedPackageBabel?: boolean;
    source?: string;
};
export declare function asMap(value: unknown): Record<string, unknown> | null;
export declare function stripJsonComments(text: string): string;
export declare function extractBalanced(src: string, start: number): string | null;
export declare function heuristicExtractJs(text: string): Record<string, unknown>;
export declare function parseBabelConfigText(text: string): ParsedConfig;
/** Normalize a babel preset/plugin entry to a display name. */
export declare function entryName(item: unknown): string | undefined;
/** Prefer keeping structured entries (string | [name, opts] | object). */
export declare function normalizeEntry(item: unknown): string | object;
export type PresetListResult = {
    presets: (string | object)[];
    names: string[];
    count: number;
};
export type PluginListResult = {
    plugins: (string | object)[];
    names: string[];
    count: number;
};
export declare function extractPresets(raw: Record<string, unknown> | null): PresetListResult;
export declare function extractPlugins(raw: Record<string, unknown> | null, source?: string): PluginListResult;
export type EnvTargetsResult = {
    targets?: unknown;
    browserslist?: unknown;
    env?: Record<string, unknown>;
    envKeys: string[];
};
export declare function extractEnvTargets(raw: Record<string, unknown> | null): EnvTargetsResult;
export declare function lintBabelConfig(raw: Record<string, unknown> | null, parseError?: string, format?: ParsedConfig["format"], source?: string, unwrappedPackageBabel?: boolean): Finding[];
