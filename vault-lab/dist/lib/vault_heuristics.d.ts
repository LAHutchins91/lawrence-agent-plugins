/**
 * Shared Vault HCL policy / auth / secrets-engine text helpers.
 * Pure regex/string heuristics — no vault CLI, server, network, filesystem follow, or eval.
 * Educational only: flags path/capability patterns and secret-engine mount names/types —
 * never invents or decodes secrets, never teaches ACL bypass.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type PolicyInfo = {
    path?: string;
    capabilities?: string[];
};
export type EngineInfo = {
    type?: string;
    path?: string;
};
export declare function clampText(text: string): string;
/** Strip hash, line, and block comments loosely; keep string contents. */
export declare function stripCommentsKeepStrings(raw: string): string;
/** Parse policy path blocks: path "..." { capabilities = [...] }. */
export declare function extractPolicies(text: string): PolicyInfo[];
/** Detect auth methods mentioned in config/HCL text. */
export declare function extractAuths(text: string): string[];
/** Detect secrets engine mounts/types — paths and types only, never secret values. */
export declare function extractEngines(text: string): EngineInfo[];
export declare function lintVault(text: string): Finding[];
