/**
 * Shared Cypress config text helpers.
 * Prefer robust JSONC; JS/TS configs via best-effort regex + defineConfig unwrap (no eval).
 * No cypress binary, no network, no filesystem follow.
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
};
/** Common Cypress option keys we care about for extraction / lint. */
export declare const CYPRESS_TOP_KEYS: readonly ["e2e", "component", "env", "projectId", "baseUrl", "chromeWebSecurity", "video", "videosFolder", "screenshotOnRunFailure", "screenshotsFolder", "viewportWidth", "viewportHeight", "defaultCommandTimeout", "requestTimeout", "responseTimeout", "pageLoadTimeout", "retries", "watchForFileChanges", "trashAssetsBeforeRuns", "numTestsKeptInMemory", "experimentalStudio", "fixturesFolder", "downloadsFolder", "supportFolder", "integrationFolder", "testFiles", "pluginsFile", "ignoreTestFiles"];
export declare const E2E_OPTION_KEYS: readonly ["baseUrl", "specPattern", "supportFile", "excludeSpecPattern", "viewportWidth", "viewportHeight", "setupNodeEvents", "chromeWebSecurity", "video", "videosFolder", "screenshotOnRunFailure", "screenshotsFolder", "defaultCommandTimeout", "requestTimeout", "responseTimeout", "pageLoadTimeout", "retries", "env", "experimentalRunAllSpecs", "experimentalStudio", "testIsolation"];
export declare const COMPONENT_OPTION_KEYS: readonly ["devServer", "specPattern", "supportFile", "excludeSpecPattern", "indexHtmlFile", "viewportWidth", "viewportHeight", "setupNodeEvents", "env"];
export declare function asMap(value: unknown): Record<string, unknown> | null;
/**
 * Strip // line comments and block comments from JSONC-ish text,
 * respecting double-quoted strings (escape-aware).
 */
export declare function stripJsonComments(text: string): string;
/**
 * Heuristic JS/TS extraction for cypress.config.js / .ts.
 * Limits: no eval, no require resolution, no spread/computed keys.
 */
export declare function heuristicExtractJs(text: string): Record<string, unknown>;
export declare function parseCypressConfigText(text: string): ParsedConfig;
export declare function normalizeStringList(value: unknown): string[];
export type E2eSummary = {
    e2e?: Record<string, unknown>;
    keys: string[];
};
export declare function extractE2e(raw: Record<string, unknown> | null): E2eSummary;
export type ComponentSummary = {
    component?: Record<string, unknown>;
    keys: string[];
};
export declare function extractComponent(raw: Record<string, unknown> | null): ComponentSummary;
export type EnvKeysSummary = {
    env: Record<string, unknown>;
    keys: string[];
    count: number;
};
/**
 * Merge top-level env with nested e2e.env / component.env.
 * Optionally redact obvious secret-looking values; keys always listed.
 */
export declare function extractEnv(raw: Record<string, unknown> | null, redact?: boolean): EnvKeysSummary;
export declare function lintCypressConfig(raw: Record<string, unknown> | null, parseError?: string, format?: ParsedConfig["format"]): Finding[];
