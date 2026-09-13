/**
 * Shared Procfile text helpers.
 * String heuristics only — no network, no process spawn.
 *
 * Procfile lines: `name: command` (Heroku / Foreman / honcho style).
 * Blank lines and `#` comments are skipped.
 */
export type ProcEntry = {
    name: string;
    command: string;
    line?: number;
};
export type EnvRef = {
    name: string;
    process?: string;
    raw?: string;
};
export type Finding = {
    severity: "info" | "warning" | "error";
    rule: string;
    advice: string;
};
export type ParsedProcfile = {
    entries: ProcEntry[];
    refs: EnvRef[];
    findings: Finding[];
    empty: boolean;
};
export declare function parseProcfileText(text: string): ParsedProcfile;
export declare function parseEntries(text: string): {
    entries: ProcEntry[];
    count: number;
};
export declare function listProcesses(text: string): {
    processes: string[];
    count: number;
};
export declare function listEnvRefs(text: string): {
    refs: EnvRef[];
    unique: string[];
    count: number;
};
export declare function lintProcfile(text: string): Finding[];
