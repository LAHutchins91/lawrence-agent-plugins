/**
 * effect-schema-lab — local stdio MCP for Effect Schema TS/JS text
 * Zero-auth. Best-effort regex heuristics. No Effect runtime, no network.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { effSchemasList } from "./tools/eff_schemas_list.js";
import { effFieldsHint } from "./tools/eff_fields_hint.js";
import { effTransformHint } from "./tools/eff_transform_hint.js";
import { effLintLite } from "./tools/eff_lint_lite.js";
const PURE = "Pure Effect Schema TS/JS string analysis via text heuristics. No Effect runtime, no network.";
const TOOLS = [
    {
        name: "eff_schemas_list",
        description: "Parse Effect Schema TS/JS text and list schemas best-effort. Args: { text: string }. Returns { schemas: [{name, kind?}], count }. From Schema.Struct / Schema.String / Schema.Number / Schema.Array / S.Struct etc. assigned consts (import { Schema } from 'effect' or Schema as S). " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Effect Schema source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "eff_fields_hint",
        description: "Summarize keys inside Schema.Struct({ ... }) best-effort. Args: { text }. Returns { fields: [{schema?, name, typeHint?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Effect Schema source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "eff_transform_hint",
        description: "List Effect Schema combinators: transform / filter / pipe / optional / NullOr / Union / brand etc. Args: { text }. Returns { transforms: [{on?, kind}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Effect Schema source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "eff_lint_lite",
        description: "Educational heuristic lite lint: empty, missing Struct, Any/Unknown overuse, branded tips, optional vs NullOr, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Effect Schema source as a string (text only)",
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
const server = new Server({ name: "effect-schema-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "eff_schemas_list":
                return textResult(effSchemasList({ text: String(args.text ?? "") }));
            case "eff_fields_hint":
                return textResult(effFieldsHint({ text: String(args.text ?? "") }));
            case "eff_transform_hint":
                return textResult(effTransformHint({ text: String(args.text ?? "") }));
            case "eff_lint_lite":
                return textResult(effLintLite({ text: String(args.text ?? "") }));
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
    console.error("effect-schema-lab failed to start:", err);
    process.exit(1);
});
