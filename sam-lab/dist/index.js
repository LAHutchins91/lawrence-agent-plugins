/**
 * sam-lab — local stdio MCP for AWS SAM template.yaml text heuristics
 * Zero-auth. YAML string analysis only.
 * No SAM CLI, AWS deploy, network, filesystem follow, or eval.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { samFunctionsList } from "./tools/sam_functions_list.js";
import { samEventsHint } from "./tools/sam_events_hint.js";
import { samGlobalsHint } from "./tools/sam_globals_hint.js";
import { samLintLite } from "./tools/sam_lint_lite.js";
const PURE = "Pure AWS SAM / CloudFormation YAML string analysis. No SAM CLI, no AWS deploy, no network, no filesystem follow, no eval.";
const TOOLS = [
    {
        name: "sam_functions_list",
        description: "Parse SAM/CloudFormation YAML; list AWS::Serverless::Function / AWS::Lambda::Function logical IDs, Runtime, Handler, Timeout, MemorySize. Args: { text: string }. Returns { functions: [{id?, runtime?, handler?, timeout?, memory?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "SAM / CloudFormation template.yaml contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "sam_events_hint",
        description: "Extract Events on functions (Api, HttpApi, S3, SNS, SQS, Schedule, DynamoDB, etc.). Args: { text }. Returns { events: [{function?, type?, properties?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "SAM template.yaml contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "sam_globals_hint",
        description: "Extract Globals (Function/Api/HttpApi), Transform, Description, Parameters keys. Args: { text }. Returns { globals?: object, transform?, parameters?: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "SAM template.yaml contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "sam_lint_lite",
        description: "Educational tips: empty, missing Transform AWS::Serverless-2016-10-31, :latest image, plaintext secrets in env, public Access policies tip, missing Runtime. Not exploit guide. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "SAM / CloudFormation template contents as a string (text only)",
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
const server = new Server({ name: "sam-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "sam_functions_list":
                return textResult(samFunctionsList({ text: String(args.text ?? "") }));
            case "sam_events_hint":
                return textResult(samEventsHint({ text: String(args.text ?? "") }));
            case "sam_globals_hint":
                return textResult(samGlobalsHint({ text: String(args.text ?? "") }));
            case "sam_lint_lite":
                return textResult(samLintLite({ text: String(args.text ?? "") }));
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
    console.error("sam-lab failed to start:", err);
    process.exit(1);
});
