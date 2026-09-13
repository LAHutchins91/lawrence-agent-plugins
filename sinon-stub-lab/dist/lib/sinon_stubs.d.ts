/**
 * Best-effort Sinon stub/spy JS/TS text heuristics.
 * No sinon runtime, no network, no filesystem follow, no eval / no TS AST.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type StubInfo = {
    target?: string;
    method?: string;
    name?: string;
};
export type SpyInfo = {
    target?: string;
    method?: string;
};
export type FakeInfo = {
    kind: string;
};
/** Strip line and block comments; leave strings roughly intact. */
export declare function stripComments(raw: string): string;
/**
 * Detect sinon / sandbox identifiers from imports and heuristics.
 */
export declare function detectSinonImports(cleaned: string): {
    sinon: string[];
    sandboxes: string[];
};
/**
 * List stubs from sinon.stub( / sandbox.stub(
 */
export declare function listStubs(text: string): {
    stubs: StubInfo[];
    count: number;
};
/**
 * List spies from sinon.spy( / sandbox.spy(
 */
export declare function listSpies(text: string): {
    spies: SpyInfo[];
    count: number;
};
/**
 * List fakes: sinon.fake / useFakeTimers / fakeServer / createSandbox
 */
export declare function listFakes(text: string): {
    fakes: FakeInfo[];
    count: number;
};
export declare function lintSinon(text: string): Finding[];
