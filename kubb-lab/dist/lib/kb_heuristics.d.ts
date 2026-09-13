export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type OutputEntry = {
    path?: string;
    plugin?: string;
};
export type HookEntry = {
    name?: string;
    command?: string;
};
/**
 * List output paths: root output.path / output string, and per-plugin output.path.
 */
export declare function listOutputs(text: string): {
    outputs: OutputEntry[];
    count: number;
};
/**
 * Detect Kubb plugins referenced in config text.
 */
export declare function listPlugins(text: string): {
    plugins: string[];
    count: number;
};
/**
 * Extract hooks.done / hooks scripts / post-generate commands.
 */
export declare function listHooks(text: string): {
    hooks: HookEntry[];
    count: number;
};
export declare function lintKubb(text: string): Finding[];
