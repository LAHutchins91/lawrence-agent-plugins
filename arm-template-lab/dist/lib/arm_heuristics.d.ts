/**
 * Shared Azure ARM template JSON text helpers.
 * Pure JSON string heuristics — no az CLI, deploy, network, filesystem follow, or eval.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type ResourceInfo = {
    type?: string;
    name?: string;
    apiVersion?: string;
    location?: string;
};
export type ParameterInfo = {
    name: string;
    type?: string;
    hasDefault?: boolean;
    secure?: boolean;
};
export type OutputInfo = {
    name: string;
    type?: string;
};
export declare function asMap(value: unknown): Record<string, unknown> | null;
export declare function strField(map: Record<string, unknown> | null, key: string): string | undefined;
/** Best-effort JSON parse; returns null on empty/invalid. */
export declare function parseJsonObject(text: string): unknown | null;
/** Extract resources[] entries (type, name, apiVersion, location). */
export declare function extractResources(text: string): ResourceInfo[];
/** Extract parameters (name, type, hasDefault, secure). */
export declare function extractParameters(text: string): ParameterInfo[];
/** Extract outputs (name, type). */
export declare function extractOutputs(text: string): OutputInfo[];
export declare function lintArm(text: string): Finding[];
