/**
 * terraform-cdk-lab — local stdio MCP for CDKTF (cdktf.json / TypeScript) text heuristics
 * Zero-auth. JSON/string/regex only.
 * No CDKTF CLI, Terraform apply, network, filesystem follow, or eval.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { cdktfStacksList } from "./tools/cdktf_stacks_list.js";
import { cdktfProvidersHint } from "./tools/cdktf_providers_hint.js";
import { cdktfResourcesHint } from "./tools/cdktf_resources_hint.js";
import { cdktfLintLite } from "./tools/cdktf_lint_lite.js";
const PURE = "Pure CDKTF JSON/string/regex analysis. No CDKTF CLI, no Terraform apply, no network, no filesystem follow, no eval.";
const TOOLS = [
    {
        name: "cdktf_stacks_list",
        description: "From cdktf.json / app text, list language, app, projectId, terraformProviders/modules hints, stack names. Args: { text: string }. Returns { stacks: [{name?, language?, app?}], language?, providers?, count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "cdktf.json / CDKTF app source as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "cdktf_providers_hint",
        description: "Detect terraformProviders in cdktf.json and `import { AwsProvider }` / `@cdktf/provider-*` / `new AwsProvider`. Args: { text }. Returns { providers: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "cdktf.json / CDKTF program contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "cdktf_resources_hint",
        description: "Heuristic resource constructors (`new S3Bucket`, `new Instance`, `TerraformResource`, HCL-ish resource blocks in synthesized paste). Args: { text }. Returns { resources: [{type?, name?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "CDKTF program or synth HCL contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "cdktf_lint_lite",
        description: "Educational tips: empty, missing language/app, hardcoded secrets/AKIA, `:latest` AMIs/tags, missing backend tip. Not exploit guide. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "cdktf.json / CDKTF app contents as a string (text only)",
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
const server = new Server({ name: "terraform-cdk-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "cdktf_stacks_list":
                return textResult(cdktfStacksList({ text: String(args.text ?? "") }));
            case "cdktf_providers_hint":
                return textResult(cdktfProvidersHint({ text: String(args.text ?? "") }));
            case "cdktf_resources_hint":
                return textResult(cdktfResourcesHint({ text: String(args.text ?? "") }));
            case "cdktf_lint_lite":
                return textResult(cdktfLintLite({ text: String(args.text ?? "") }));
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
    console.error("terraform-cdk-lab failed to start:", err);
    process.exit(1);
});
