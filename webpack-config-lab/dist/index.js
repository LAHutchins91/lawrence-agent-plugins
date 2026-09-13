/**
 * webpack-config-lab — local stdio MCP for webpack config text
 * Zero-auth. Prefer JSONC; JS/TS via best-effort heuristics (no eval).
 * No webpack binary, no network, no filesystem follow.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { wpEntryPoints } from "./tools/wp_entry_points.js";
import { wpLoadersSummary } from "./tools/wp_loaders_summary.js";
import { wpPluginsList } from "./tools/wp_plugins_list.js";
import { wpLintLite } from "./tools/wp_lint_lite.js";
const PURE = "Pure webpack config string analysis — prefer JSONC (comment-strip then JSON.parse); webpack.config.js / .ts uses best-effort regex heuristics (no eval). No webpack binary, no network.";
const TOOLS = [
    {
        name: "wp_entry_points",
        description: "Parse webpack config text and extract entry (raw + named/path list), mode, and output.path/filename/publicPath. Handles JSON/JSONC and JS/TS module.exports / export default heuristics. Args: { text: string }. Returns { entry, entries:[{name?, path?}], mode?, output?:{path?, filename?, publicPath?} }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "webpack config contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "wp_loaders_summary",
        description: "Extract module.rules loader summary from webpack config text (test / use / loader / exclude). Args: { text }. Returns { rules:[{test?, use?, loader?, exclude?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "webpack config contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "wp_plugins_list",
        description: "List plugin constructor names / require paths from plugins: [...] (best-effort regex, no eval). Args: { text }. Returns { plugins: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "webpack config contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "wp_lint_lite",
        description: "Educational heuristic lite lint: empty config, missing entry/output, mode production without optimization tip, deprecated loaders (file-loader, url-loader, raw-loader, …), source-map / eval-source-map in prod, DefinePlugin secret smells, JS no-eval limits. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "webpack config contents as a string (text only)",
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
const server = new Server({ name: "webpack-config-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "wp_entry_points":
                return textResult(wpEntryPoints({ text: String(args.text ?? "") }));
            case "wp_loaders_summary":
                return textResult(wpLoadersSummary({ text: String(args.text ?? "") }));
            case "wp_plugins_list":
                return textResult(wpPluginsList({ text: String(args.text ?? "") }));
            case "wp_lint_lite":
                return textResult(wpLintLite({ text: String(args.text ?? "") }));
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
    console.error("webpack-config-lab failed to start:", err);
    process.exit(1);
});
