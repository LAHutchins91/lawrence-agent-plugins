/**
 * espresso-lab — local stdio MCP for Espresso Java/Kotlin test text
 * Zero-auth. Best-effort regex heuristics. No Android/Espresso runtime, no network.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { esMatchersList } from "./tools/es_matchers_list.js";
import { esActionsHint } from "./tools/es_actions_hint.js";
import { esIdlingHint } from "./tools/es_idling_hint.js";
import { esLintLite } from "./tools/es_lint_lite.js";
const PURE = "Pure Espresso Java/Kotlin string analysis via text heuristics. No Android/Espresso runtime, no network.";
const TOOLS = [
    {
        name: "es_matchers_list",
        description: "List Espresso ViewMatchers / Hamcrest combinators best-effort from Java/Kotlin test text. Args: { text: string }. Returns { matchers: [{name}], count }. From withId / withText / withContentDescription / isDisplayed / allOf / anyOf / ViewMatchers. etc. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Espresso Java/Kotlin test source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "es_actions_hint",
        description: "List Espresso ViewActions / onView(...).perform( signals best-effort. Args: { text }. Returns { actions: [{name}], count }. From click() / typeText / replaceText / scrollTo / swipeLeft / ViewActions. / onView(...).perform(. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Espresso Java/Kotlin test source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "es_idling_hint",
        description: "List IdlingResource-related kinds best-effort. Args: { text }. Returns { idling: [{kind: 'IdlingResource'|'CountingIdlingResource'|'registerIdlingResources'|string}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Espresso Java/Kotlin test source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "es_lint_lite",
        description: "Educational heuristic lite lint: empty, Thread.sleep antipattern tip, missing IdlingResource tip, withId overuse tip, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Espresso Java/Kotlin test source as a string (text only)",
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
const server = new Server({ name: "espresso-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "es_matchers_list":
                return textResult(esMatchersList({ text: String(args.text ?? "") }));
            case "es_actions_hint":
                return textResult(esActionsHint({ text: String(args.text ?? "") }));
            case "es_idling_hint":
                return textResult(esIdlingHint({ text: String(args.text ?? "") }));
            case "es_lint_lite":
                return textResult(esLintLite({ text: String(args.text ?? "") }));
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
    console.error("espresso-lab failed to start:", err);
    process.exit(1);
});
