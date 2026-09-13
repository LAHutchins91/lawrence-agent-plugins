export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export declare function asMap(value: unknown): Record<string, unknown> | null;
export declare function strField(map: Record<string, unknown> | null, key: string): string | undefined;
/** Best-effort YAML parse; returns null on empty/invalid. */
export declare function parseYamlObject(text: string): unknown | null;
export declare function parseYamlDocs(text: string): unknown[];
export type PipelineInfo = {
    name?: string;
    apiVersion?: string;
    profiles?: string[];
};
export type BuildInfo = {
    image?: string;
    context?: string;
    dockerfile?: string;
    builder?: string;
};
export type DeployInfo = {
    type?: string;
    paths?: string[];
    releases?: unknown[];
};
export declare function extractPipeline(raw: unknown): PipelineInfo | null;
export declare function extractBuilds(raw: unknown): BuildInfo[];
export declare function extractDeploys(raw: unknown): DeployInfo[];
export declare function lintSkaffold(text: string): Finding[];
