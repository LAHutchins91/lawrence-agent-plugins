/**
 * postcss-config-lab — local stdio MCP for postcss config text
 * Zero-auth. Prefer JSONC; JS/TS via best-effort heuristics (no eval).
 * No postcss binary, no network, no filesystem follow.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { postcssPluginsList } from "./tools/postcss_plugins_list.js";
import { postcssSyntaxHint } from "./tools/postcss_syntax_hint.js";
import { postcssMapOptions } from "./tools/postcss_map_options.js";
import { postcssLintLite } from "./tools/postcss_lint_lite.js";
const PURE = "Pure postcss config string analysis — prefer JSONC (comment-strip then JSON.parse); postcss.config.js / .cjs / .mjs / .ts uses best-effort regex heuristics (no eval). No postcss binary, no network.";
const TOOLS = [
    {
        name: "postcss_plugins_list",
        description: "Parse postcss config text and extract plugin names from plugins object keys or array (strings, [name, options] tuples, require/call heuristics). Handles postcss.config.json / .postcssrc JSONC and JS module.exports / export default heuristics; unwraps package.json \"postcss\" key. Args: { text: string }. Returns { plugins: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "postcss config contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "postcss_syntax_hint",
        description: "Extract syntax / parser / stringifier fields (strings or require() heuristics). Args: { text }. Returns { syntax?: string, parser?: string, stringifier?: string }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "postcss config contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "postcss_map_options",
        description: "Extract source-map (`map` boolean or object) plus from / to path options. Args: { text }. Returns { map?: boolean|object, from?: string, to?: string }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "postcss config contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "postcss_lint_lite",
        description: "Educational heuristic lite lint: empty config, missing plugins, autoprefixer without browserslist tip, deprecated plugins (cssnext/precss/autoprefixer-core/…), JS no-eval limits, package.json postcss unwrap, inline map tips. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "postcss config contents as a string (text only)",
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
const server = new Server({ name: "postcss-config-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "postcss_plugins_list":
                return textResult(postcssPluginsList({ text: String(args.text ?? "") }));
            case "postcss_syntax_hint":
                return textResult(postcssSyntaxHint({ text: String(args.text ?? "") }));
            case "postcss_map_options":
                return textResult(postcssMapOptions({ text: String(args.text ?? "") }));
            case "postcss_lint_lite":
                return textResult(postcssLintLite({ text: String(args.text ?? "") }));
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
    console.error("postcss-config-lab failed to start:", err);
    process.exit(1);
});
