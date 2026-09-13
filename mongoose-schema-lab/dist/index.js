/**
 * mongoose-schema-lab — local stdio MCP for Mongoose schema JS/TS text
 * Zero-auth. Best-effort regex heuristics. No mongoose/mongo runtime, no network.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { mongooseModelsList } from "./tools/mongoose_models_list.js";
import { mongoosePathsHint } from "./tools/mongoose_paths_hint.js";
import { mongooseIndexesHint } from "./tools/mongoose_indexes_hint.js";
import { mongooseLintLite } from "./tools/mongoose_lint_lite.js";
const PURE = "Pure Mongoose schema JS/TS string analysis via text heuristics. No mongoose/mongo runtime, no network.";
const TOOLS = [
    {
        name: "mongoose_models_list",
        description: "Parse Mongoose schema/model JS/TS text and list models best-effort. Args: { text: string }. Returns { models: [{name, collection?}], schemas?: string[], count }. From mongoose.model('Name', ...) / model( / new Schema(. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Mongoose schema/model source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "mongoose_paths_hint",
        description: "Summarize Schema path definitions (object literal style). Args: { text }. Returns { paths: [{name, type?, required?, unique?, ref?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Mongoose schema source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "mongoose_indexes_hint",
        description: "List indexes from schema.index( / index: true on paths / compound indexes. Args: { text }. Returns { indexes: [{fields?, unique?, sparse?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Mongoose schema source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "mongoose_lint_lite",
        description: "Educational heuristic lite lint: empty, missing model name, plaintext mongo URI, syncIndexes tips, Mixed overuse, no timestamps tip, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Mongoose schema/model source as a string (text only)",
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
const server = new Server({ name: "mongoose-schema-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "mongoose_models_list":
                return textResult(mongooseModelsList({ text: String(args.text ?? "") }));
            case "mongoose_paths_hint":
                return textResult(mongoosePathsHint({ text: String(args.text ?? "") }));
            case "mongoose_indexes_hint":
                return textResult(mongooseIndexesHint({ text: String(args.text ?? "") }));
            case "mongoose_lint_lite":
                return textResult(mongooseLintLite({ text: String(args.text ?? "") }));
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
    console.error("mongoose-schema-lab failed to start:", err);
    process.exit(1);
});
