/**
 * Best-effort bombardier CLI text heuristics.
 * No bombardier runtime, no network, no filesystem follow, no eval.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type TargetInfo = {
    url?: string;
};
export type OptionInfo = {
    flag: "-c" | "-n" | "-d" | "-m" | "-b" | "-H" | "-l" | "-p" | "-r" | string;
    value?: string;
};
export type LatencyInfo = {
    kind: "printLatencies" | "-l" | "-p" | string;
};
/** Strip BOM, normalize newlines, drop # / // comments (quote-aware; keep ://). */
export declare function stripComments(raw: string): string;
/**
 * List target URLs from bombardier invocations / trailing URLs.
 */
export declare function listTargets(text: string): {
    targets: TargetInfo[];
    count: number;
};
/**
 * Extract CLI options from bombardier invocations.
 */
export declare function listOptions(text: string): {
    options: OptionInfo[];
    count: number;
};
/**
 * Latency / print related flags: printLatencies, -l, -p, …
 */
export declare function listLatency(text: string): {
    latency: LatencyInfo[];
    count: number;
};
export declare function lintBombardier(text: string): Finding[];
