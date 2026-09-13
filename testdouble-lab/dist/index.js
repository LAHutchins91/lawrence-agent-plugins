/**
 * testdouble-lab — local stdio MCP for testdouble.js JS/TS text
 * Zero-auth. Best-effort regex heuristics. No testdouble runtime, no network.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { tdReplacementsList } from "./tools/td_replacements_list.js";
import { tdWhenHint } from "./tools/td_when_hint.js";
import { tdVerifyHint } from "./tools/td_verify_hint.js";
import { tdLintLite } from "./tools/td_lint_lite.js";
const PURE = "Pure testdouble.js JS/TS string analysis via text heuristics. No testdouble runtime, no network.";
const TOOLS = [
    {
        name: "td_replacements_list",
        description: "Parse testdouble.js JS/TS text and list replacements best-effort. Args: { text: string }. Returns { replacements: [{module?, name?}], count }. From td.replace( / td.replaceEsm(. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "testdouble.js source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "td_when_hint",
        description: "List td.when(...).thenReturn/thenResolve/thenReject/thenCallback best-effort. Args: { text }. Returns { whens: [{call?, then?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "testdouble.js source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "td_verify_hint",
        description: "List td.verify( calls best-effort. Args: { text }. Returns { verifies: [{call?, config?}], count }. From td.verify(. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "testdouble.js source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "td_lint_lite",
        description: "Educational heuristic lite lint: empty, replace without reset tip, when without verify tip, function vs object double tips, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "testdouble.js source as a string (text only)",
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
const server = new Server({ name: "testdouble-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "td_replacements_list":
                return textResult(tdReplacementsList({ text: String(args.text ?? "") }));
            case "td_when_hint":
                return textResult(tdWhenHint({ text: String(args.text ?? "") }));
            case "td_verify_hint":
                return textResult(tdVerifyHint({ text: String(args.text ?? "") }));
            case "td_lint_lite":
                return textResult(tdLintLite({ text: String(args.text ?? "") }));
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
    console.error("testdouble-lab failed to start:", err);
    process.exit(1);
});
