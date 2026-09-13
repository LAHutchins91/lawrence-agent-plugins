/**
 * prisma-schema-lab — local stdio MCP for schema.prisma text
 * Zero-auth. Best-effort Prisma DSL heuristics. No Prisma CLI, no network, no DB.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { prismaModelsList } from "./tools/prisma_models_list.js";
import { prismaDatasources } from "./tools/prisma_datasources.js";
import { prismaRelationsHint } from "./tools/prisma_relations_hint.js";
import { prismaLintLite } from "./tools/prisma_lint_lite.js";
const PURE = "Pure schema.prisma string analysis via text heuristics. No Prisma CLI, no network, no database.";
const TOOLS = [
    {
        name: "prisma_models_list",
        description: "Parse Prisma schema.prisma text and list model / enum blocks best-effort. Args: { text: string }. Returns { models: [{name, fields: [{name, type, attrs?}], @@attrs?}], enums?: [{name, values}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "schema.prisma contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "prisma_datasources",
        description: "Parse datasource / generator blocks from schema.prisma text. URL values are redacted to provider/env-ref hints (never echo full connection secrets). Args: { text }. Returns { datasources: [{name, provider?, urlHint?}], generators?: [{name, provider?}] }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "schema.prisma contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "prisma_relations_hint",
        description: "Summarize relations from @relation attributes and relational field types. Args: { text }. Returns { relations: [{from, field, to?, kind?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "schema.prisma contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "prisma_lint_lite",
        description: "Educational heuristic lite lint: empty, missing datasource/generator, String ids without @id, missing @@map tips, plaintext URL in schema, previewFeatures notes, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "schema.prisma contents as a string (text only)",
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
const server = new Server({ name: "prisma-schema-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "prisma_models_list":
                return textResult(prismaModelsList({ text: String(args.text ?? "") }));
            case "prisma_datasources":
                return textResult(prismaDatasources({ text: String(args.text ?? "") }));
            case "prisma_relations_hint":
                return textResult(prismaRelationsHint({ text: String(args.text ?? "") }));
            case "prisma_lint_lite":
                return textResult(prismaLintLite({ text: String(args.text ?? "") }));
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
    console.error("prisma-schema-lab failed to start:", err);
    process.exit(1);
});
