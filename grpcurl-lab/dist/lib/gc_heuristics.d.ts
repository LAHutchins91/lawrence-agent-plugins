/**
 * Best-effort grpcurl CLI text heuristics.
 * No grpcurl/gRPC runtime, no network, no filesystem follow, no eval.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type TargetInfo = {
    host?: string;
};
export type MethodInfo = {
    service?: string;
    method?: string;
};
export type MetadataInfo = {
    flag: "-H" | "-rpc-header" | "-reflect-metadata" | string;
    value?: string;
};
/** Strip BOM, normalize newlines, drop # / // comments (quote-aware; keep ://). */
export declare function stripComments(raw: string): string;
/**
 * List targets (hosts) and service names from grpcurl invocations / list / service names.
 */
export declare function listServices(text: string): {
    targets: TargetInfo[];
    services: string[];
    count: number;
};
/**
 * Extract fully-qualified method calls: package.Service/Method.
 */
export declare function listMethods(text: string): {
    methods: MethodInfo[];
    count: number;
};
/**
 * Extract -H / -rpc-header / -reflect-metadata values (auth-looking values redacted).
 */
export declare function listMetadata(text: string): {
    metadata: MetadataInfo[];
    count: number;
};
export declare function lintGrpcurl(text: string): Finding[];
