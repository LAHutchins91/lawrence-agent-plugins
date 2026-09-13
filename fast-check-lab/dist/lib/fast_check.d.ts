/**
 * Best-effort fast-check JS/TS text heuristics.
 * No fast-check runtime, no network, no filesystem follow, no eval / no TS AST.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type ArbInfo = {
    name: string;
    kind?: string;
};
export type PropInfo = {
    name?: string;
    assert?: boolean;
    async?: boolean;
};
export type ConstraintInfo = {
    on?: string;
    keys: string[];
};
/** Strip line and block comments; leave strings roughly intact. */
export declare function stripComments(raw: string): string;
/**
 * Detect fc namespace prefixes and named imports from fast-check.
 * Returns { ns: string[] (e.g. 'fc'), named: Map<localName, kind> }
 */
export declare function detectFcImports(cleaned: string): {
    ns: string[];
    named: Map<string, string>;
};
/**
 * List arbitrary assignments: const fooArb = fc.string() / fc.integer() etc.
 * Also covers named imports: const x = string() when string was imported.
 */
export declare function listArbs(text: string): {
    arbs: ArbInfo[];
    count: number;
};
/**
 * Detect fc.property / fc.asyncProperty / fc.assert(fc.property(...)) patterns.
 */
export declare function listProps(text: string): {
    properties: PropInfo[];
    count: number;
};
/**
 * Options objects passed to arbitraries / assert — extract constraint keys.
 */
export declare function listConstraints(text: string): {
    constraints: ConstraintInfo[];
    count: number;
};
export declare function lintFastCheck(text: string): Finding[];
