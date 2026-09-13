/**
 * testing-library-lab — local stdio MCP for Testing Library JS/TS text
 * Zero-auth. Best-effort regex heuristics. No DOM/@testing-library runtime, no network.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { tlQueriesList } from "./tools/tl_queries_list.js";
import { tlEventsHint } from "./tools/tl_events_hint.js";
import { tlWaitHint } from "./tools/tl_wait_hint.js";
import { tlLintLite } from "./tools/tl_lint_lite.js";
const PURE = "Pure Testing Library JS/TS string analysis via text heuristics. No DOM/@testing-library runtime, no network.";
const TOOLS = [
    {
        name: "tl_queries_list",
        description: "Parse Testing Library JS/TS text and list queries best-effort. Args: { text: string }. Returns { queries: [{name, variant?: 'get'|'getAll'|'query'|'queryAll'|'find'|'findAll'}], count }. From screen.getByRole / getByText / findBy* / queryBy* / destructured render helpers. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Testing Library test source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "tl_events_hint",
        description: "List Testing Library userEvent / fireEvent hints best-effort. Args: { text }. Returns { events: [{kind}], count }. From userEvent. / fireEvent. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Testing Library test source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "tl_wait_hint",
        description: "List Testing Library wait helpers best-effort. Args: { text }. Returns { waits: [{kind: 'waitFor'|'waitForElementToBeRemoved'|'findBy'|string}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Testing Library test source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "tl_lint_lite",
        description: "Educational heuristic lite lint: empty, getBy* in async without findBy/waitFor tip, container queries overuse, missing cleanup tip, prefer userEvent over fireEvent, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Testing Library test source as a string (text only)",
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
const server = new Server({ name: "testing-library-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "tl_queries_list":
                return textResult(tlQueriesList({ text: String(args.text ?? "") }));
            case "tl_events_hint":
                return textResult(tlEventsHint({ text: String(args.text ?? "") }));
            case "tl_wait_hint":
                return textResult(tlWaitHint({ text: String(args.text ?? "") }));
            case "tl_lint_lite":
                return textResult(tlLintLite({ text: String(args.text ?? "") }));
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
    console.error("testing-library-lab failed to start:", err);
    process.exit(1);
});
