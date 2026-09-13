/**
 * Best-effort Vitest vi.mock JS/TS text heuristics.
 * No vitest runtime, no network, no filesystem follow, no eval / no TS AST.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type MockInfo = {
    module?: string;
    factory?: string;
};
export type SpyInfo = {
    target?: string;
    method?: string;
};
export type HoistInfo = {
    kind: string;
};
/** Strip line and block comments; leave strings roughly intact. */
export declare function stripComments(raw: string): string;
/**
 * Detect vi / vitest identifiers from imports and heuristics.
 */
export declare function detectVitestImports(cleaned: string): {
    vi: string[];
    jest: string[];
};
/**
 * List mocks from vi.mock( / jest.mock(
 */
export declare function listMocks(text: string): {
    mocks: MockInfo[];
    count: number;
};
/**
 * List spies from vi.spyOn( / vi.fn(
 */
export declare function listSpies(text: string): {
    spies: SpyInfo[];
    count: number;
};
/**
 * List hoist-related: vi.hoisted / vi.doMock / vi.unmock / vi.resetModules
 */
export declare function listHoisted(text: string): {
    hoisted: HoistInfo[];
    count: number;
};
export declare function lintVitestMocks(text: string): Finding[];
