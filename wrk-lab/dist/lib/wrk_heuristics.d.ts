/**
 * Best-effort wrk / wrk2 Lua script + CLI text heuristics.
 * No wrk runtime, no network, no filesystem follow, no eval / no Lua VM.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type HookInfo = {
    name: "setup" | "init" | "request" | "response" | "done" | string;
};
export type WrkUseInfo = {
    api: "wrk.method" | "wrk.headers" | "wrk.body" | "wrk.format" | string;
};
export type OptionInfo = {
    flag: "-c" | "-d" | "-t" | "-R" | "-s" | string;
    value?: string;
};
/** Strip Lua -- line comments and --[[ ]] block comments; leave strings roughly intact. */
export declare function stripLuaComments(raw: string): string;
/**
 * List wrk Lua hook function definitions: setup / init / request / response / done.
 */
export declare function listHooks(text: string): {
    hooks: HookInfo[];
    count: number;
};
/**
 * List wrk.* API uses from Lua script text.
 */
export declare function listWrkUses(text: string): {
    wrkUses: WrkUseInfo[];
    count: number;
};
/**
 * Extract CLI options from shell/CLI lines invoking wrk / wrk2.
 */
export declare function listOptions(text: string): {
    options: OptionInfo[];
    count: number;
};
export declare function lintWrk(text: string): Finding[];
