/**
 * openapi-zod-lab — local stdio MCP for OpenAPI YAML/JSON → Zod mapping hints
 * Zero-auth. Best-effort parse + heuristics. No Zod runtime, no codegen, no network.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { ozPathsList } from "./tools/oz_paths_list.js";
import { ozSchemasHint } from "./tools/oz_schemas_hint.js";
import { ozOpsHint } from "./tools/oz_ops_hint.js";
import { ozLintLite } from "./tools/oz_lint_lite.js";
const PURE = "Pure OpenAPI YAML/JSON/JSONC string analysis via parse + Zod mapping heuristics. No Zod runtime, no codegen, no network.";
const TOOLS = [
    {
        name: "oz_paths_list",
        description: "Parse OpenAPI YAML/JSON text and list paths with HTTP methods. Args: { text: string }. Returns { paths: [{path, methods: string[]}], count }. From OpenAPI `paths`. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "OpenAPI document as YAML or JSON/JSONC string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "oz_schemas_hint",
        description: "List components.schemas (or OAS2 definitions) with best-effort Zod type hints (string→z.string, integer→z.number.int, object→z.object, array→z.array, $ref name, etc.). Args: { text }. Returns { schemas: [{name, type?, zodHint?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "OpenAPI document as YAML or JSON/JSONC string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "oz_ops_hint",
        description: "Summarize OpenAPI operations: operationId, method, path, tags, requestBody hint, response status codes. Args: { text }. Returns { operations: [{operationId?, method, path, tags?, requestBody?, responses: string[]}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "OpenAPI document as YAML or JSON/JSONC string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "oz_lint_lite",
        description: "Educational heuristic lite lint: empty, missing openapi/swagger version, no paths, unused schemas tip, nullable vs optional mapping tip, integer→z.number().int() tip, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "OpenAPI document as YAML or JSON/JSONC string (text only)",
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
const server = new Server({ name: "openapi-zod-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "oz_paths_list":
                return textResult(ozPathsList({ text: String(args.text ?? "") }));
            case "oz_schemas_hint":
                return textResult(ozSchemasHint({ text: String(args.text ?? "") }));
            case "oz_ops_hint":
                return textResult(ozOpsHint({ text: String(args.text ?? "") }));
            case "oz_lint_lite":
                return textResult(ozLintLite({ text: String(args.text ?? "") }));
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
    console.error("openapi-zod-lab failed to start:", err);
    process.exit(1);
});
