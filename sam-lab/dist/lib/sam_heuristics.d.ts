export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type FunctionInfo = {
    id?: string;
    runtime?: string;
    handler?: string;
    timeout?: number | string;
    memory?: number | string;
};
export type EventInfo = {
    function?: string;
    type?: string;
    properties?: Record<string, unknown>;
};
export declare function asMap(value: unknown): Record<string, unknown> | null;
export declare function strField(map: Record<string, unknown> | null, key: string): string | undefined;
export declare function numOrStrField(map: Record<string, unknown> | null, key: string): number | string | undefined;
/** Best-effort YAML parse; returns null on empty/invalid. */
export declare function parseYamlObject(text: string): unknown | null;
export declare function parseYamlDocs(text: string): unknown[];
/** Extract AWS::Serverless::Function / AWS::Lambda::Function entries. */
export declare function extractFunctions(text: string): FunctionInfo[];
/** Extract Events attached to Serverless Functions. */
export declare function extractEvents(text: string): EventInfo[];
export type GlobalsHint = {
    globals?: Record<string, unknown>;
    transform?: string | string[];
    description?: string;
    parameters?: string[];
    count: number;
};
/** Extract Globals, Transform, Description, Parameters keys. */
export declare function extractGlobalsHint(text: string): GlobalsHint;
export declare function lintSam(text: string): Finding[];
