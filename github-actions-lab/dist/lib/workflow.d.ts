export type WorkflowDoc = {
    raw: Record<string, unknown> | null;
    parseError?: string;
};
export declare function asMap(value: unknown): Record<string, unknown> | null;
export declare function parseWorkflowText(text: string): WorkflowDoc;
export type JobSummary = {
    id: string;
    name?: string;
    runsOn?: string;
    stepsCount?: number;
};
export declare function listJobs(raw: Record<string, unknown> | null): {
    name?: string;
    jobs: JobSummary[];
};
/**
 * Normalize `on:` which may be string | string[] | map into event name list.
 */
export declare function normalizeTriggers(onVal: unknown): {
    on: unknown;
    events: string[];
};
/**
 * Find secrets.NAME / ${{ secrets.NAME }} style refs — names only, never values.
 */
export declare function findSecretRefs(text: string): string[];
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
/**
 * Educational heuristic lint — not an exploit guide.
 */
export declare function lintWorkflow(text: string, raw: Record<string, unknown> | null, parseError?: string): Finding[];
