/**
 * Best-effort siege CLI / urls.txt / .siegerc text heuristics.
 * No siege runtime, no network, no filesystem follow, no eval.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type OptionInfo = {
    flag: "-c" | "-r" | "-t" | "-d" | "-f" | "-i" | "-b" | "-g" | string;
    value?: string;
};
export type ConcurrencyHint = {
    concurrent?: string | number;
    reps?: string | number;
    time?: string;
};
/** Strip BOM, normalize newlines, drop # / // comments (quote-aware; keep ://). */
export declare function stripComments(raw: string): string;
/**
 * List URLs from urls.txt lines or siege CLI invocations.
 */
export declare function listUrls(text: string): {
    urls: string[];
    count: number;
};
/**
 * Extract CLI options from siege invocations and/or .siegerc key = value.
 */
export declare function listOptions(text: string): {
    options: OptionInfo[];
    count: number;
};
/**
 * Extract concurrency-related settings: concurrent / reps / time.
 */
export declare function concurrencyHint(text: string): ConcurrencyHint;
export declare function lintSiege(text: string): Finding[];
