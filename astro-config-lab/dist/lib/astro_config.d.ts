/**
 * Shared astro.config text helpers.
 * defineConfig / export default best-effort heuristics (no eval).
 * No astro binary, no network, no filesystem follow.
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
export declare function parseAstroConfigText(text: string): ParsedConfig;
export type IntegrationsListResult = {
    integrations: string[];
    count: number;
};
export declare function extractIntegrations(raw: Record<string, unknown> | null, source?: string): IntegrationsListResult;
export type OutputModeResult = {
    output?: string;
    adapter?: string;
    site?: string;
    base?: string;
    trailingSlash?: string;
};
export declare function extractOutputMode(raw: Record<string, unknown> | null, source?: string): OutputModeResult;
export type ViteHintResult = {
    vite?: {
        plugins?: string[];
        server?: unknown;
        build?: unknown;
        keys: string[];
    };
};
export declare function extractViteHint(raw: Record<string, unknown> | null, source?: string): ViteHintResult;
export declare function lintAstroConfig(raw: Record<string, unknown> | null, parseError?: string, format?: ParsedConfig["format"], source?: string): Finding[];
