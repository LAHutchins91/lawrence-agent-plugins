/**
 * vercel-json-lab — local stdio MCP for vercel.json text
 * Zero-auth. JSON / JSONC heuristics. No vercel CLI, no network, no filesystem follow.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { vercelRewritesList } from "./tools/vercel_rewrites_list.js";
import { vercelRedirectsList } from "./tools/vercel_redirects_list.js";
import { vercelHeadersHint } from "./tools/vercel_headers_hint.js";
import { vercelLintLite } from "./tools/vercel_lint_lite.js";
const PURE = "Pure vercel.json string analysis — JSON/JSONC (comments stripped). No vercel CLI, no network.";
const TOOLS = [
    {
        name: "vercel_rewrites_list",
        description: "Parse vercel.json text and list rewrites. Args: { text: string }. Returns { rewrites: [{source?, destination?, has?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "vercel.json contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "vercel_redirects_list",
        description: "Parse vercel.json text and list redirects. Args: { text }. Returns { redirects: [{source?, destination?, permanent?, statusCode?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "vercel.json contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "vercel_headers_hint",
        description: "Parse vercel.json headers rules and collect unique header keys. Args: { text }. Returns { headers: [{source?, headers:[{key,value}]}], count, keys: string[] }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "vercel.json contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "vercel_lint_lite",
        description: "Educational heuristic lite lint: empty config, trailingSlash tips, catch-all rewrite smells, missing security headers tip, builds/functions summary, deprecated routes tip, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "vercel.json contents as a string (text only)",
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
const server = new Server({ name: "vercel-json-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "vercel_rewrites_list":
                return textResult(vercelRewritesList({ text: String(args.text ?? "") }));
            case "vercel_redirects_list":
                return textResult(vercelRedirectsList({ text: String(args.text ?? "") }));
            case "vercel_headers_hint":
                return textResult(vercelHeadersHint({ text: String(args.text ?? "") }));
            case "vercel_lint_lite":
                return textResult(vercelLintLite({ text: String(args.text ?? "") }));
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
    console.error("vercel-json-lab failed to start:", err);
    process.exit(1);
});
