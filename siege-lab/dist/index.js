/**
 * siege-lab — local stdio MCP for siege CLI / urls.txt / .siegerc text
 * Zero-auth. Best-effort regex heuristics. No siege runtime, no network.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { sgUrlsList } from "./tools/sg_urls_list.js";
import { sgOptionsHint } from "./tools/sg_options_hint.js";
import { sgConcurrencyHint } from "./tools/sg_concurrency_hint.js";
import { sgLintLite } from "./tools/sg_lint_lite.js";
const PURE = "Pure siege CLI / urls.txt / .siegerc string analysis via text heuristics. No siege runtime, no network.";
const TOOLS = [
    {
        name: "sg_urls_list",
        description: "List URLs best-effort from urls.txt lines or siege CLI invocations. Args: { text: string }. Returns { urls: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "urls.txt contents or shell/CLI text invoking siege",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "sg_options_hint",
        description: "List siege CLI / .siegerc options best-effort. Args: { text }. Returns { options: [{flag: '-c'|'-r'|'-t'|'-d'|'-f'|'-i'|'-b'|'-g'|string, value?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Shell/CLI text invoking siege and/or .siegerc key = value lines",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "sg_concurrency_hint",
        description: "Extract siege concurrency-related settings best-effort. Args: { text }. Returns { concurrent?: string|number, reps?: string|number, time?: string }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "siege CLI and/or .siegerc text with concurrent / reps / time",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "sg_lint_lite",
        description: "Educational heuristic lite lint: empty, missing -c tip, benchmark without delay tip, no URL tip, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "siege CLI / urls.txt / .siegerc text as a string",
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
const server = new Server({ name: "siege-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "sg_urls_list":
                return textResult(sgUrlsList({ text: String(args.text ?? "") }));
            case "sg_options_hint":
                return textResult(sgOptionsHint({ text: String(args.text ?? "") }));
            case "sg_concurrency_hint":
                return textResult(sgConcurrencyHint({ text: String(args.text ?? "") }));
            case "sg_lint_lite":
                return textResult(sgLintLite({ text: String(args.text ?? "") }));
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
    console.error("siege-lab failed to start:", err);
    process.exit(1);
});
