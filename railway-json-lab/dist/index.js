/**
 * railway-json-lab — local stdio MCP for railway.json / railway.toml text
 * Zero-auth. JSON/JSONC + light TOML heuristics. No Railway API, no network, no filesystem follow.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { railwayServicesList } from "./tools/railway_services_list.js";
import { railwayEnvKeys } from "./tools/railway_env_keys.js";
import { railwayDeployHint } from "./tools/railway_deploy_hint.js";
import { railwayLintLite } from "./tools/railway_lint_lite.js";
const PURE = "Pure railway.json / railway.toml string analysis — JSON/JSONC + light TOML heuristics. No Railway API, no network.";
const TOOLS = [
    {
        name: "railway_services_list",
        description: "Parse railway.json / railway.toml text and list services best-effort. Args: { text: string }. Returns { services: [{name?, build?, deploy?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "railway.json or railway.toml contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "railway_env_keys",
        description: "Parse railway config text and list env / variables keys only (values not echoed; secret-looking keys listed under redacted). Args: { text }. Returns { keys: string[], count, redacted?: string[] }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "railway.json or railway.toml contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "railway_deploy_hint",
        description: "Extract deploy/build related fields from railway.json build/deploy (or top-level / first service). Args: { text }. Returns { buildCommand?, startCommand?, watchPatterns?, numReplicas?, healthcheckPath?, restartPolicyType? }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "railway.json or railway.toml contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "railway_lint_lite",
        description: "Educational heuristic lite lint: empty, missing start/build, hardcoded secrets in env, Dockerfile vs nixpacks tips, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "railway.json or railway.toml contents as a string (text only)",
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
const server = new Server({ name: "railway-json-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "railway_services_list":
                return textResult(railwayServicesList({ text: String(args.text ?? "") }));
            case "railway_env_keys":
                return textResult(railwayEnvKeys({ text: String(args.text ?? "") }));
            case "railway_deploy_hint":
                return textResult(railwayDeployHint({ text: String(args.text ?? "") }));
            case "railway_lint_lite":
                return textResult(railwayLintLite({ text: String(args.text ?? "") }));
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
    console.error("railway-json-lab failed to start:", err);
    process.exit(1);
});
