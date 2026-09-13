/**
 * Shared Packer HCL/JSON text helpers.
 * Pure regex/string heuristics — no packer CLI, build/deploy, network, filesystem follow, or eval.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type BuildInfo = {
    name?: string;
    type?: string;
    sources?: string[];
};
export type SourceInfo = {
    type?: string;
    name?: string;
    labels?: Record<string, string>;
};
export type ProvisionerInfo = {
    type?: string;
    only?: string[];
};
export declare function clampText(text: string): string;
/** Strip hash, line, and block comments loosely; keep string contents. */
export declare function stripCommentsKeepStrings(raw: string): string;
/** Extract build + source inventory from Packer HCL or legacy JSON. */
export declare function extractBuilds(text: string): BuildInfo[];
/** Extract source blocks with type/name and useful label hints. */
export declare function extractSources(text: string): SourceInfo[];
/** Extract provisioners and post-processors. */
export declare function extractProvisioners(text: string): {
    provisioners: ProvisionerInfo[];
    postProcessors: string[];
};
export declare function lintPacker(text: string): Finding[];
