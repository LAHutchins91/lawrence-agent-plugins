/**
 * remix-config-lab — local stdio MCP for remix.config / vite remix() text
 * Zero-auth. Classic AppConfig + vitePlugin remix options best-effort heuristics (no eval).
 * No remix binary, no network, no filesystem follow.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { remixRoutesHint } from "./tools/remix_routes_hint.js";
import { remixServerBuildHint } from "./tools/remix_server_build_hint.js";
import { remixFutureFlags } from "./tools/remix_future_flags.js";
import { remixLintLite } from "./tools/remix_lint_lite.js";
const PURE = "Pure remix.config / vite remix({…}) string analysis — classic AppConfig and vitePlugin options best-effort regex heuristics (no eval). Prefer JSONC when available. No remix binary, no network.";
const TOOLS = [
    {
        name: "remix_routes_hint",
        description: "Parse remix.config or vite remix({…}) options text and extract appDirectory / routes / ignoredRouteFiles / assetsBuildDirectory / publicPath. Args: { text: string }. Returns { appDirectory?, routes?, ignoredRouteFiles?, assetsBuildDirectory?, publicPath? }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "remix.config or vite remix() plugin options contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "remix_server_build_hint",
        description: "Extract server build related fields: serverBuildPath / serverModuleFormat / serverPlatform / server / serverBuildTarget. Args: { text }. Returns { serverBuildPath?, serverModuleFormat?, serverPlatform?, server?, serverBuildTarget? }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "remix.config or vite remix() plugin options contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "remix_future_flags",
        description: "Extract future: { … } flags as a map plus key list. Args: { text }. Returns { future: Record<string, boolean|unknown>, keys: string[] }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "remix.config or vite remix() plugin options contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "remix_lint_lite",
        description: "Educational heuristic lite lint: empty config, deprecated remix.config.js tips vs vite, conflicting classic/vite or future flags, missing appDirectory, JS/TS no-eval limits. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "remix.config or vite remix() plugin options contents as a string (text only)",
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
const server = new Server({ name: "remix-config-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "remix_routes_hint":
                return textResult(remixRoutesHint({ text: String(args.text ?? "") }));
            case "remix_server_build_hint":
                return textResult(remixServerBuildHint({ text: String(args.text ?? "") }));
            case "remix_future_flags":
                return textResult(remixFutureFlags({ text: String(args.text ?? "") }));
            case "remix_lint_lite":
                return textResult(remixLintLite({ text: String(args.text ?? "") }));
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
    console.error("remix-config-lab failed to start:", err);
    process.exit(1);
});
