/**
 * Best-effort MSW handler JS/TS text heuristics.
 * No msw runtime, no network, no filesystem follow, no eval / no TS AST.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type HandlerInfo = {
    method: string;
    path?: string;
    name?: string;
};
export type FixtureInfo = {
    kind: string;
    on?: string;
};
/** Strip line and block comments; leave strings roughly intact. */
export declare function stripComments(raw: string): string;
/**
 * Detect http / rest / graphql namespace prefixes from msw imports.
 */
export declare function detectMswImports(cleaned: string): {
    http: string[];
    rest: string[];
    graphql: string[];
    httpResponse: string[];
    setupWorker: string[];
    setupServer: string[];
    namedHandlers: Map<string, string>;
};
/**
 * List MSW handlers from http/rest/graphql method calls.
 */
export declare function listHandlers(text: string): {
    handlers: HandlerInfo[];
    count: number;
};
/**
 * Count handlers by HTTP/GraphQL method.
 */
export declare function listMethods(text: string): {
    methods: Record<string, number>;
    total: number;
};
/**
 * Detect response fixtures: HttpResponse.json/text/xml/... and res(ctx.json(...)).
 */
export declare function listFixtures(text: string): {
    fixtures: FixtureInfo[];
    count: number;
};
export declare function lintMsw(text: string): Finding[];
