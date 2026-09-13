/**
 * Best-effort Testing Library JS/TS text heuristics.
 * No DOM / @testing-library runtime, no network, no filesystem follow, no eval / no TS AST.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type QueryVariant = "get" | "getAll" | "query" | "queryAll" | "find" | "findAll";
export type QueryInfo = {
    name: string;
    variant?: QueryVariant;
};
export type EventInfo = {
    kind: string;
};
export type WaitInfo = {
    kind: string;
};
/** Strip line and block comments; leave strings roughly intact. */
export declare function stripComments(raw: string): string;
/**
 * List Testing Library queries from screen.*, within.*, destructured render helpers,
 * and bare getBy / queryBy / findBy calls.
 */
export declare function listQueries(text: string): {
    queries: QueryInfo[];
    count: number;
};
/**
 * List events from userEvent.* / fireEvent.*
 */
export declare function listEvents(text: string): {
    events: EventInfo[];
    count: number;
};
/**
 * List waits: waitFor / waitForElementToBeRemoved / findBy* (as wait kind)
 */
export declare function listWaits(text: string): {
    waits: WaitInfo[];
    count: number;
};
export declare function lintTestingLibrary(text: string): Finding[];
