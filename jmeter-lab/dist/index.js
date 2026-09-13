/**
 * jmeter-lab — local stdio MCP for JMeter JMX / plan XML text
 * Zero-auth. Best-effort XML regex heuristics. No JMeter/load-test runtime, no network.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { jmxPlansList } from "./tools/jmx_plans_list.js";
import { jmxSamplersHint } from "./tools/jmx_samplers_hint.js";
import { jmxAssertionsHint } from "./tools/jmx_assertions_hint.js";
import { jmxLintLite } from "./tools/jmx_lint_lite.js";
const PURE = "Pure JMeter JMX / plan XML string analysis via text heuristics. No JMeter/load-test runtime, no network.";
const TOOLS = [
    {
        name: "jmx_plans_list",
        description: "List JMeter TestPlan and ThreadGroup elements best-effort from JMX / plan XML text. Args: { text: string }. Returns { testPlans: [{name?}], threadGroups: [{name?, numThreads?, rampTime?}], count }. From TestPlan / ThreadGroup elements (guiclass/testclass attributes). " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "JMeter JMX / plan XML as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "jmx_samplers_hint",
        description: "List JMeter samplers best-effort. Args: { text }. Returns { samplers: [{type: 'HTTPSamplerProxy'|'JavaSampler'|string, name?, path?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "JMeter JMX / plan XML as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "jmx_assertions_hint",
        description: "List JMeter assertions best-effort. Args: { text }. Returns { assertions: [{type: 'ResponseAssertion'|'DurationAssertion'|'JSONPathAssertion'|string, name?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "JMeter JMX / plan XML as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "jmx_lint_lite",
        description: "Educational heuristic lite lint: empty, missing ThreadGroup tip, no assertions tip, hardcoded credentials tip, infinite loop tip, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "JMeter JMX / plan XML as a string (text only)",
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
const server = new Server({ name: "jmeter-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "jmx_plans_list":
                return textResult(jmxPlansList({ text: String(args.text ?? "") }));
            case "jmx_samplers_hint":
                return textResult(jmxSamplersHint({ text: String(args.text ?? "") }));
            case "jmx_assertions_hint":
                return textResult(jmxAssertionsHint({ text: String(args.text ?? "") }));
            case "jmx_lint_lite":
                return textResult(jmxLintLite({ text: String(args.text ?? "") }));
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
    console.error("jmeter-lab failed to start:", err);
    process.exit(1);
});
