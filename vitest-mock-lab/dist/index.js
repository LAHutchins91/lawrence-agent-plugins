/**
 * vitest-mock-lab — local stdio MCP for Vitest vi.mock JS/TS text
 * Zero-auth. Best-effort regex heuristics. No vitest runtime, no network.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { vmMocksList } from "./tools/vm_mocks_list.js";
import { vmSpiesHint } from "./tools/vm_spies_hint.js";
import { vmHoistHint } from "./tools/vm_hoist_hint.js";
import { vmLintLite } from "./tools/vm_lint_lite.js";
const PURE = "Pure Vitest vi.mock JS/TS string analysis via text heuristics. No vitest runtime, no network.";
const TOOLS = [
    {
        name: "vm_mocks_list",
        description: "Parse Vitest/jest-compat mock JS/TS text and list mocks best-effort. Args: { text: string }. Returns { mocks: [{module?, factory?}], count }. From vi.mock( / jest.mock(. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Vitest mock/spy source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "vm_spies_hint",
        description: "List Vitest spies / mock fns best-effort. Args: { text }. Returns { spies: [{target?, method?}], count }. From vi.spyOn( / vi.fn(. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Vitest mock/spy source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "vm_hoist_hint",
        description: "List Vitest hoist / doMock / unmock / resetModules best-effort. Args: { text }. Returns { hoisted: [{kind: 'hoisted'|'doMock'|'unmock'|string}], count }. From vi.hoisted( / vi.doMock / vi.unmock / vi.resetModules. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Vitest mock/spy source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "vm_lint_lite",
        description: "Educational heuristic lite lint: empty, mock without clearAllMocks tip, spy without mockRestore, import order vs hoist tip, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Vitest mock/spy source as a string (text only)",
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
const server = new Server({ name: "vitest-mock-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "vm_mocks_list":
                return textResult(vmMocksList({ text: String(args.text ?? "") }));
            case "vm_spies_hint":
                return textResult(vmSpiesHint({ text: String(args.text ?? "") }));
            case "vm_hoist_hint":
                return textResult(vmHoistHint({ text: String(args.text ?? "") }));
            case "vm_lint_lite":
                return textResult(vmLintLite({ text: String(args.text ?? "") }));
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
    console.error("vitest-mock-lab failed to start:", err);
    process.exit(1);
});
