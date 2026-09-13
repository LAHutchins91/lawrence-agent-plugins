/**
 * Shared ESLint config text helpers.
 * Prefer robust JSONC; YAML via yaml package; JS configs via best-effort regex.
 * No eslint binary, no network, no filesystem config follow.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type RuleSeverity = "error" | "warn" | "off" | "other";
export type ParsedConfig = {
    /** Normalized object-ish view when available */
    raw: Record<string, unknown> | null;
    /** Source format detected */
    format: "jsonc" | "yaml" | "js-heuristic" | "empty" | "unknown";
    parseError?: string;
    /** True when only partial heuristic extraction from JS succeeded */
    heuristic?: boolean;
};
export declare function asMap(value: unknown): Record<string, unknown> | null;
/**
 * Strip // line comments and block comments from JSONC-ish text,
 * respecting double-quoted strings (escape-aware).
 */
export declare function stripJsonComments(text: string): string;
/**
 * Heuristic JS extraction for .eslintrc.js / eslint.config.js style text.
 * Limits: no eval, no require resolution, no spread/computed keys, flat-config
 * multi-object merges are best-effort (first matching keys win / concat).
 */
export declare function heuristicExtractJs(text: string): Record<string, unknown>;
export declare function parseEslintConfigText(text: string): ParsedConfig;
export declare function normalizeStringList(value: unknown): string[];
export declare function extractExtends(raw: Record<string, unknown> | null): string[];
export declare function normalizeSeverity(value: unknown): RuleSeverity;
export type RuleEntry = {
    id: string;
    severity: RuleSeverity;
};
export declare function extractRules(raw: Record<string, unknown> | null): RuleEntry[];
export declare function extractEnvList(raw: Record<string, unknown> | null): string[];
export declare function extractPlugins(raw: Record<string, unknown> | null): string[];
/**
 * Map plugin: name / from extends string like "plugin:react/recommended"
 * → expected plugin package short name "react"
 */
export declare function pluginNameFromExtends(ext: string): string | null;
export declare function lintEslintConfig(raw: Record<string, unknown> | null, parseError?: string, format?: ParsedConfig["format"]): Finding[];
