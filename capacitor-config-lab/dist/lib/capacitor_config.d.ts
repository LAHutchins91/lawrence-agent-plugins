/**
 * Shared capacitor.config JSON / JS / TS text helpers.
 * Best-effort heuristics (no eval). No capacitor binary, no network, no filesystem follow.
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
};
export declare function asMap(value: unknown): Record<string, unknown> | null;
export declare function stripJsonComments(text: string): string;
export declare function extractBalanced(src: string, start: number): string | null;
export declare function heuristicExtractJs(text: string): Record<string, unknown>;
export declare function parseCapacitorConfigText(text: string): ParsedConfig;
export type AppIdResult = {
    appId?: string;
    appName?: string;
    webDir?: string;
    bundledWebRuntime?: boolean;
};
export declare function extractAppId(raw: Record<string, unknown> | null, source?: string): AppIdResult;
export type PluginsListResult = {
    plugins: string[];
    count: number;
    pluginConfig?: Record<string, unknown>;
};
export declare function extractPluginsList(raw: Record<string, unknown> | null, source?: string): PluginsListResult;
export type ServerUrlHintResult = {
    server?: {
        url?: string;
        cleartext?: boolean;
        allowNavigation?: string[];
    };
    androidScheme?: string;
    iosScheme?: string;
};
export declare function extractServerUrlHint(raw: Record<string, unknown> | null, source?: string): ServerUrlHintResult;
export declare function lintCapacitorConfig(raw: Record<string, unknown> | null, parseError?: string, format?: ParsedConfig["format"], source?: string): Finding[];
