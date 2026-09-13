/**
 * prettier-config-lab — local stdio MCP for Prettier config text
 * Zero-auth. Prefer JSONC; YAML via yaml; JS via best-effort heuristics.
 * No prettier binary, no network, no filesystem config follow.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { prettierOptionsSummary } from "./tools/prettier_options_summary.js";
import { prettierOverridesList } from "./tools/prettier_overrides_list.js";
import { prettierPluginsList } from "./tools/prettier_plugins_list.js";
import { prettierLintLite } from "./tools/prettier_lint_lite.js";
const PURE = "Pure Prettier config string analysis — prefer JSONC (comment-strip then JSON.parse); YAML via yaml package; prettier.config.js / .prettierrc.js use best-effort regex heuristics (no eval). No prettier binary, no network.";
const TOOLS = [
    {
        name: "prettier_options_summary",
        description: "Parse Prettier config text and return core options as Record plus sorted keys. Handles JSON/JSONC .prettierrc*, YAML, package.json prettier key, and JS heuristic extract. Args: { text: string }. Returns { options: Record<string, unknown>, keys: string[] }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Prettier config contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "prettier_overrides_list",
        description: "Extract overrides array into [{files?, options?}] with count. Args: { text }. Returns { overrides, count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Prettier config contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "prettier_plugins_list",
        description: "Extract plugins string array from Prettier config text. Args: { text }. Returns { plugins: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Prettier config contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "prettier_lint_lite",
        description: "Educational heuristic lite lint: empty config, useTabs+tabWidth notes, printWidth extremes, trailingComma none/es5 smells, deprecated jsxBracketSameLine, override missing files, JS heuristic limits, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Prettier config contents as a string (text only)",
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
const server = new Server({ name: "prettier-config-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "prettier_options_summary":
                return textResult(prettierOptionsSummary({ text: String(args.text ?? "") }));
            case "prettier_overrides_list":
                return textResult(prettierOverridesList({ text: String(args.text ?? "") }));
            case "prettier_plugins_list":
                return textResult(prettierPluginsList({ text: String(args.text ?? "") }));
            case "prettier_lint_lite":
                return textResult(prettierLintLite({ text: String(args.text ?? "") }));
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
    console.error("prettier-config-lab failed to start:", err);
    process.exit(1);
});
