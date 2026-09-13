/**
 * bombardier-lab — local stdio MCP for bombardier CLI text
 * Zero-auth. Best-effort regex heuristics. No bombardier runtime, no network.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { bbTargetsList } from "./tools/bb_targets_list.js";
import { bbOptionsHint } from "./tools/bb_options_hint.js";
import { bbLatencyHint } from "./tools/bb_latency_hint.js";
import { bbLintLite } from "./tools/bb_lint_lite.js";
const PURE = "Pure bombardier CLI string analysis via text heuristics. No bombardier runtime, no network.";
const TOOLS = [
    {
        name: "bb_targets_list",
        description: "List bombardier target URLs best-effort from bombardier invocations / trailing URLs. Args: { text: string }. Returns { targets: [{url?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Shell/CLI text invoking bombardier",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "bb_options_hint",
        description: "List bombardier CLI options best-effort from shell/CLI lines. Args: { text }. Returns { options: [{flag: '-c'|'-n'|'-d'|'-m'|'-b'|'-H'|'-l'|'-p'|'-r'|string, value?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Shell/CLI text invoking bombardier",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "bb_latency_hint",
        description: "List bombardier latency/print related flags best-effort. Args: { text }. Returns { latency: [{kind: 'printLatencies'|'-l'|'-p'|string}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Shell/CLI or Go config text mentioning bombardier latency/print flags",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "bb_lint_lite",
        description: "Educational heuristic lite lint: empty, missing -c/-n tip, unbounded duration tip, no URL tip, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "bombardier CLI text as a string",
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
const server = new Server({ name: "bombardier-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "bb_targets_list":
                return textResult(bbTargetsList({ text: String(args.text ?? "") }));
            case "bb_options_hint":
                return textResult(bbOptionsHint({ text: String(args.text ?? "") }));
            case "bb_latency_hint":
                return textResult(bbLatencyHint({ text: String(args.text ?? "") }));
            case "bb_lint_lite":
                return textResult(bbLintLite({ text: String(args.text ?? "") }));
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
    console.error("bombardier-lab failed to start:", err);
    process.exit(1);
});
