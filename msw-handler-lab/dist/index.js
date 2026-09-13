/**
 * msw-handler-lab — local stdio MCP for MSW handler JS/TS text
 * Zero-auth. Best-effort regex heuristics. No msw runtime, no network.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { mswHandlersList } from "./tools/msw_handlers_list.js";
import { mswMethodsHint } from "./tools/msw_methods_hint.js";
import { mswFixturesHint } from "./tools/msw_fixtures_hint.js";
import { mswLintLite } from "./tools/msw_lint_lite.js";
const PURE = "Pure MSW handler JS/TS string analysis via text heuristics. No msw runtime, no network.";
const TOOLS = [
    {
        name: "msw_handlers_list",
        description: "Parse MSW handler JS/TS text and list handlers best-effort. Args: { text: string }. Returns { handlers: [{method, path?, name?}], count }. From http.get/post/put/patch/delete / rest.get / graphql.query/mutation (import { http, rest, graphql } from 'msw'). " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "MSW handler source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "msw_methods_hint",
        description: "Count handlers by HTTP/GraphQL method best-effort. Args: { text }. Returns { methods: Record<string, number>, total }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "MSW handler source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "msw_fixtures_hint",
        description: "List response fixtures best-effort. Args: { text }. Returns { fixtures: [{kind: 'Json'|'Text'|'Xml'|'HttpResponse'|string, on?}], count }. From HttpResponse.json / .text / .xml / res(ctx.json(...)) etc. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "MSW handler source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "msw_lint_lite",
        description: "Educational heuristic lite lint: empty, missing setupWorker/setupServer tip, wildcard path overuse, passthrough tips, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "MSW handler source as a string (text only)",
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
const server = new Server({ name: "msw-handler-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "msw_handlers_list":
                return textResult(mswHandlersList({ text: String(args.text ?? "") }));
            case "msw_methods_hint":
                return textResult(mswMethodsHint({ text: String(args.text ?? "") }));
            case "msw_fixtures_hint":
                return textResult(mswFixturesHint({ text: String(args.text ?? "") }));
            case "msw_lint_lite":
                return textResult(mswLintLite({ text: String(args.text ?? "") }));
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
    console.error("msw-handler-lab failed to start:", err);
    process.exit(1);
});
