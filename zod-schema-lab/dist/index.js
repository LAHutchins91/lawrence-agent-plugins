/**
 * zod-schema-lab — local stdio MCP for Zod schema TS/JS text
 * Zero-auth. Best-effort regex heuristics. No zod runtime, no network.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { zodSchemasList } from "./tools/zod_schemas_list.js";
import { zodFieldsHint } from "./tools/zod_fields_hint.js";
import { zodRefineHint } from "./tools/zod_refine_hint.js";
import { zodLintLite } from "./tools/zod_lint_lite.js";
const PURE = "Pure Zod schema TS/JS string analysis via text heuristics. No zod runtime, no network.";
const TOOLS = [
    {
        name: "zod_schemas_list",
        description: "Parse Zod schema TS/JS text and list schemas best-effort. Args: { text: string }. Returns { schemas: [{name, kind?}], count }. From z.object / z.array / z.string assigned consts / exports (const Foo = z.object, export const). " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Zod schema source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "zod_fields_hint",
        description: "Summarize keys inside z.object({ ... }) best-effort. Args: { text }. Returns { fields: [{schema?, name, zodType?, optional?, nullable?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Zod schema source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "zod_refine_hint",
        description: "List chained Zod methods: refine / superRefine / transform / pipe / brand. Args: { text }. Returns { refinements: [{on?, kind}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Zod schema source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "zod_lint_lite",
        description: "Educational heuristic lite lint: empty, any()/unknown() overuse, missing email/url helpers tip, passthrough vs strict, deprecated z.record tips, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Zod schema source as a string (text only)",
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
const server = new Server({ name: "zod-schema-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "zod_schemas_list":
                return textResult(zodSchemasList({ text: String(args.text ?? "") }));
            case "zod_fields_hint":
                return textResult(zodFieldsHint({ text: String(args.text ?? "") }));
            case "zod_refine_hint":
                return textResult(zodRefineHint({ text: String(args.text ?? "") }));
            case "zod_lint_lite":
                return textResult(zodLintLite({ text: String(args.text ?? "") }));
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
    console.error("zod-schema-lab failed to start:", err);
    process.exit(1);
});
