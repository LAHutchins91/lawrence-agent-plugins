/**
 * joi-schema-lab — local stdio MCP for Joi schema JS/TS text
 * Zero-auth. Best-effort regex heuristics. No joi runtime, no network.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { joiSchemasList } from "./tools/joi_schemas_list.js";
import { joiFieldsHint } from "./tools/joi_fields_hint.js";
import { joiRulesHint } from "./tools/joi_rules_hint.js";
import { joiLintLite } from "./tools/joi_lint_lite.js";
const PURE = "Pure Joi schema JS/TS string analysis via text heuristics. No joi runtime, no network.";
const TOOLS = [
    {
        name: "joi_schemas_list",
        description: "Parse Joi schema JS/TS text and list schemas best-effort. Args: { text: string }. Returns { schemas: [{name, kind?}], count }. From Joi.object / joi.object / Joi.string etc. assigned consts / exports (const Foo = Joi.object, export const). " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Joi schema source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "joi_fields_hint",
        description: "Summarize keys inside Joi.object({ ... }) / joi.object({ ... }) best-effort. Args: { text }. Returns { fields: [{schema?, name, joiType?, required?, optional?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Joi schema source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "joi_rules_hint",
        description: "List chained Joi rules: .min/.max/.email/.uri/.pattern/.valid/.when/.custom/.messages etc. Args: { text }. Returns { rules: [{on?, kind}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Joi schema source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "joi_lint_lite",
        description: "Educational heuristic lite lint: empty, deprecated Joi.reach / assert tips, allow(null) vs optional, unknown keys .unknown(true) tip, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Joi schema source as a string (text only)",
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
const server = new Server({ name: "joi-schema-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "joi_schemas_list":
                return textResult(joiSchemasList({ text: String(args.text ?? "") }));
            case "joi_fields_hint":
                return textResult(joiFieldsHint({ text: String(args.text ?? "") }));
            case "joi_rules_hint":
                return textResult(joiRulesHint({ text: String(args.text ?? "") }));
            case "joi_lint_lite":
                return textResult(joiLintLite({ text: String(args.text ?? "") }));
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
    console.error("joi-schema-lab failed to start:", err);
    process.exit(1);
});
