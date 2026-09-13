/**
 * webdriverio-lab — local stdio MCP for WebdriverIO JS/TS text
 * Zero-auth. Best-effort regex heuristics. No wdio/browser/WebDriver runtime, no network.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { wdioSpecsList } from "./tools/wdio_specs_list.js";
import { wdioSelectorsHint } from "./tools/wdio_selectors_hint.js";
import { wdioCommandsHint } from "./tools/wdio_commands_hint.js";
import { wdioLintLite } from "./tools/wdio_lint_lite.js";
const PURE = "Pure WebdriverIO JS/TS string analysis via text heuristics. No wdio/browser/WebDriver runtime, no network.";
const TOOLS = [
    {
        name: "wdio_specs_list",
        description: "Parse WebdriverIO JS/TS text and list Mocha-style specs/hooks best-effort, or config specs: array entries. Args: { text: string }. Returns { specs: [{kind: 'describe'|'it'|'before'|'after'|string, title?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "WebdriverIO / Mocha spec or wdio config source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "wdio_selectors_hint",
        description: "List WebdriverIO selector APIs best-effort. Args: { text }. Returns { selectors: [{api: '$'|'$$'|'custom$'|string, selector?}], count }. From $('...') / $$( / browser.$ / custom$. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "WebdriverIO script/spec source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "wdio_commands_hint",
        description: "List common browser./element. WebdriverIO command APIs best-effort. Args: { text }. Returns { commands: [{name}], count }. From url, click, setValue, getText, waitUntil, pause, etc. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "WebdriverIO script/spec source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "wdio_lint_lite",
        description: "Educational heuristic lite lint: empty, browser.pause antipattern tip, xpath overuse tip, missing waitUntil tip, sync mode deprecated tip, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "WebdriverIO script/spec/config source as a string (text only)",
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
const server = new Server({ name: "webdriverio-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "wdio_specs_list":
                return textResult(wdioSpecsList({ text: String(args.text ?? "") }));
            case "wdio_selectors_hint":
                return textResult(wdioSelectorsHint({ text: String(args.text ?? "") }));
            case "wdio_commands_hint":
                return textResult(wdioCommandsHint({ text: String(args.text ?? "") }));
            case "wdio_lint_lite":
                return textResult(wdioLintLite({ text: String(args.text ?? "") }));
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
    console.error("webdriverio-lab failed to start:", err);
    process.exit(1);
});
