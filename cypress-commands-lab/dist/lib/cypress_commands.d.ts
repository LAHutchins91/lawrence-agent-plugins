/**
 * Best-effort Cypress support/commands JS/TS text heuristics.
 * No Cypress / browser runtime, no network, no filesystem follow, no eval / no TS AST.
 * Distinct from cypress-config-lab (config heuristics).
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type CommandInfo = {
    name: string;
    overwrite?: boolean;
};
export type AliasInfo = {
    name: string;
};
export type InterceptInfo = {
    method?: string;
    url?: string;
};
/** Strip line and block comments; leave strings roughly intact. */
export declare function stripComments(raw: string): string;
/**
 * List custom commands from Cypress.Commands.add( / addAll( / overwrite(
 */
export declare function listCommands(text: string): {
    commands: CommandInfo[];
    count: number;
};
/**
 * List aliases from .as('alias') and @alias usages.
 */
export declare function listAliases(text: string): {
    aliases: AliasInfo[];
    count: number;
};
/**
 * List intercepts from cy.intercept( / cy.route( (legacy).
 */
export declare function listIntercepts(text: string): {
    intercepts: InterceptInfo[];
    count: number;
};
export declare function lintCypressCommands(text: string): Finding[];
