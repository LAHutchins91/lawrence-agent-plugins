/**
 * arm-template-lab — local stdio MCP for Azure ARM template JSON text heuristics
 * Zero-auth. JSON string analysis only.
 * No az CLI, Azure deploy, network, filesystem follow, or eval.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { armResourcesList } from "./tools/arm_resources_list.js";
import { armParametersHint } from "./tools/arm_parameters_hint.js";
import { armOutputsHint } from "./tools/arm_outputs_hint.js";
import { armLintLite } from "./tools/arm_lint_lite.js";
const PURE = "Pure Azure ARM template JSON string analysis. No az CLI, no Azure deploy, no network, no filesystem follow, no eval.";
const TOOLS = [
    {
        name: "arm_resources_list",
        description: "Parse ARM template JSON; list resources with type, name, apiVersion, location. Args: { text: string }. Returns { resources: [{type?, name?, apiVersion?, location?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "ARM template JSON contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "arm_parameters_hint",
        description: "Extract parameters (name, type, defaultValue present?, secureString). Args: { text }. Returns { parameters: [{name, type?, hasDefault?, secure?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "ARM template JSON contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "arm_outputs_hint",
        description: "Extract outputs (name, type, value hint). Args: { text }. Returns { outputs: [{name, type?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "ARM template JSON contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "arm_lint_lite",
        description: "Educational tips: empty, missing $schema/contentVersion, plaintext secrets in variables, wildcard `*` actions in roleAssignments tip, missing apiVersion. Not exploit guide. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "ARM template JSON (or light Bicep-ish) contents as a string (text only)",
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
const server = new Server({ name: "arm-template-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "arm_resources_list":
                return textResult(armResourcesList({ text: String(args.text ?? "") }));
            case "arm_parameters_hint":
                return textResult(armParametersHint({ text: String(args.text ?? "") }));
            case "arm_outputs_hint":
                return textResult(armOutputsHint({ text: String(args.text ?? "") }));
            case "arm_lint_lite":
                return textResult(armLintLite({ text: String(args.text ?? "") }));
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
    console.error("arm-template-lab failed to start:", err);
    process.exit(1);
});
