/**
 * typeorm-entity-lab — local stdio MCP for TypeORM entity TS/JS text
 * Zero-auth. Best-effort decorator heuristics. No TypeORM CLI, no network, no DB.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { typeormEntitiesList } from "./tools/typeorm_entities_list.js";
import { typeormRelationsHint } from "./tools/typeorm_relations_hint.js";
import { typeormColumnsHint } from "./tools/typeorm_columns_hint.js";
import { typeormLintLite } from "./tools/typeorm_lint_lite.js";
const PURE = "Pure TypeORM entity TS/JS string analysis via text heuristics. No TypeORM CLI, no network, no database.";
const TOOLS = [
    {
        name: "typeorm_entities_list",
        description: "Parse TypeORM entity TS/JS text and list @Entity classes best-effort. Args: { text: string }. Returns { entities: [{name, tableName?, columns: string[]}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "TypeORM entity source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "typeorm_relations_hint",
        description: "Summarize relations from @OneToMany / @ManyToOne / @OneToOne / @ManyToMany. Args: { text }. Returns { relations: [{entity?, field, kind, target?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "TypeORM entity source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "typeorm_columns_hint",
        description: "List columns from @Column / @PrimaryColumn / @PrimaryGeneratedColumn (and related). Args: { text }. Returns { columns: [{entity?, name, type?, primary?, unique?, nullable?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "TypeORM entity source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "typeorm_lint_lite",
        description: "Educational heuristic lite lint: empty, Entity without Primary, synchronize:true smell if DataSource present, plaintext password in DataSource options, missing JoinColumn on OneToOne, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "TypeORM entity / DataSource source as a string (text only)",
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
const server = new Server({ name: "typeorm-entity-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "typeorm_entities_list":
                return textResult(typeormEntitiesList({ text: String(args.text ?? "") }));
            case "typeorm_relations_hint":
                return textResult(typeormRelationsHint({ text: String(args.text ?? "") }));
            case "typeorm_columns_hint":
                return textResult(typeormColumnsHint({ text: String(args.text ?? "") }));
            case "typeorm_lint_lite":
                return textResult(typeormLintLite({ text: String(args.text ?? "") }));
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
    console.error("typeorm-entity-lab failed to start:", err);
    process.exit(1);
});
