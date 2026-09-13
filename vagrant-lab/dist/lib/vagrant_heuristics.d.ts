/**
 * Shared Vagrantfile Ruby DSL text helpers.
 * Pure regex/string heuristics — no vagrant CLI, VM start, network, filesystem follow, or eval.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type BoxInfo = {
    name?: string;
    box?: string;
    version?: string;
};
export type ProvisionInfo = {
    type?: string;
    name?: string;
};
export declare function clampText(text: string): string;
/** Strip Ruby # line comments and =begin/=end blocks loosely; keep string contents. */
export declare function stripCommentsKeepStrings(raw: string): string;
/** Extract box / define inventory from Vagrantfile text. */
export declare function extractBoxes(text: string): BoxInfo[];
/** Detect provider names from provider blocks and known tokens. */
export declare function extractProviders(text: string): string[];
/** Extract provisioner type/name hints. */
export declare function extractProvisions(text: string): ProvisionInfo[];
export declare function lintVagrant(text: string): Finding[];
