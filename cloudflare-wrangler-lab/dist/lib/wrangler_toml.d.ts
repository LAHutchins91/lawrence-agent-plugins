/**
 * wrangler.toml text helpers.
 * Best-effort TOML subset + regex fallback. No wrangler CLI, no network, no filesystem follow.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type ParsedToml = {
    raw: Record<string, unknown> | null;
    format: "toml" | "empty" | "unknown";
    parseError?: string;
    source?: string;
};
export type WranglerNameMain = {
    name?: string;
    main?: string;
    compatibility_date?: string;
    compatibility_flags?: string[];
    account_id?: string;
    workers_dev?: boolean;
};
export type WranglerRoute = {
    pattern?: string;
    zone_name?: string;
    zone_id?: string;
    custom_domain?: boolean;
};
export type WranglerBindingsHint = {
    kv_namespaces?: string[];
    r2_buckets?: string[];
    d1_databases?: string[];
    vars?: string[];
    secrets_hint?: string[];
    services?: string[];
    durable_objects?: string[];
};
export declare function asMap(value: unknown): Record<string, unknown> | null;
export declare function parseWranglerTomlText(text: string): ParsedToml;
export declare function extractNameMain(raw: Record<string, unknown> | null, source?: string): WranglerNameMain;
export declare function extractRoutes(raw: Record<string, unknown> | null, source?: string): {
    routes: WranglerRoute[];
    count: number;
};
export declare function extractBindingsHint(raw: Record<string, unknown> | null, source?: string): WranglerBindingsHint;
export declare function lintWranglerToml(raw: Record<string, unknown> | null, parseError?: string, format?: ParsedToml["format"], source?: string): Finding[];
