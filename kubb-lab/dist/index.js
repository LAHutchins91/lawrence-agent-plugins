/**
 * kubb-lab — local stdio MCP for Kubb (kubb.config) config text
 * Zero-auth. JSON/YAML parse via yaml; best-effort kubb.config.ts (no eval).
 * No @kubb/cli, no codegen runtime, no network.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { kbOutputsList } from "./tools/kb_outputs_list.js";
import { kbPluginsHint } from "./tools/kb_plugins_hint.js";
import { kbHooksHint } from "./tools/kb_hooks_hint.js";
import { kbLintLite } from "./tools/kb_lint_lite.js";
const PURE = "Pure Kubb kubb.config string analysis via JSON/YAML/TS heuristics. No @kubb/cli, no codegen runtime, no network.";
const TOOLS = [
    {
        name: "kb_outputs_list",
        description: "From kubb.config text (ts/js/json), list output paths (output.path, root output, per-plugin output). Args: { text: string }. Returns { outputs: [{path?, plugin?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Kubb config (kubb.config.ts / .js / .json / yaml) with output.path / plugins",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "kb_plugins_hint",
        description: "Detect Kubb plugins referenced (pluginOas, pluginTs, pluginReactQuery, pluginSwr, pluginZod, pluginClient, pluginFaker, @kubb/swagger-*, string plugin names). Args: { text }. Returns { plugins: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Kubb config text with plugins / imports",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "kb_hooks_hint",
        description: "Extract hooks (hooks.done, hooks scripts / post-generate commands) best-effort from config text. Args: { text }. Returns { hooks: [{name?, command?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Kubb config text with hooks.done / hooks scripts",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "kb_lint_lite",
        description: "Educational lite lint: empty input, missing input.path / output.path tips, remote OpenAPI URL tip, hardcoded apiKey/Authorization tip, absolute output path tip, etc. Not an exploit guide. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Kubb config text as a string",
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
const server = new Server({ name: "kubb-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "kb_outputs_list":
                return textResult(kbOutputsList({ text: String(args.text ?? "") }));
            case "kb_plugins_hint":
                return textResult(kbPluginsHint({ text: String(args.text ?? "") }));
            case "kb_hooks_hint":
                return textResult(kbHooksHint({ text: String(args.text ?? "") }));
            case "kb_lint_lite":
                return textResult(kbLintLite({ text: String(args.text ?? "") }));
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
    console.error("kubb-lab failed to start:", err);
    process.exit(1);
});
