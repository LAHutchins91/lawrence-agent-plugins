/**
 * protoc-lab — local stdio MCP for protoc CLI text
 * Zero-auth. Best-effort regex heuristics. No protoc/protobuf compiler runtime, no network.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { pcIncludesList } from "./tools/pc_includes_list.js";
import { pcPluginsHint } from "./tools/pc_plugins_hint.js";
import { pcOptionsHint } from "./tools/pc_options_hint.js";
import { pcLintLite } from "./tools/pc_lint_lite.js";
const PURE = "Pure protoc CLI string analysis via text heuristics. No protoc/protobuf compiler runtime, no network.";
const TOOLS = [
    {
        name: "pc_includes_list",
        description: "List -I / --proto_path includes and trailing .proto files best-effort. Args: { text: string }. Returns { includes: string[], protos: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Shell/CLI text invoking protoc (-I / --proto_path / .proto)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "pc_plugins_hint",
        description: "Extract --*_out generators and --plugin= entries best-effort. Args: { text }. Returns { plugins: [{name: 'cpp'|'python'|'go'|'js'|'grpc'|string, out?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "protoc CLI text with --cpp_out / --python_out / --go_out / --plugin=…",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "pc_options_hint",
        description: "List other common protoc flags best-effort (--descriptor_set_out, --include_imports, --experimental_allow_proto3_optional, etc.). Args: { text }. Returns { options: [{flag, value?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "protoc CLI text with descriptor/encode/optional flags",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "pc_lint_lite",
        description: "Educational heuristic lite lint: empty, missing -I tip, no *_out tip, absolute path tips, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "protoc CLI text as a string",
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
const server = new Server({ name: "protoc-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "pc_includes_list":
                return textResult(pcIncludesList({ text: String(args.text ?? "") }));
            case "pc_plugins_hint":
                return textResult(pcPluginsHint({ text: String(args.text ?? "") }));
            case "pc_options_hint":
                return textResult(pcOptionsHint({ text: String(args.text ?? "") }));
            case "pc_lint_lite":
                return textResult(pcLintLite({ text: String(args.text ?? "") }));
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
    console.error("protoc-lab failed to start:", err);
    process.exit(1);
});
