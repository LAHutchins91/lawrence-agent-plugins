/**
 * Shared rollup config text helpers.
 * Prefer robust JSONC; JS/TS configs via best-effort regex (no eval).
 * No rollup binary, no network, no filesystem follow.
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
    multiConfig?: boolean;
    source?: string;
};
export declare function asMap(value: unknown): Record<string, unknown> | null;
export declare function stripJsonComments(text: string): string;
export declare function extractBalanced(src: string, start: number): string | null;
export declare function heuristicExtractJs(text: string): Record<string, unknown>;
export declare function parseRollupConfigText(text: string): ParsedConfig;
export type InputListResult = {
    input: unknown;
    inputs: string[];
    count: number;
};
export declare function extractInputs(raw: Record<string, unknown> | null): InputListResult;
export type OutputItem = {
    file?: string;
    dir?: string;
    format?: string;
    name?: string;
    exports?: string;
};
export type OutputFormatsResult = {
    outputs: OutputItem[];
    formats: string[];
    count: number;
};
export declare function extractOutputs(raw: Record<string, unknown> | null): OutputFormatsResult;
export declare function extractPlugins(raw: Record<string, unknown> | null, source?: string): {
    plugins: string[];
    count: number;
};
export declare function lintRollupConfig(raw: Record<string, unknown> | null, parseError?: string, format?: ParsedConfig["format"], source?: string, multiConfig?: boolean): Finding[];
