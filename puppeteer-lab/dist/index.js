/**
 * puppeteer-lab — local stdio MCP for Puppeteer script JS/TS text
 * Zero-auth. Best-effort regex heuristics. No puppeteer/browser runtime, no network.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { pptrPagesList } from "./tools/pptr_pages_list.js";
import { pptrSelectorsHint } from "./tools/pptr_selectors_hint.js";
import { pptrWaitHint } from "./tools/pptr_wait_hint.js";
import { pptrLintLite } from "./tools/pptr_lint_lite.js";
const PURE = "Pure Puppeteer script JS/TS string analysis via text heuristics. No puppeteer/browser runtime, no network.";
const TOOLS = [
    {
        name: "pptr_pages_list",
        description: "Parse Puppeteer script JS/TS text and list page lifecycle actions best-effort. Args: { text: string }. Returns { pages: [{action: 'launch'|'newPage'|'goto'|'close'|string, url?}], count }. From puppeteer.launch / browser.newPage / page.goto / close. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Puppeteer script source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "pptr_selectors_hint",
        description: "List Puppeteer selector APIs best-effort. Args: { text }. Returns { selectors: [{api: 'click'|'type'|'$'|'$eval'|'waitForSelector'|string, selector?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Puppeteer script source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "pptr_wait_hint",
        description: "List Puppeteer wait helpers best-effort. Args: { text }. Returns { waits: [{kind: 'waitForSelector'|'waitForNavigation'|'waitForTimeout'|'waitForFunction'|string}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Puppeteer script source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "pptr_lint_lite",
        description: "Educational heuristic lite lint: empty, waitForTimeout antipattern tip, missing close/browser disconnect tip, networkidle tips, headless defaults, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Puppeteer script source as a string (text only)",
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
const server = new Server({ name: "puppeteer-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "pptr_pages_list":
                return textResult(pptrPagesList({ text: String(args.text ?? "") }));
            case "pptr_selectors_hint":
                return textResult(pptrSelectorsHint({ text: String(args.text ?? "") }));
            case "pptr_wait_hint":
                return textResult(pptrWaitHint({ text: String(args.text ?? "") }));
            case "pptr_lint_lite":
                return textResult(pptrLintLite({ text: String(args.text ?? "") }));
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
    console.error("puppeteer-lab failed to start:", err);
    process.exit(1);
});
