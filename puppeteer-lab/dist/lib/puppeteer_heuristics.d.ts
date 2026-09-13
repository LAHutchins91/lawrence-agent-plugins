/**
 * Best-effort Puppeteer script JS/TS text heuristics.
 * No puppeteer / browser runtime, no network, no filesystem follow, no eval / no TS AST.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type PageActionInfo = {
    action: "launch" | "newPage" | "goto" | "close" | string;
    url?: string;
};
export type SelectorInfo = {
    api: "click" | "type" | "$" | "$eval" | "waitForSelector" | string;
    selector?: string;
};
export type WaitInfo = {
    kind: "waitForSelector" | "waitForNavigation" | "waitForTimeout" | "waitForFunction" | string;
};
/** Strip line and block comments; leave strings roughly intact. */
export declare function stripComments(raw: string): string;
/**
 * List page lifecycle actions from puppeteer.launch / browser.newPage / page.goto / close.
 */
export declare function listPages(text: string): {
    pages: PageActionInfo[];
    count: number;
};
/**
 * List selector APIs: click, type, $, $$, $eval, $$eval, waitForSelector, focus, hover, select, tap.
 */
export declare function listSelectors(text: string): {
    selectors: SelectorInfo[];
    count: number;
};
/**
 * List wait helpers: waitForSelector, waitForNavigation, waitForTimeout, waitForFunction, etc.
 */
export declare function listWaits(text: string): {
    waits: WaitInfo[];
    count: number;
};
export declare function lintPuppeteer(text: string): Finding[];
