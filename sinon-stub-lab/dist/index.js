/**
 * sinon-stub-lab — local stdio MCP for Sinon stub/spy JS/TS text
 * Zero-auth. Best-effort regex heuristics. No sinon runtime, no network.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { sinonStubsList } from "./tools/sinon_stubs_list.js";
import { sinonSpiesHint } from "./tools/sinon_spies_hint.js";
import { sinonFakesHint } from "./tools/sinon_fakes_hint.js";
import { sinonLintLite } from "./tools/sinon_lint_lite.js";
const PURE = "Pure Sinon stub/spy JS/TS string analysis via text heuristics. No sinon runtime, no network.";
const TOOLS = [
    {
        name: "sinon_stubs_list",
        description: "Parse Sinon stub JS/TS text and list stubs best-effort. Args: { text: string }. Returns { stubs: [{target?, method?, name?}], count }. From sinon.stub( / sandbox.stub(. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Sinon stub/spy source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "sinon_spies_hint",
        description: "List Sinon spies best-effort. Args: { text }. Returns { spies: [{target?, method?}], count }. From sinon.spy( / sandbox.spy(. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Sinon stub/spy source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "sinon_fakes_hint",
        description: "List Sinon fakes / timers / server / sandbox best-effort. Args: { text }. Returns { fakes: [{kind: 'fake'|'fakeTimers'|'fakeServer'|string}], count }. From sinon.fake / useFakeTimers / fakeServer / createSandbox. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Sinon stub/spy source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "sinon_lint_lite",
        description: "Educational heuristic lite lint: empty, stub without restore/sandbox tip, calledOnce missing assert tip, fake timers without restore, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Sinon stub/spy source as a string (text only)",
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
const server = new Server({ name: "sinon-stub-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "sinon_stubs_list":
                return textResult(sinonStubsList({ text: String(args.text ?? "") }));
            case "sinon_spies_hint":
                return textResult(sinonSpiesHint({ text: String(args.text ?? "") }));
            case "sinon_fakes_hint":
                return textResult(sinonFakesHint({ text: String(args.text ?? "") }));
            case "sinon_lint_lite":
                return textResult(sinonLintLite({ text: String(args.text ?? "") }));
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
    console.error("sinon-stub-lab failed to start:", err);
    process.exit(1);
});
