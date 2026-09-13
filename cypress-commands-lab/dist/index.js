/**
 * cypress-commands-lab — local stdio MCP for Cypress support/commands JS/TS text
 * Zero-auth. Best-effort regex heuristics. No Cypress/browser runtime, no network.
 * Distinct from cypress-config-lab (config heuristics).
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { cyCommandsList } from "./tools/cy_commands_list.js";
import { cyAliasesHint } from "./tools/cy_aliases_hint.js";
import { cyInterceptsHint } from "./tools/cy_intercepts_hint.js";
import { cyLintLite } from "./tools/cy_lint_lite.js";
const PURE = "Pure Cypress support/commands JS/TS string analysis via text heuristics. No Cypress/browser runtime, no network.";
const TOOLS = [
    {
        name: "cy_commands_list",
        description: "Parse Cypress support/commands JS/TS text and list custom commands best-effort. Args: { text: string }. Returns { commands: [{name, overwrite?}], count }. From Cypress.Commands.add( / addAll( / overwrite(. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Cypress support/commands source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "cy_aliases_hint",
        description: "List Cypress aliases best-effort. Args: { text }. Returns { aliases: [{name}], count }. From .as('alias') / @alias usages. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Cypress support/spec source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "cy_intercepts_hint",
        description: "List Cypress network stubs best-effort. Args: { text }. Returns { intercepts: [{method?, url?}], count }. From cy.intercept( / cy.route( (legacy). " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Cypress support/spec source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "cy_lint_lite",
        description: "Educational heuristic lite lint: empty, cy.wait(number) anti-pattern tip, then() overuse tip, missing data-cy tip, route deprecated tip, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Cypress support/commands/spec source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
];
function textResult(data) {
    const text = typeof data === "string" ? data : JSON.stringify(data, null, 2);
    return { content: [{ type: "text", text }] };
}
function errorResult(message) {
    return {
        content: [{ type: "text", text: message }],
        isError: true,
    };
}
const server = new Server({ name: "cypress-commands-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS.map((t) => ({
        name: t.name,
        description: t.description,
        inputSchema: t.inputSchema,
    })),
}));
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const name = request.params.name;
    const args = (request.params.arguments ?? {});
    try {
        switch (name) {
            case "cy_commands_list":
                return textResult(cyCommandsList({ text: String(args.text ?? "") }));
            case "cy_aliases_hint":
                return textResult(cyAliasesHint({ text: String(args.text ?? "") }));
            case "cy_intercepts_hint":
                return textResult(cyInterceptsHint({ text: String(args.text ?? "") }));
            case "cy_lint_lite":
                return textResult(cyLintLite({ text: String(args.text ?? "") }));
            default:
                return errorResult(`Unknown tool: ${name}`);
        }
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return errorResult(`Tool ${name} failed: ${msg}`);
    }
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch((err) => {
    console.error("cypress-commands-lab failed to start:", err);
    process.exit(1);
});
