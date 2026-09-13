/**
 * expo-config-lab — local stdio MCP for Expo app.json / app.config text
 * Zero-auth. Root or nested expo: {} best-effort heuristics (no eval).
 * No expo binary, no network, no filesystem follow.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { expoSlugName } from "./tools/expo_slug_name.js";
import { expoPluginsList } from "./tools/expo_plugins_list.js";
import { expoSchemeList } from "./tools/expo_scheme_list.js";
import { expoLintLite } from "./tools/expo_lint_lite.js";
const PURE = "Pure app.json / app.config string analysis — Expo root or nested expo: {} best-effort regex heuristics (no eval). Prefer JSONC when available. No expo binary, no network.";
const TOOLS = [
    {
        name: "expo_slug_name",
        description: "Parse Expo app.json / app.config text and extract name, slug, version, orientation, sdkVersion, owner. Args: { text: string }. Returns { name?, slug?, version?, orientation?, sdkVersion?, owner? }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "app.json or app.config contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "expo_plugins_list",
        description: "Extract the Expo plugins array (string or [name, config] entries). Args: { text }. Returns { plugins: (string|object)[], names: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "app.json or app.config contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "expo_scheme_list",
        description: "Extract deep-link scheme(s) plus ios.bundleIdentifier and android.package. Args: { text }. Returns { scheme?, schemes, iosBundleId?, androidPackage? }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "app.json or app.config contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "expo_lint_lite",
        description: "Educational heuristic lite lint: empty config, missing slug/name, privacy/permissions tips, JS app.config no-eval limits, expo.extra secrets smell. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "app.json or app.config contents as a string (text only)",
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
const server = new Server({ name: "expo-config-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "expo_slug_name":
                return textResult(expoSlugName({ text: String(args.text ?? "") }));
            case "expo_plugins_list":
                return textResult(expoPluginsList({ text: String(args.text ?? "") }));
            case "expo_scheme_list":
                return textResult(expoSchemeList({ text: String(args.text ?? "") }));
            case "expo_lint_lite":
                return textResult(expoLintLite({ text: String(args.text ?? "") }));
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
    console.error("expo-config-lab failed to start:", err);
    process.exit(1);
});
