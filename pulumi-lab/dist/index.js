/**
 * pulumi-lab — local stdio MCP for Pulumi.yaml / program text heuristics
 * Zero-auth. YAML/string/regex only.
 * No Pulumi CLI, cloud, network, filesystem follow, or eval.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { pulumiStacksList } from "./tools/pulumi_stacks_list.js";
import { pulumiResourcesHint } from "./tools/pulumi_resources_hint.js";
import { pulumiConfigHint } from "./tools/pulumi_config_hint.js";
import { pulumiLintLite } from "./tools/pulumi_lint_lite.js";
const PURE = "Pure Pulumi YAML/string/regex analysis. No Pulumi CLI, no cloud, no network, no filesystem follow, no eval.";
const TOOLS = [
    {
        name: "pulumi_stacks_list",
        description: "From Pulumi.yaml / project text, list name, runtime, description, main, stacks/backends hints. Args: { text: string }. Returns { stacks: [{name?, runtime?, description?, main?, backend?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Pulumi.yaml / project contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "pulumi_resources_hint",
        description: "Heuristic scan of Pulumi program text (ts/py/go/yaml-ish): resource constructors (new aws., new azure., pulumi.CustomResource, YAML type: resources), component resources. Args: { text }. Returns { resources: [{type?, name?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Pulumi program contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "pulumi_config_hint",
        description: "Extract config: keys from Pulumi.yaml, pulumi.Config / config.require / config.get / secret config key names (names only). Args: { text }. Returns { configKeys: string[], secretKeys?: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Pulumi.yaml / stack config / program text (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "pulumi_lint_lite",
        description: "Educational tips: empty, missing name/runtime, plaintext secret in config, :latest image tags in program, hardcoded AKIA/api keys tip, missing backend tip. Not exploit guide. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Pulumi.yaml or program contents as a string (text only)",
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
const server = new Server({ name: "pulumi-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "pulumi_stacks_list":
                return textResult(pulumiStacksList({ text: String(args.text ?? "") }));
            case "pulumi_resources_hint":
                return textResult(pulumiResourcesHint({ text: String(args.text ?? "") }));
            case "pulumi_config_hint":
                return textResult(pulumiConfigHint({ text: String(args.text ?? "") }));
            case "pulumi_lint_lite":
                return textResult(pulumiLintLite({ text: String(args.text ?? "") }));
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
    console.error("pulumi-lab failed to start:", err);
    process.exit(1);
});
