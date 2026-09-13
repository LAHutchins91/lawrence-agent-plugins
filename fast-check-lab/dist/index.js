/**
 * fast-check-lab — local stdio MCP for fast-check JS/TS text
 * Zero-auth. Best-effort regex heuristics. No fast-check runtime, no network.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { fcArbsList } from "./tools/fc_arbs_list.js";
import { fcPropsHint } from "./tools/fc_props_hint.js";
import { fcConstraintsHint } from "./tools/fc_constraints_hint.js";
import { fcLintLite } from "./tools/fc_lint_lite.js";
const PURE = "Pure fast-check JS/TS string analysis via text heuristics. No fast-check runtime, no network.";
const TOOLS = [
    {
        name: "fc_arbs_list",
        description: "Parse fast-check JS/TS text and list arbitraries best-effort. Args: { text: string }. Returns { arbs: [{name, kind?}], count }. From fc.string / fc.integer / fc.array / fc.record / fc.constant / fc.oneof / fc.tuple etc. assigned consts (import * as fc from 'fast-check' or named). " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "fast-check source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "fc_props_hint",
        description: "Summarize fc.assert(fc.property(...)) / asyncProperty best-effort. Args: { text }. Returns { properties: [{name?, assert?, async?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "fast-check source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "fc_constraints_hint",
        description: "List constraint option keys passed to arbitraries / assert (minLength, maxLength, min, max, size, seed, numRuns, etc.). Args: { text }. Returns { constraints: [{on?, keys: string[]}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "fast-check source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "fc_lint_lite",
        description: "Educational heuristic lite lint: empty, assert without property, missing seed tip, unbounded integer tip, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "fast-check source as a string (text only)",
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
const server = new Server({ name: "fast-check-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "fc_arbs_list":
                return textResult(fcArbsList({ text: String(args.text ?? "") }));
            case "fc_props_hint":
                return textResult(fcPropsHint({ text: String(args.text ?? "") }));
            case "fc_constraints_hint":
                return textResult(fcConstraintsHint({ text: String(args.text ?? "") }));
            case "fc_lint_lite":
                return textResult(fcLintLite({ text: String(args.text ?? "") }));
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
    console.error("fast-check-lab failed to start:", err);
    process.exit(1);
});
