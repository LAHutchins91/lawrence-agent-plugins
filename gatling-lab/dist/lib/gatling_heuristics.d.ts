/**
 * Best-effort Gatling Scala/Java simulation text heuristics.
 * No Gatling / load-test runtime, no network, no filesystem follow, no eval / no Scala compiler.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type ScenarioInfo = {
    name: string;
};
export type InjectInfo = {
    kind: "atOnceUsers" | "rampUsers" | "constantUsersPerSec" | "stressPeakUsers" | string;
    args?: string;
};
export type AssertionInfo = {
    kind: string;
};
/** Strip // and /* * / comments; leave strings roughly intact (Scala/Java). */
export declare function stripComments(raw: string): string;
/**
 * List Gatling scenarios from scenario("...") and protocol signals.
 */
export declare function listScenarios(text: string): {
    scenarios: ScenarioInfo[];
    protocols?: string[];
    count: number;
};
/**
 * List injection steps from inject( / OpenInjectionStep patterns.
 */
export declare function listInjects(text: string): {
    injects: InjectInfo[];
    count: number;
};
/**
 * List assertion signals from assertions( / global.responseTime / details( / forAll.
 */
export declare function listAssertions(text: string): {
    assertions: AssertionInfo[];
    count: number;
};
export declare function lintGatling(text: string): Finding[];
