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
export type ChartInfo = {
    name?: string;
    version?: string;
    apiVersion?: string;
    type?: string;
    appVersion?: string;
    description?: string;
    dependencies?: unknown;
};
export declare function extractChart(raw: unknown): ChartInfo | null;
export type ValueHint = {
    path: string;
    kind: string;
};
/** Walk values tree; collect top-level keys, nested hints, secret key names. */
export declare function analyzeValues(raw: unknown): {
    keys: string[];
    hints: ValueHint[];
    secretKeyNames: string[];
};
/** Extract kind: lines and Go-template bits from template text (may include {{ }}). */
export declare function analyzeTemplates(text: string): {
    kinds: string[];
    valuesRefs: string[];
    helpers: string[];
};
export declare function lintHelm(parts: {
    chartText?: string;
    valuesText?: string;
    templatesText?: string;
    combined?: string;
}): Finding[];
