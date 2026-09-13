/**
 * maestro-lab — local stdio MCP for Maestro YAML flow text
 * Zero-auth. Best-effort yaml-package heuristics. No Maestro/device runtime, no network.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { maFlowsList } from "./tools/ma_flows_list.js";
import { maCommandsHint } from "./tools/ma_commands_hint.js";
import { maSelectorsHint } from "./tools/ma_selectors_hint.js";
import { maLintLite } from "./tools/ma_lint_lite.js";
const PURE = "Pure Maestro YAML flow string analysis via the yaml package. No Maestro/device runtime, no network.";
const TOOLS = [
    {
        name: "ma_flows_list",
        description: "Parse Maestro flow YAML text and list top-level flow meta plus ordered command names. Args: { text: string }. Returns { appId?: string, name?: string, tags?: string[], steps: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Maestro flow YAML source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "ma_commands_hint",
        description: "Count Maestro command frequency best-effort (launchApp, tapOn, inputText, assertVisible, scroll, swipe, runFlow, evalScript, etc.). Args: { text }. Returns { commands: [{name, count}], total }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Maestro flow YAML source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "ma_selectors_hint",
        description: "List selectors from tapOn/assertVisible (and similar) forms — string text, or {id:}/{text:}/{point:}. Args: { text }. Returns { selectors: [{kind: 'id'|'text'|'point'|string, value?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Maestro flow YAML source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "ma_lint_lite",
        description: "Educational heuristic lite lint: empty, missing appId, hardcoded coordinates tip, missing assert after navigation tip, evalScript overuse, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Maestro flow YAML source as a string (text only)",
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
const server = new Server({ name: "maestro-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "ma_flows_list":
                return textResult(maFlowsList({ text: String(args.text ?? "") }));
            case "ma_commands_hint":
                return textResult(maCommandsHint({ text: String(args.text ?? "") }));
            case "ma_selectors_hint":
                return textResult(maSelectorsHint({ text: String(args.text ?? "") }));
            case "ma_lint_lite":
                return textResult(maLintLite({ text: String(args.text ?? "") }));
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
    console.error("maestro-lab failed to start:", err);
    process.exit(1);
});
