/**
 * Shared Jest config text helpers.
 * Prefer robust JSONC; JS configs via best-effort regex (no eval).
 * Unwrap package.json "jest" key. No jest binary, no network, no filesystem follow.
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
    fromPackageJson?: boolean;
};
/** Known Jest option keys we care about for extraction / lint. */
export declare const JEST_OPTION_KEYS: readonly ["testMatch", "testRegex", "testPathIgnorePatterns", "roots", "rootDir", "collectCoverage", "coverageDirectory", "coverageThreshold", "collectCoverageFrom", "coverageReporters", "coveragePathIgnorePatterns", "projects", "transform", "transformIgnorePatterns", "moduleNameMapper", "moduleFileExtensions", "setupFiles", "setupFilesAfterEnv", "testEnvironment", "testEnvironmentOptions", "testURL", "timers", "fakeTimers", "browser", "mapCoverage", "setupTestFrameworkScriptFile", "scriptPreprocessor", "preprocessorIgnorePatterns", "testPathDirs", "globals", "preset", "displayName", "verbose", "bail", "maxWorkers", "testTimeout"];
export declare function asMap(value: unknown): Record<string, unknown> | null;
/**
 * Strip // line comments and block comments from JSONC-ish text,
 * respecting double-quoted strings (escape-aware).
 */
export declare function stripJsonComments(text: string): string;
/**
 * Heuristic JS extraction for jest.config.js / babel-style module.exports.
 * Limits: no eval, no require resolution, no spread/computed keys.
 */
export declare function heuristicExtractJs(text: string): Record<string, unknown>;
export declare function parseJestConfigText(text: string): ParsedConfig;
export declare function normalizeStringList(value: unknown): string[];
export declare function normalizeStringOrStringList(value: unknown): string | string[] | undefined;
export type TestMatchSummary = {
    testMatch?: string[];
    testRegex?: string | string[];
    testPathIgnorePatterns?: string[];
    roots?: string[];
};
export declare function extractTestMatch(raw: Record<string, unknown> | null): TestMatchSummary;
export type CoverageSummary = {
    collectCoverage?: boolean;
    coverageDirectory?: string;
    coverageThreshold?: unknown;
    collectCoverageFrom?: string[];
    coverageReporters?: string[];
};
export declare function extractCoverage(raw: Record<string, unknown> | null): CoverageSummary;
export type ProjectsList = {
    projects: unknown[];
    count: number;
};
export declare function extractProjects(raw: Record<string, unknown> | null): ProjectsList;
export declare function lintJestConfig(raw: Record<string, unknown> | null, parseError?: string, format?: ParsedConfig["format"], fromPackageJson?: boolean): Finding[];
