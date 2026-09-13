/**
 * wrk-lab — local stdio MCP for wrk / wrk2 Lua script + CLI text
 * Zero-auth. Best-effort regex heuristics. No wrk runtime, no network.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { wrkScriptsList } from "./tools/wrk_scripts_list.js";
import { wrkLuaHint } from "./tools/wrk_lua_hint.js";
import { wrkOptionsHint } from "./tools/wrk_options_hint.js";
import { wrkLintLite } from "./tools/wrk_lint_lite.js";
const PURE = "Pure wrk/wrk2 Lua + CLI string analysis via text heuristics. No wrk runtime, no network.";
const TOOLS = [
    {
        name: "wrk_scripts_list",
        description: "List wrk Lua script hooks best-effort from function definitions. Args: { text: string }. Returns { hooks: [{name: 'setup'|'init'|'request'|'response'|'done'|string}], count }. From function setup/init/request/response/done. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "wrk/wrk2 Lua script (and optional CLI) text as a string",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "wrk_lua_hint",
        description: "List wrk.* API uses best-effort. Args: { text }. Returns { wrkUses: [{api: 'wrk.method'|'wrk.headers'|'wrk.body'|'wrk.format'|string}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "wrk/wrk2 Lua script text as a string",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "wrk_options_hint",
        description: "List wrk/wrk2 CLI options best-effort from shell/CLI lines. Args: { text }. Returns { options: [{flag: '-c'|'-d'|'-t'|'-R'|'-s'|string, value?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Shell/CLI text invoking wrk or wrk2",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "wrk_lint_lite",
        description: "Educational heuristic lite lint: empty, missing -c/-t tip, unbounded duration tip, no script tip, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "wrk/wrk2 Lua script and/or CLI text as a string",
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
const server = new Server({ name: "wrk-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "wrk_scripts_list":
                return textResult(wrkScriptsList({ text: String(args.text ?? "") }));
            case "wrk_lua_hint":
                return textResult(wrkLuaHint({ text: String(args.text ?? "") }));
            case "wrk_options_hint":
                return textResult(wrkOptionsHint({ text: String(args.text ?? "") }));
            case "wrk_lint_lite":
                return textResult(wrkLintLite({ text: String(args.text ?? "") }));
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
    console.error("wrk-lab failed to start:", err);
    process.exit(1);
});
