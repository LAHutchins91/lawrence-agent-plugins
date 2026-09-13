export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type StackInfo = {
    name?: string;
    language?: string;
    app?: string;
};
export type ResourceInfo = {
    type?: string;
    name?: string;
};
export declare function asMap(value: unknown): Record<string, unknown> | null;
export declare function strField(map: Record<string, unknown> | null, key: string): string | undefined;
/** Best-effort JSON parse; returns null on empty/invalid. */
export declare function parseJsonObject(text: string): unknown | null;
/** Best-effort YAML parse (for loose / mixed pastes). */
export declare function parseYamlObject(text: string): unknown | null;
export declare function parseYamlDocs(text: string): unknown[];
export type CdktfMeta = {
    language?: string;
    app?: string;
    projectId?: string;
    providers: string[];
    modules: string[];
};
/** Parse cdktf.json-ish JSON (or JSON-ish fragment) for project metadata. */
export declare function extractCdktfMeta(text: string): CdktfMeta;
/** Extract stack names + language/app hints from cdktf.json / app text. */
export declare function extractStacks(text: string): {
    stacks: StackInfo[];
    language?: string;
    providers?: string[];
    projectId?: string;
    app?: string;
};
/** Detect terraformProviders + TS provider imports/constructors. */
export declare function extractProviders(text: string): string[];
/** Heuristic resource constructors + HCL-ish resource blocks. */
export declare function extractResources(text: string): ResourceInfo[];
export declare function lintCdktf(text: string): Finding[];
