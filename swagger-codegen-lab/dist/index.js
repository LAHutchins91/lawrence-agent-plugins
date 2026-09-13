/**
 * swagger-codegen-lab — local stdio MCP for swagger-codegen / openapi-generator CLI text
 * Zero-auth. Best-effort regex heuristics (+ optional light JSON/YAML config parse).
 * No codegen runtime, no network.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { scLanguagesList } from "./tools/sc_languages_list.js";
import { scConfigHint } from "./tools/sc_config_hint.js";
import { scTemplatesHint } from "./tools/sc_templates_hint.js";
import { scLintLite } from "./tools/sc_lint_lite.js";
const PURE = "Pure swagger-codegen / openapi-generator CLI string analysis via text heuristics. No codegen runtime, no network.";
const TOOLS = [
    {
        name: "sc_languages_list",
        description: "List -l / --lang languages and -g / --generator-name generators best-effort. Args: { text: string }. Returns { languages: string[], generators?: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Shell/CLI text invoking swagger-codegen / openapi-generator (-l / --lang / -g / --generator-name)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "sc_config_hint",
        description: "Extract -c / --config paths and -p / --additional-properties best-effort (optional light JSON/YAML key parse for pasted configs). Args: { text }. Returns { configs: [{path?, keys?}], additionalProperties?, count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Generator CLI text with -c / --config / -p / --additional-properties, or pasted config JSON/YAML",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "sc_templates_hint",
        description: "Extract -t / --template-dir paths and --library best-effort. Args: { text }. Returns { templates: [{path?}], library?, count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Generator CLI text with -t / --template-dir / --library",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "sc_lint_lite",
        description: "Educational heuristic lite lint: empty, missing -i/-g tip, swagger-codegen vs openapi-generator tip, hardcoded apiKey tip, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "swagger-codegen / openapi-generator CLI text as a string",
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
const server = new Server({ name: "swagger-codegen-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "sc_languages_list":
                return textResult(scLanguagesList({ text: String(args.text ?? "") }));
            case "sc_config_hint":
                return textResult(scConfigHint({ text: String(args.text ?? "") }));
            case "sc_templates_hint":
                return textResult(scTemplatesHint({ text: String(args.text ?? "") }));
            case "sc_lint_lite":
                return textResult(scLintLite({ text: String(args.text ?? "") }));
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
    console.error("swagger-codegen-lab failed to start:", err);
    process.exit(1);
});
