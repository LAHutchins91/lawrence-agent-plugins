/**
 * Shared Consul HCL/JSON text helpers.
 * Pure regex/string heuristics — no consul CLI, agent, network, filesystem follow, or eval.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type ServiceInfo = {
    name?: string;
    port?: number;
    tags?: string[];
    kind?: string;
};
export type CheckInfo = {
    name?: string;
    type?: string;
    interval?: string;
};
export type IntentionInfo = {
    source?: string;
    destination?: string;
    action?: string;
};
export declare function clampText(text: string): string;
/** Strip hash, line, and block comments loosely; keep string contents. */
export declare function stripCommentsKeepStrings(raw: string): string;
/** Extract service blocks / JSON services: name, port, tags, kind. */
export declare function extractServices(text: string): ServiceInfo[];
/** Extract health checks: http, tcp, script, ttl, grpc + interval. */
export declare function extractChecks(text: string): CheckInfo[];
/** Extract intentions / service-intentions: source, destination, action. */
export declare function extractIntentions(text: string): IntentionInfo[];
export declare function lintConsul(text: string): Finding[];
