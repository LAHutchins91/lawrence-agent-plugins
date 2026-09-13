/**
 * Shared Tiltfile text helpers.
 * Pure regex/string heuristics — no Tilt CLI, cluster, network, filesystem follow, or Starlark eval.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type ResourceInfo = {
    kind: string;
    name?: string;
    image?: string;
};
export type TriggerInfo = {
    resource?: string;
    deps?: string[];
    resourceDeps?: string[];
    triggerMode?: string;
};
export type ExtensionInfo = {
    path?: string;
    symbols?: string[];
};
/** Strip # line comments (naive; ignores strings). */
export declare function stripComments(text: string): string;
/** Parse a Python/Starlark-ish list literal of strings: ['a', "b"] */
export declare function parseStringList(raw: string): string[];
export declare function extractResources(text: string): ResourceInfo[];
export declare function extractTriggers(text: string): TriggerInfo[];
export declare function extractExtensions(text: string): ExtensionInfo[];
export declare function lintTiltfile(text: string): Finding[];
