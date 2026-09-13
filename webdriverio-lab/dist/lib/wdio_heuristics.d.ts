/**
 * Best-effort WebdriverIO JS/TS text heuristics.
 * No wdio / browser / WebDriver runtime, no network, no filesystem follow, no eval / no TS AST.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type SpecInfo = {
    kind: "describe" | "it" | "before" | "after" | string;
    title?: string;
};
export type SelectorInfo = {
    api: "$" | "$$" | "custom$" | string;
    selector?: string;
};
export type CommandInfo = {
    name: string;
};
/** Strip line and block comments; leave strings roughly intact. */
export declare function stripComments(raw: string): string;
/**
 * List Mocha-style describe/it/hooks from WDIO specs, or config `specs:` array entries.
 */
export declare function listSpecs(text: string): {
    specs: SpecInfo[];
    count: number;
};
/**
 * List selector APIs: $ / $$ / browser.$ / browser.$$ / custom$ / custom$$.
 */
export declare function listSelectors(text: string): {
    selectors: SelectorInfo[];
    count: number;
};
/**
 * List common browser. / element. WDIO command APIs.
 */
export declare function listCommands(text: string): {
    commands: CommandInfo[];
    count: number;
};
export declare function lintWdio(text: string): Finding[];
