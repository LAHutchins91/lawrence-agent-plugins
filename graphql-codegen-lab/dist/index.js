/**
 * graphql-codegen-lab — local stdio MCP for GraphQL Code Generator config text
 * Zero-auth. YAML/JSON parse via yaml; best-effort codegen.ts (no eval).
 * No codegen runtime, no network.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { gqlcPluginsList } from "./tools/gqlc_plugins_list.js";
import { gqlcDocumentsHint } from "./tools/gqlc_documents_hint.js";
import { gqlcScalarsHint } from "./tools/gqlc_scalars_hint.js";
import { gqlcLintLite } from "./tools/gqlc_lint_lite.js";
const PURE = "Pure GraphQL Code Generator config string analysis via YAML/JSON/TS heuristics. No codegen runtime, no network.";
const TOOLS = [
    {
        name: "gqlc_plugins_list",
        description: "List plugins and generates targets best-effort from codegen.yml / JSON / TS or CLI. Args: { text: string }. Returns { plugins: string[], generates?: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "GraphQL Code Generator config (codegen.yml / .json / .ts) or CLI text with plugins / generates",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "gqlc_documents_hint",
        description: "Extract schema and documents fields best-effort. Args: { text }. Returns { schema?: string|string[], documents?: string|string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "GraphQL Code Generator config text with schema / documents fields",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "gqlc_scalars_hint",
        description: "Extract config.scalars / scalars map best-effort. Args: { text }. Returns { scalars: Record<string,string>, count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "GraphQL Code Generator config text with scalars / config.scalars",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "gqlc_lint_lite",
        description: "Educational heuristic lite lint: empty, missing schema tip, no documents tip, plaintext headers/auth tip, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "GraphQL Code Generator config or CLI text as a string",
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
const server = new Server({ name: "graphql-codegen-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "gqlc_plugins_list":
                return textResult(gqlcPluginsList({ text: String(args.text ?? "") }));
            case "gqlc_documents_hint":
                return textResult(gqlcDocumentsHint({ text: String(args.text ?? "") }));
            case "gqlc_scalars_hint":
                return textResult(gqlcScalarsHint({ text: String(args.text ?? "") }));
            case "gqlc_lint_lite":
                return textResult(gqlcLintLite({ text: String(args.text ?? "") }));
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
    console.error("graphql-codegen-lab failed to start:", err);
    process.exit(1);
});
