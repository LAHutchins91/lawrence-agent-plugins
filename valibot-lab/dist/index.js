/**
 * valibot-lab — local stdio MCP for Valibot schema TS/JS text
 * Zero-auth. Best-effort regex heuristics. No valibot runtime, no network.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { vbSchemasList } from "./tools/vb_schemas_list.js";
import { vbPipesHint } from "./tools/vb_pipes_hint.js";
import { vbActionsHint } from "./tools/vb_actions_hint.js";
import { vbLintLite } from "./tools/vb_lint_lite.js";
const PURE = "Pure Valibot schema TS/JS string analysis via text heuristics. No valibot runtime, no network.";
const TOOLS = [
    {
        name: "vb_schemas_list",
        description: "Parse Valibot schema TS/JS text and list schemas best-effort. Args: { text: string }. Returns { schemas: [{name, kind?}], count }. From v.object / v.string / v.array / v.number etc. assigned consts (import * as v from 'valibot' or named imports). " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Valibot schema source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "vb_pipes_hint",
        description: "Summarize v.pipe(...) chains best-effort. Args: { text }. Returns { pipes: [{on?, steps: string[]}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Valibot schema source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "vb_actions_hint",
        description: "Count Valibot actions like v.minLength, v.email, v.url, v.regex, v.transform, v.check, v.forward, etc. Args: { text }. Returns { actions: [{name, count}], total }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Valibot schema source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "vb_lint_lite",
        description: "Educational heuristic lite lint: empty, missing pipe for validations tip, any()/unknown() overuse, deprecated API tips if any, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Valibot schema source as a string (text only)",
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
const server = new Server({ name: "valibot-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "vb_schemas_list":
                return textResult(vbSchemasList({ text: String(args.text ?? "") }));
            case "vb_pipes_hint":
                return textResult(vbPipesHint({ text: String(args.text ?? "") }));
            case "vb_actions_hint":
                return textResult(vbActionsHint({ text: String(args.text ?? "") }));
            case "vb_lint_lite":
                return textResult(vbLintLite({ text: String(args.text ?? "") }));
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
    console.error("valibot-lab failed to start:", err);
    process.exit(1);
});
