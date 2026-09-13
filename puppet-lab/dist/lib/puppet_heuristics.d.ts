/**
 * Shared Puppet manifest/module text helpers.
 * Pure regex/string heuristics — no Puppet CLI, agent/apply, network, filesystem follow, or eval.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type ClassInfo = {
    name: string;
    kind?: "class" | "define";
};
/** Parse manifest text for class / define names. */
export declare function extractClasses(text: string): ClassInfo[];
/** Detect module refs: include/require/contain, class { 'foo': }, metadata.json, Puppetfile mod. */
export declare function extractModules(text: string): string[];
export type ParamsHint = {
    params: string[];
    secretKeyNames: string[];
};
/** Extract class/define parameters and $facts/$trusted usage; flag secret param names. */
export declare function extractParams(text: string): ParamsHint;
export declare function lintPuppet(text: string): Finding[];
