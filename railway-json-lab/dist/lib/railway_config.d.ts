export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type ParsedConfig = {
    raw: Record<string, unknown> | null;
    format: "jsonc" | "toml" | "empty" | "unknown";
    parseError?: string;
    source?: string;
};
export type RailwayService = {
    name?: string;
    build?: Record<string, unknown>;
    deploy?: Record<string, unknown>;
};
export type RailwayDeployHint = {
    buildCommand?: string;
    startCommand?: string;
    watchPatterns?: string[];
    numReplicas?: number;
    healthcheckPath?: string;
    restartPolicyType?: string;
};
export declare function asMap(value: unknown): Record<string, unknown> | null;
export declare function stripJsonComments(text: string): string;
export declare function parseRailwayConfigText(text: string): ParsedConfig;
export declare function extractServices(raw: Record<string, unknown> | null): {
    services: RailwayService[];
    count: number;
};
export declare function extractEnvKeys(raw: Record<string, unknown> | null): {
    keys: string[];
    count: number;
    redacted?: string[];
};
export declare function extractDeployHint(raw: Record<string, unknown> | null): RailwayDeployHint;
export declare function lintRailwayConfig(raw: Record<string, unknown> | null, parseError?: string, format?: ParsedConfig["format"]): Finding[];
