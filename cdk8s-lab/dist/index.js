/**
 * cdk8s-lab — local stdio MCP for cdk8s app/chart text heuristics
 * Zero-auth. YAML/string/regex only.
 * No cdk8s CLI, cluster, network, filesystem follow, or eval.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { cdk8sChartsList } from "./tools/cdk8s_charts_list.js";
import { cdk8sImportsHint } from "./tools/cdk8s_imports_hint.js";
import { cdk8sResourcesHint } from "./tools/cdk8s_resources_hint.js";
import { cdk8sLintLite } from "./tools/cdk8s_lint_lite.js";
const PURE = "Pure cdk8s YAML/string/regex analysis. No cdk8s CLI, no cluster, no network, no filesystem follow, no eval.";
const TOOLS = [
    {
        name: "cdk8s_charts_list",
        description: "From cdk8s app text / cdk8s.yaml / Chart.yaml-ish, list charts/apps (name, apiVersion, language/runtime hints). Args: { text: string }. Returns { charts: [{name?, apiVersion?, language?, runtime?, app?, description?, version?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "cdk8s.yaml / Chart.yaml / app source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "cdk8s_imports_hint",
        description: "Detect imports: cdk8s, cdk8s-plus-*, imports/k8s, CRD imports, ApiObject. Args: { text }. Returns { imports: [{kind, module?, detail?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "cdk8s program / cdk8s.yaml contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "cdk8s_resources_hint",
        description: "Heuristic resource constructors (new kplus.Deployment, new k8s.KubeService, ApiObject, kind/apiVersion in synth YAML paste). Args: { text }. Returns { resources: [{type?, name?, kind?, apiVersion?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "cdk8s program or synth YAML contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "cdk8s_lint_lite",
        description: "Educational tips: empty, missing cdk8s import, :latest images, privileged/hostNetwork, plaintext secrets in constructs. Not exploit guide. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "cdk8s app / yaml contents as a string (text only)",
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
const server = new Server({ name: "cdk8s-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "cdk8s_charts_list":
                return textResult(cdk8sChartsList({ text: String(args.text ?? "") }));
            case "cdk8s_imports_hint":
                return textResult(cdk8sImportsHint({ text: String(args.text ?? "") }));
            case "cdk8s_resources_hint":
                return textResult(cdk8sResourcesHint({ text: String(args.text ?? "") }));
            case "cdk8s_lint_lite":
                return textResult(cdk8sLintLite({ text: String(args.text ?? "") }));
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
    console.error("cdk8s-lab failed to start:", err);
    process.exit(1);
});
