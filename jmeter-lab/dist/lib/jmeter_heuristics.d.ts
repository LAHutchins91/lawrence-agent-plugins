/**
 * Best-effort JMeter JMX / plan XML text heuristics.
 * No JMeter / load-test runtime, no network, no filesystem follow, no DOM parser required.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type TestPlanInfo = {
    name?: string;
};
export type ThreadGroupInfo = {
    name?: string;
    numThreads?: string;
    rampTime?: string;
};
export type SamplerInfo = {
    type: "HTTPSamplerProxy" | "JavaSampler" | string;
    name?: string;
    path?: string;
};
export type AssertionInfo = {
    type: "ResponseAssertion" | "DurationAssertion" | "JSONPathAssertion" | string;
    name?: string;
};
/** Normalize newlines / BOM; leave XML otherwise intact. */
export declare function normalize(raw: string): string;
/**
 * List TestPlan and ThreadGroup elements from guiclass/testclass tags.
 */
export declare function listPlans(text: string): {
    testPlans: TestPlanInfo[];
    threadGroups: ThreadGroupInfo[];
    count: number;
};
/**
 * List samplers (HTTPSamplerProxy, JavaSampler, ...) with optional path.
 */
export declare function listSamplers(text: string): {
    samplers: SamplerInfo[];
    count: number;
};
/**
 * List assertion elements.
 */
export declare function listAssertions(text: string): {
    assertions: AssertionInfo[];
    count: number;
};
export declare function lintJmeter(text: string): Finding[];
