/**
 * cloudflare-wrangler-lab — local stdio MCP for wrangler.toml text
 * Zero-auth. TOML heuristics. No wrangler CLI, no network, no filesystem follow.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { wranglerNameMain } from "./tools/wrangler_name_main.js";
import { wranglerRoutesList } from "./tools/wrangler_routes_list.js";
import { wranglerBindingsHint } from "./tools/wrangler_bindings_hint.js";
import { wranglerLintLite } from "./tools/wrangler_lint_lite.js";
const PURE = "Pure wrangler.toml string analysis — best-effort TOML / regex heuristics. No wrangler CLI, no network.";
const TOOLS = [
    {
        name: "wrangler_name_main",
        description: "Parse wrangler.toml text and extract top-level identity fields. Args: { text: string }. Returns { name?, main?, compatibility_date?, compatibility_flags?, account_id?, workers_dev? }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "wrangler.toml contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "wrangler_routes_list",
        description: "Parse wrangler.toml text and list routes from routes array / [[routes]] (and env tables). Args: { text }. Returns { routes: [{pattern?, zone_name?, zone_id?, custom_domain?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "wrangler.toml contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "wrangler_bindings_hint",
        description: "Parse wrangler.toml binding sections and collect names/ids (not secret values). Args: { text }. Returns { kv_namespaces?, r2_buckets?, d1_databases?, vars?, secrets_hint?, services?, durable_objects? }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "wrangler.toml contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "wrangler_lint_lite",
        description: "Educational heuristic lite lint: empty, missing name/main/compatibility_date, plaintext secrets in [vars], outdated compatibility_date tip, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "wrangler.toml contents as a string (text only)",
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
const server = new Server({ name: "cloudflare-wrangler-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "wrangler_name_main":
                return textResult(wranglerNameMain({ text: String(args.text ?? "") }));
            case "wrangler_routes_list":
                return textResult(wranglerRoutesList({ text: String(args.text ?? "") }));
            case "wrangler_bindings_hint":
                return textResult(wranglerBindingsHint({ text: String(args.text ?? "") }));
            case "wrangler_lint_lite":
                return textResult(wranglerLintLite({ text: String(args.text ?? "") }));
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
    console.error("cloudflare-wrangler-lab failed to start:", err);
    process.exit(1);
});
