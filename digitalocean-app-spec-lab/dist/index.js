/**
 * digitalocean-app-spec-lab — local stdio MCP for .do/app.yaml / App Spec text
 * Zero-auth. YAML via `yaml` package. No DigitalOcean API, no network, no filesystem follow.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { doServicesList } from "./tools/do_services_list.js";
import { doEnvKeys } from "./tools/do_env_keys.js";
import { doRoutesHint } from "./tools/do_routes_hint.js";
import { doLintLite } from "./tools/do_lint_lite.js";
const PURE = "Pure .do/app.yaml / App Spec string analysis via the yaml package. No DigitalOcean API, no network.";
const TOOLS = [
    {
        name: "do_services_list",
        description: "Parse DigitalOcean App Spec YAML text and list services / workers / jobs / static_sites best-effort. Args: { text: string }. Returns { services: [{name?, http_port?, instance_count?, instance_size_slug?}], workers?: [{name?}], jobs?: [{name?}], static_sites?: [{name?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: ".do/app.yaml / App Spec contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "do_env_keys",
        description: "Parse App Spec YAML and list envs / env_vars keys only across components (values never echoed; secret-looking keys under redacted; scopes collected). Args: { text }. Returns { keys: string[], count, scopes?: string[], redacted?: string[] }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: ".do/app.yaml / App Spec contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "do_routes_hint",
        description: "Summarize ingress / per-service routes / domains (and alerts presence) from App Spec YAML. Args: { text }. Returns { ingress?, routes: [{path?, preserve_path_prefix?}], domains?: string[], alertrules_hint?: boolean }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: ".do/app.yaml / App Spec contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "do_lint_lite",
        description: "Educational heuristic lite lint: empty, missing name/region, plaintext secrets in envs, health_check tips, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: ".do/app.yaml / App Spec contents as a string (text only)",
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
const server = new Server({ name: "digitalocean-app-spec-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "do_services_list":
                return textResult(doServicesList({ text: String(args.text ?? "") }));
            case "do_env_keys":
                return textResult(doEnvKeys({ text: String(args.text ?? "") }));
            case "do_routes_hint":
                return textResult(doRoutesHint({ text: String(args.text ?? "") }));
            case "do_lint_lite":
                return textResult(doLintLite({ text: String(args.text ?? "") }));
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
    console.error("digitalocean-app-spec-lab failed to start:", err);
    process.exit(1);
});
