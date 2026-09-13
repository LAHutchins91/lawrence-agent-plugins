/**
 * capacitor-config-lab — local stdio MCP for capacitor.config text
 * Zero-auth. JSON / JS / TS best-effort heuristics (no eval).
 * No capacitor binary, no network, no filesystem follow.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { capAppId } from "./tools/cap_app_id.js";
import { capPluginsList } from "./tools/cap_plugins_list.js";
import { capServerUrlHint } from "./tools/cap_server_url_hint.js";
import { capLintLite } from "./tools/cap_lint_lite.js";
const PURE = "Pure capacitor.config string analysis — JSON or JS/TS best-effort regex heuristics (no eval). Prefer JSONC when available. No capacitor binary, no network.";
const TOOLS = [
    {
        name: "cap_app_id",
        description: "Parse capacitor.config text and extract appId, appName, webDir, bundledWebRuntime. Args: { text: string }. Returns { appId?, appName?, webDir?, bundledWebRuntime? }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "capacitor.config.json / .ts / .js contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "cap_plugins_list",
        description: "Extract Capacitor plugins object keys and optional per-plugin config. Args: { text }. Returns { plugins: string[], count, pluginConfig?: Record<string, unknown> }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "capacitor.config.json / .ts / .js contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "cap_server_url_hint",
        description: "Extract server.url / cleartext / allowNavigation plus androidScheme / iosScheme. Args: { text }. Returns { server?: { url?, cleartext?, allowNavigation? }, androidScheme?, iosScheme? }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "capacitor.config.json / .ts / .js contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "cap_lint_lite",
        description: "Educational heuristic lite lint: empty config, missing appId/webDir, cleartext true tip, localhost server in prod smell, JS no-eval limits, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "capacitor.config.json / .ts / .js contents as a string (text only)",
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
const server = new Server({ name: "capacitor-config-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "cap_app_id":
                return textResult(capAppId({ text: String(args.text ?? "") }));
            case "cap_plugins_list":
                return textResult(capPluginsList({ text: String(args.text ?? "") }));
            case "cap_server_url_hint":
                return textResult(capServerUrlHint({ text: String(args.text ?? "") }));
            case "cap_lint_lite":
                return textResult(capLintLite({ text: String(args.text ?? "") }));
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
    console.error("capacitor-config-lab failed to start:", err);
    process.exit(1);
});
