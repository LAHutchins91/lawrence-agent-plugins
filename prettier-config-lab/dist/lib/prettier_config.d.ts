/**
 * Shared Prettier config text helpers.
 * Prefer robust JSONC; YAML via yaml package; JS configs via best-effort regex.
 * No prettier binary, no network, no filesystem config follow.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type ParsedConfig = {
    raw: Record<string, unknown> | null;
    format: "jsonc" | "yaml" | "js-heuristic" | "empty" | "unknown";
    parseError?: string;
    heuristic?: boolean;
};
/** Core Prettier option keys (excluding plugins/overrides meta). */
export declare const CORE_OPTION_KEYS: readonly ["printWidth", "tabWidth", "useTabs", "semi", "singleQuote", "quoteProps", "jsxSingleQuote", "trailingComma", "bracketSpacing", "bracketSameLine", "jsxBracketSameLine", "arrowParens", "rangeStart", "rangeEnd", "parser", "filepath", "requirePragma", "insertPragma", "proseWrap", "htmlWhitespaceSensitivity", "vueIndentScriptAndStyle", "endOfLine", "embeddedLanguageFormatting", "singleAttributePerLine"];
export type OverrideEntry = {
    files?: string | string[];
    options?: Record<string, unknown>;
    excludeFiles?: string | string[];
};
export declare function asMap(value: unknown): Record<string, unknown> | null;
/**
 * Strip // line comments and block comments from JSONC-ish text,
 * respecting double-quoted strings (escape-aware).
 */
export declare function stripJsonComments(text: string): string;
/**
 * Heuristic JS extraction for prettier.config.js / .prettierrc.js style text.
 * Limits: no eval, no require resolution, no spread/computed keys.
 */
export declare function heuristicExtractJs(text: string): Record<string, unknown>;
export declare function parsePrettierConfigText(text: string): ParsedConfig;
export declare function normalizeStringList(value: unknown): string[];
export declare function extractCoreOptions(raw: Record<string, unknown> | null): Record<string, unknown>;
export declare function extractPlugins(raw: Record<string, unknown> | null): string[];
export declare function extractOverrides(raw: Record<string, unknown> | null): OverrideEntry[];
export declare function lintPrettierConfig(raw: Record<string, unknown> | null, parseError?: string, format?: ParsedConfig["format"]): Finding[];
