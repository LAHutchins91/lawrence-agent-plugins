/**
 * Shared Makefile text helpers.
 * String heuristics only — no make binary, no network, no shell.
 */
export type MakeTarget = {
    name: string;
    deps?: string[];
    line?: number;
};
export type MakeVar = {
    name: string;
    value?: string;
    flavor?: "recursive" | "simple" | "conditional" | "append" | "shell" | "posix" | "immediate";
};
export type Finding = {
    severity: "info" | "warning" | "error";
    rule: string;
    advice: string;
};
export type ParsedMakefile = {
    targets: MakeTarget[];
    phony: string[];
    vars: MakeVar[];
    findings: Finding[];
    empty: boolean;
};
export declare function parseMakefileText(text: string): ParsedMakefile;
export declare function listTargets(text: string): {
    targets: MakeTarget[];
    count: number;
};
export declare function listPhony(text: string): {
    phony: string[];
    count: number;
};
export declare function lookupVars(text: string, name?: string): {
    vars: MakeVar[];
    count: number;
};
export declare function lintMakefile(text: string): Finding[];
