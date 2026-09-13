export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type AppSpecDoc = {
    raw: Record<string, unknown> | null;
    parseError?: string;
    name?: string;
    region?: string;
};
export type ServiceSummary = {
    name?: string;
    http_port?: number;
    instance_count?: number;
    instance_size_slug?: string;
};
export type NamedComponent = {
    name?: string;
};
export declare function parseAppSpecText(text: string): AppSpecDoc;
export declare function listServices(doc: AppSpecDoc): {
    services: ServiceSummary[];
    workers?: NamedComponent[];
    jobs?: NamedComponent[];
    static_sites?: NamedComponent[];
    count: number;
};
export declare function extractEnvKeys(doc: AppSpecDoc): {
    keys: string[];
    count: number;
    scopes?: string[];
    redacted?: string[];
};
export type RouteHint = {
    path?: string;
    preserve_path_prefix?: boolean;
};
export declare function extractRoutesHint(doc: AppSpecDoc): {
    ingress?: unknown;
    routes: RouteHint[];
    domains?: string[];
    alertrules_hint?: boolean;
};
export declare function lintAppSpec(doc: AppSpecDoc): Finding[];
