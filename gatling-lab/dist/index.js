/**
 * gatling-lab — local stdio MCP for Gatling Scala/Java simulation text
 * Zero-auth. Best-effort regex heuristics. No Gatling/load-test runtime, no network.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { gatScenariosList } from "./tools/gat_scenarios_list.js";
import { gatInjectsHint } from "./tools/gat_injects_hint.js";
import { gatAssertionsHint } from "./tools/gat_assertions_hint.js";
import { gatLintLite } from "./tools/gat_lint_lite.js";
const PURE = "Pure Gatling Scala/Java string analysis via text heuristics. No Gatling/load-test runtime, no network.";
const TOOLS = [
    {
        name: "gat_scenarios_list",
        description: "List Gatling scenarios and protocol signals best-effort from Scala/Java simulation text. Args: { text: string }. Returns { scenarios: [{name}], protocols?: string[], count }. From scenario(\"...\") / http.baseUrl / protocol defs. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Gatling Scala/Java simulation source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "gat_injects_hint",
        description: "List Gatling injection steps best-effort. Args: { text }. Returns { injects: [{kind: 'atOnceUsers'|'rampUsers'|'constantUsersPerSec'|'stressPeakUsers'|string, args?}], count }. From inject( / OpenInjectionStep patterns. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Gatling Scala/Java simulation source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "gat_assertions_hint",
        description: "List Gatling assertion signals best-effort. Args: { text }. Returns { assertions: [{kind}], count }. From assertions( / global.responseTime / details( / forAll. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Gatling Scala/Java simulation source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "gat_lint_lite",
        description: "Educational heuristic lite lint: empty, missing assertions tip, atOnceUsers-only tip, hardcoded credentials tip, maxDuration missing tip, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Gatling Scala/Java simulation source as a string (text only)",
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
const server = new Server({ name: "gatling-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "gat_scenarios_list":
                return textResult(gatScenariosList({ text: String(args.text ?? "") }));
            case "gat_injects_hint":
                return textResult(gatInjectsHint({ text: String(args.text ?? "") }));
            case "gat_assertions_hint":
                return textResult(gatAssertionsHint({ text: String(args.text ?? "") }));
            case "gat_lint_lite":
                return textResult(gatLintLite({ text: String(args.text ?? "") }));
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
    console.error("gatling-lab failed to start:", err);
    process.exit(1);
});
