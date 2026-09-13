/**
 * Shared Chef cookbook/recipe Ruby DSL text helpers.
 * Pure regex/string heuristics — no Chef CLI, knife, network, filesystem follow, or eval.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type CookbookInfo = {
    name?: string;
    version?: string;
    depends?: string[];
    supports?: string[];
};
export type ResourceInfo = {
    type?: string;
    name?: string;
};
/** Extract cookbooks from metadata.rb / Policyfile / Berksfile text. */
export declare function extractCookbooks(text: string): CookbookInfo[];
/** Heuristic scan of recipe Ruby for resources + include_recipe. */
export declare function extractRecipes(text: string): {
    resources: ResourceInfo[];
    includes: string[];
};
export type AttrsHint = {
    attrs: string[];
    secretKeyNames: string[];
};
/** Extract default/override/normal / node[...] attribute keys; flag secret key names. */
export declare function extractAttrs(text: string): AttrsHint;
export declare function lintChef(text: string): Finding[];
