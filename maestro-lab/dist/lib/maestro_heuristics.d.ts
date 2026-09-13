export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type SelectorInfo = {
    kind: "id" | "text" | "point" | string;
    value?: string;
};
export type CommandFreq = {
    name: string;
    count: number;
};
export type FlowParse = {
    appId?: string;
    name?: string;
    tags?: string[];
    steps: string[];
    /** All command occurrences including nested (repeat/runFlow commands lists). */
    allCommands: string[];
    selectors: SelectorInfo[];
    parseError?: string;
};
export declare function isPlainObject(v: unknown): v is Record<string, unknown>;
/** Extract Maestro command name from a list item (string or single-key map). */
export declare function commandNameFromStep(step: unknown): string | undefined;
/**
 * Parse Maestro flow YAML text into meta + steps + selectors.
 */
export declare function parseMaestroFlow(text: string): FlowParse;
export declare function listFlows(text: string): {
    appId?: string;
    name?: string;
    tags?: string[];
    steps: string[];
    count: number;
};
export declare function listCommands(text: string): {
    commands: CommandFreq[];
    total: number;
};
export declare function listSelectors(text: string): {
    selectors: SelectorInfo[];
    count: number;
};
export declare function lintMaestro(text: string): Finding[];
