/**
 * typebox-lab — local stdio MCP for TypeBox TS/JS text
 * Zero-auth. Best-effort regex heuristics. No @sinclair/typebox runtime, no network.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { tbSchemasList } from "./tools/tb_schemas_list.js";
import { tbPropsHint } from "./tools/tb_props_hint.js";
import { tbComposeHint } from "./tools/tb_compose_hint.js";
import { tbLintLite } from "./tools/tb_lint_lite.js";
const PURE = "Pure TypeBox TS/JS string analysis via text heuristics. No @sinclair/typebox runtime, no network.";
const TOOLS = [
    {
        name: "tb_schemas_list",
        description: "Parse TypeBox TS/JS text and list schemas best-effort. Args: { text: string }. Returns { schemas: [{name, kind?}], count }. From Type.Object / Type.String / Type.Array / Type.Number etc. assigned consts (import { Type } from '@sinclair/typebox' or Type as T). " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "TypeBox source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "tb_props_hint",
        description: "Summarize keys inside Type.Object({ ... }) best-effort. Args: { text }. Returns { props: [{schema?, name, typeHint?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "TypeBox source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "tb_compose_hint",
        description: "List TypeBox compose combinators: Union / Intersect / Partial / Required / Pick / Omit / Composite / Ref / Recursive etc. Args: { text }. Returns { compose: [{on?, kind}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "TypeBox source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "tb_lint_lite",
        description: "Educational heuristic lite lint: empty, missing Object, Any/Unsafe overuse, additionalProperties tip, Format tips, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "TypeBox source as a string (text only)",
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
const server = new Server({ name: "typebox-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "tb_schemas_list":
                return textResult(tbSchemasList({ text: String(args.text ?? "") }));
            case "tb_props_hint":
                return textResult(tbPropsHint({ text: String(args.text ?? "") }));
            case "tb_compose_hint":
                return textResult(tbComposeHint({ text: String(args.text ?? "") }));
            case "tb_lint_lite":
                return textResult(tbLintLite({ text: String(args.text ?? "") }));
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
    console.error("typebox-lab failed to start:", err);
    process.exit(1);
});
