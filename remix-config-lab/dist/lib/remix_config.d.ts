/**
 * Shared remix.config / vite remix({…}) text helpers.
 * Classic AppConfig + vitePlugin remix options — best-effort heuristics (no eval).
 * No remix binary, no network, no filesystem follow.
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
    source?: string;
    /** classic remix.config vs vite remix({…}) plugin options */
    flavor?: "classic" | "vite-plugin" | "unknown";
};
export declare function asMap(value: unknown): Record<string, unknown> | null;
export declare function stripJsonComments(text: string): string;
export declare function extractBalanced(src: string, start: number): string | null;
export declare function heuristicExtractJs(text: string): {
    out: Record<string, unknown>;
    fromPlugin: boolean;
};
export declare function parseRemixConfigText(text: string): ParsedConfig;
export type RoutesHintResult = {
    appDirectory?: string;
    routes?: string;
    ignoredRouteFiles?: string[];
    assetsBuildDirectory?: string;
    publicPath?: string;
};
export declare function extractRoutesHint(raw: Record<string, unknown> | null, source?: string): RoutesHintResult;
export type ServerBuildHintResult = {
    serverBuildPath?: string;
    serverModuleFormat?: string;
    serverPlatform?: string;
    server?: string;
    serverBuildTarget?: string;
};
export declare function extractServerBuildHint(raw: Record<string, unknown> | null, source?: string): ServerBuildHintResult;
export type FutureFlagsResult = {
    future: Record<string, boolean | unknown>;
    keys: string[];
};
export declare function extractFutureFlags(raw: Record<string, unknown> | null, source?: string): FutureFlagsResult;
export declare function lintRemixConfig(raw: Record<string, unknown> | null, parseError?: string, format?: ParsedConfig["format"], source?: string, flavor?: ParsedConfig["flavor"]): Finding[];
