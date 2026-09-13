/**
 * grpcurl-lab — local stdio MCP for grpcurl CLI text
 * Zero-auth. Best-effort regex heuristics. No grpcurl/gRPC runtime, no network.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { gcServicesList } from "./tools/gc_services_list.js";
import { gcMethodsHint } from "./tools/gc_methods_hint.js";
import { gcMetadataHint } from "./tools/gc_metadata_hint.js";
import { gcLintLite } from "./tools/gc_lint_lite.js";
const PURE = "Pure grpcurl CLI string analysis via text heuristics. No grpcurl/gRPC runtime, no network.";
const TOOLS = [
    {
        name: "gc_services_list",
        description: "List targets and services best-effort from grpcurl invocations / list / service names. Args: { text: string }. Returns { targets: [{host?}], services: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Shell/CLI text invoking grpcurl (list / describe / calls)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "gc_methods_hint",
        description: "Extract fully-qualified gRPC method calls best-effort. Args: { text }. Returns { methods: [{service?, method?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "grpcurl CLI text with package.Service/Method symbols",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "gc_metadata_hint",
        description: "List grpcurl metadata/header flags best-effort (auth-looking values redacted). Args: { text }. Returns { metadata: [{flag: '-H'|'-rpc-header'|'-reflect-metadata'|string, value?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "grpcurl CLI text with -H / -rpc-header / -reflect-metadata",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "gc_lint_lite",
        description: "Educational heuristic lite lint: empty, plaintext/insecure tip, missing -proto/-protoset/-use-reflection tip, hardcoded bearer tip, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "grpcurl CLI text as a string",
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
const server = new Server({ name: "grpcurl-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "gc_services_list":
                return textResult(gcServicesList({ text: String(args.text ?? "") }));
            case "gc_methods_hint":
                return textResult(gcMethodsHint({ text: String(args.text ?? "") }));
            case "gc_metadata_hint":
                return textResult(gcMetadataHint({ text: String(args.text ?? "") }));
            case "gc_lint_lite":
                return textResult(gcLintLite({ text: String(args.text ?? "") }));
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
    console.error("grpcurl-lab failed to start:", err);
    process.exit(1);
});
