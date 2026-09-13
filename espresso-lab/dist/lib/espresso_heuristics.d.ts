/**
 * Best-effort Espresso Java/Kotlin test text heuristics.
 * No Android / Espresso runtime, no network, no filesystem follow, no eval / no compiler.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type MatcherInfo = {
    name: string;
};
export type ActionInfo = {
    name: string;
};
export type IdlingInfo = {
    kind: "IdlingResource" | "CountingIdlingResource" | "registerIdlingResources" | string;
};
/** Strip // and /* * / comments; leave strings roughly intact (Java/Kotlin). */
export declare function stripComments(raw: string): string;
/**
 * List Espresso / Hamcrest ViewMatchers (and common combinators) from test text.
 */
export declare function listMatchers(text: string): {
    matchers: MatcherInfo[];
    count: number;
};
/**
 * List Espresso ViewActions / onView(...).perform( signals.
 */
export declare function listActions(text: string): {
    actions: ActionInfo[];
    count: number;
};
/**
 * List IdlingResource-related kinds from test text.
 */
export declare function listIdling(text: string): {
    idling: IdlingInfo[];
    count: number;
};
export declare function lintEspresso(text: string): Finding[];
