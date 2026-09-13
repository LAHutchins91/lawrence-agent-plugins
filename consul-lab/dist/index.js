/**
 * consul-lab — local stdio MCP for Consul HCL/JSON text heuristics
 * Zero-auth. String/regex analysis only.
 * No consul CLI, agent/cluster, network, filesystem follow, or eval.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { consulServicesList } from "./tools/consul_services_list.js";
import { consulChecksHint } from "./tools/consul_checks_hint.js";
import { consulIntentionsHint } from "./tools/consul_intentions_hint.js";
import { consulLintLite } from "./tools/consul_lint_lite.js";
const PURE = "Pure Consul HCL/JSON string analysis. No consul CLI, no agent, no network, no filesystem follow, no eval.";
const TOOLS = [
    {
        name: "consul_services_list",
        description: "Parse Consul service blocks / JSON services; list name, port, tags, kind. Args: { text: string }. Returns { services: [{name?, port?, tags?, kind?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Consul HCL or JSON contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "consul_checks_hint",
        description: "Extract health checks (http, tcp, script, ttl, grpc, interval, timeout). Args: { text }. Returns { checks: [{name?, type?, interval?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Consul HCL or JSON contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "consul_intentions_hint",
        description: "Extract intention/service-intentions (source, destination, action allow/deny). Args: { text }. Returns { intentions: [{source?, destination?, action?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Consul HCL or JSON contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "consul_lint_lite",
        description: "Educational tips: empty, missing service name, plaintext ACL tokens, allow-all intention tip, script check tip. Not exploit guide. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Consul HCL or JSON contents as a string (text only)",
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
const server = new Server({ name: "consul-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "consul_services_list":
                return textResult(consulServicesList({ text: String(args.text ?? "") }));
            case "consul_checks_hint":
                return textResult(consulChecksHint({ text: String(args.text ?? "") }));
            case "consul_intentions_hint":
                return textResult(consulIntentionsHint({ text: String(args.text ?? "") }));
            case "consul_lint_lite":
                return textResult(consulLintLite({ text: String(args.text ?? "") }));
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
    console.error("consul-lab failed to start:", err);
    process.exit(1);
});
