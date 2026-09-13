/**
 * skaffold-lab — local stdio MCP for skaffold.yaml text heuristics
 * Zero-auth. YAML string-level only.
 * No Skaffold CLI, cluster access, network, filesystem follow, or eval.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { skPipelinesList } from "./tools/sk_pipelines_list.js";
import { skBuildsHint } from "./tools/sk_builds_hint.js";
import { skDeploysHint } from "./tools/sk_deploys_hint.js";
import { skLintLite } from "./tools/sk_lint_lite.js";
const PURE = "Pure skaffold.yaml string analysis via yaml. No Skaffold CLI, no cluster, no network, no filesystem follow, no eval.";
const TOOLS = [
    {
        name: "sk_pipelines_list",
        description: "Parse skaffold.yaml text; list pipelines / profiles / apiVersion / kind / metadata.name. Args: { text: string }. Returns { pipelines: [{name?, apiVersion?, profiles?}], profiles: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "skaffold.yaml contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "sk_builds_hint",
        description: "Extract build artifacts (image, context, dockerfile, builder: docker/buildpacks/jib/kaniko/custom). Args: { text }. Returns { builds: [{image?, context?, dockerfile?, builder?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "skaffold.yaml contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "sk_deploys_hint",
        description: "Extract deploy config (kubectl manifests, helm releases, kustomize paths, statusCheck). Args: { text }. Returns { deploys: [{type?, paths?, releases?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "skaffold.yaml contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "sk_lint_lite",
        description: "Educational tips: empty, missing apiVersion/kind, missing build.artifacts, :latest image tags, plaintext secrets in manifests paths tip, remote git repo tip, etc. Not exploit guide. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "skaffold.yaml contents as a string (text only)",
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
const server = new Server({ name: "skaffold-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "sk_pipelines_list":
                return textResult(skPipelinesList({ text: String(args.text ?? "") }));
            case "sk_builds_hint":
                return textResult(skBuildsHint({ text: String(args.text ?? "") }));
            case "sk_deploys_hint":
                return textResult(skDeploysHint({ text: String(args.text ?? "") }));
            case "sk_lint_lite":
                return textResult(skLintLite({ text: String(args.text ?? "") }));
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
    console.error("skaffold-lab failed to start:", err);
    process.exit(1);
});
