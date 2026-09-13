export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type ChartInfo = {
    name?: string;
    apiVersion?: string;
    language?: string;
    runtime?: string;
    app?: string;
    description?: string;
    version?: string;
};
export type ImportInfo = {
    kind: string;
    module?: string;
    detail?: string;
};
export type ResourceInfo = {
    type?: string;
    name?: string;
    kind?: string;
    apiVersion?: string;
};
export declare function asMap(value: unknown): Record<string, unknown> | null;
export declare function strField(map: Record<string, unknown> | null, key: string): string | undefined;
export declare function parseYamlObject(text: string): unknown | null;
export declare function parseYamlDocs(text: string): unknown[];
/** Extract chart/app hints from cdk8s.yaml / Chart.yaml-ish / class Chart text. */
export declare function extractCharts(text: string): ChartInfo[];
/** Detect cdk8s / cdk8s-plus / imports/k8s / CRD / ApiObject imports. */
export declare function extractImports(text: string): ImportInfo[];
/** Heuristic resource constructors from cdk8s program or synth YAML. */
export declare function extractResources(text: string): ResourceInfo[];
export declare function lintCdk8s(text: string): Finding[];
