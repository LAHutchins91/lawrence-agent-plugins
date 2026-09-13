/**
 * rollup-config-lab — local stdio MCP for rollup config text
 * Zero-auth. Prefer JSONC; JS/TS via best-effort heuristics (no eval).
 * No rollup binary, no network, no filesystem follow.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { rollupInputList } from "./tools/rollup_input_list.js";
import { rollupPluginsList } from "./tools/rollup_plugins_list.js";
import { rollupOutputFormats } from "./tools/rollup_output_formats.js";
import { rollupLintLite } from "./tools/rollup_lint_lite.js";
const PURE = "Pure rollup config string analysis — prefer JSONC (comment-strip then JSON.parse); rollup.config.js / .ts / .mjs uses best-effort regex heuristics (no eval). No rollup binary, no network.";
const TOOLS = [
    {
        name: "rollup_input_list",
        description: "Parse rollup config text and extract input (raw + flattened path list). Handles string, array, or object map entries. JSON/JSONC and JS/TS module.exports / export default heuristics. Args: { text: string }. Returns { input, inputs: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "rollup config contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "rollup_plugins_list",
        description: "List plugin constructor / factory names from plugins: [...] (best-effort regex, no eval). Args: { text }. Returns { plugins: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "rollup config contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "rollup_output_formats",
        description: "Extract output object or array: file/dir/format/name/exports. Args: { text }. Returns { outputs:[{file?, dir?, format?, name?, exports?}], formats: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "rollup config contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "rollup_lint_lite",
        description: "Educational heuristic lite lint: empty config, missing input/output, format umd/iife without name, file+dir conflict, external tips, deprecated options (moduleName, legacy, …), sourcemap tips, JS no-eval limits. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "rollup config contents as a string (text only)",
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
const server = new Server({ name: "rollup-config-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "rollup_input_list":
                return textResult(rollupInputList({ text: String(args.text ?? "") }));
            case "rollup_plugins_list":
                return textResult(rollupPluginsList({ text: String(args.text ?? "") }));
            case "rollup_output_formats":
                return textResult(rollupOutputFormats({ text: String(args.text ?? "") }));
            case "rollup_lint_lite":
                return textResult(rollupLintLite({ text: String(args.text ?? "") }));
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
    console.error("rollup-config-lab failed to start:", err);
    process.exit(1);
});
