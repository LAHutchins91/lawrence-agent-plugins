export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type StackInfo = {
    name?: string;
    runtime?: string;
    description?: string;
    main?: string;
    backend?: string;
};
export type ResourceInfo = {
    type?: string;
    name?: string;
};
export declare function asMap(value: unknown): Record<string, unknown> | null;
export declare function strField(map: Record<string, unknown> | null, key: string): string | undefined;
/** Best-effort YAML parse; returns null on empty/invalid. */
export declare function parseYamlObject(text: string): unknown | null;
export declare function parseYamlDocs(text: string): unknown[];
/** Extract project/stack hints from Pulumi.yaml-ish YAML or loose text. */
export declare function extractStacks(text: string): StackInfo[];
/** Heuristic resource constructors from TS/Py/Go/YAML-ish program text. */
export declare function extractResources(text: string): ResourceInfo[];
/** Extract config key names and secret key names (names only). */
export declare function extractConfig(text: string): {
    configKeys: string[];
    secretKeys: string[];
};
export declare function lintPulumi(text: string): Finding[];
