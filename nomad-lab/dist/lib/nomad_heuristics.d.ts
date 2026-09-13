/**
 * Shared Nomad job HCL text helpers.
 * Pure regex/string heuristics — no nomad CLI, cluster, network, filesystem follow, or eval.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type JobInfo = {
    id?: string;
    type?: string;
    datacenters?: string[];
    namespace?: string;
};
export type NetworkInfo = {
    ports?: string[];
    mode?: string;
};
export type GroupInfo = {
    name?: string;
    count?: number;
    networks?: NetworkInfo[];
};
export type TaskInfo = {
    name?: string;
    driver?: string;
    image?: string;
};
export declare function clampText(text: string): string;
/** Strip hash, line, and block comments loosely; keep string contents. */
export declare function stripCommentsKeepStrings(raw: string): string;
/** Extract job blocks: id/name, type, datacenters, namespace. */
export declare function extractJobs(text: string): JobInfo[];
/** Extract group blocks: name, count, network ports. */
export declare function extractGroups(text: string): GroupInfo[];
/** Extract task blocks: name, driver, image; collect secret-like env key names. */
export declare function extractTasks(text: string): {
    tasks: TaskInfo[];
    secretKeyNames: string[];
};
export declare function lintNomad(text: string): Finding[];
