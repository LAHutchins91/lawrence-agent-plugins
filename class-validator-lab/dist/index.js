/**
 * class-validator-lab — local stdio MCP for class-validator / class-transformer TS
 * Zero-auth. Best-effort regex heuristics. No runtime, no network.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { cvDtosList } from "./tools/cv_dtos_list.js";
import { cvDecoratorsHint } from "./tools/cv_decorators_hint.js";
import { cvNestedHint } from "./tools/cv_nested_hint.js";
import { cvLintLite } from "./tools/cv_lint_lite.js";
const PURE = "Pure class-validator / class-transformer TS string analysis via text heuristics. No runtime, no network.";
const TOOLS = [
    {
        name: "cv_dtos_list",
        description: "Parse class-validator DTO TypeScript text and list DTO classes best-effort. Args: { text: string }. Returns { dtos: [{name, properties: string[]}], count }. Classes with class-validator decorators (@IsString, @IsEmail, @IsOptional, etc.). " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "class-validator DTO source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "cv_decorators_hint",
        description: "List class-validator / class-transformer decorator usages per property best-effort. Args: { text }. Returns { decorators: [{dto?, property?, name}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "class-validator DTO source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "cv_nested_hint",
        description: "Extract nested DTO hints from @ValidateNested / @Type(() => Foo) best-effort. Args: { text }. Returns { nested: [{dto?, property?, type?, each?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "class-validator DTO source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "cv_lint_lite",
        description: "Educational heuristic lite lint: empty, ValidateNested without Type, missing whitelist tip, IsOptional on required-looking fields, array each tip, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "class-validator DTO source as a string (text only)",
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
const server = new Server({ name: "class-validator-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "cv_dtos_list":
                return textResult(cvDtosList({ text: String(args.text ?? "") }));
            case "cv_decorators_hint":
                return textResult(cvDecoratorsHint({ text: String(args.text ?? "") }));
            case "cv_nested_hint":
                return textResult(cvNestedHint({ text: String(args.text ?? "") }));
            case "cv_lint_lite":
                return textResult(cvLintLite({ text: String(args.text ?? "") }));
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
    console.error("class-validator-lab failed to start:", err);
    process.exit(1);
});
