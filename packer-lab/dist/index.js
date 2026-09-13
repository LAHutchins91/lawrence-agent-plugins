/**
 * packer-lab — local stdio MCP for Packer HCL/JSON text heuristics
 * Zero-auth. String/regex analysis only.
 * No packer CLI, build/deploy, network, filesystem follow, or eval.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { packerBuildsList } from "./tools/packer_builds_list.js";
import { packerSourcesHint } from "./tools/packer_sources_hint.js";
import { packerProvisionersHint } from "./tools/packer_provisioners_hint.js";
import { packerLintLite } from "./tools/packer_lint_lite.js";
const PURE = "Pure Packer HCL/JSON string analysis. No packer CLI, no build/deploy, no network, no filesystem follow, no eval.";
const TOOLS = [
    {
        name: "packer_builds_list",
        description: "Parse Packer HCL/JSON; list `build` / `source` blocks with names/types (amazon-ebs, docker, etc.). Args: { text: string }. Returns { builds: [{name?, type?, sources?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Packer HCL or JSON template contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "packer_sources_hint",
        description: "Extract `source` blocks (type, name, ami_name, image, iso_url hints). Args: { text }. Returns { sources: [{type?, name?, labels?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Packer HCL or JSON template contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "packer_provisioners_hint",
        description: "Extract provisioners (shell, ansible, file, powershell, etc.) and post-processors. Args: { text }. Returns { provisioners: [{type?, only?}], postProcessors?: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Packer HCL or JSON template contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "packer_lint_lite",
        description: "Educational tips: empty, missing source/build, plaintext secrets/password, insecure communicator tip, `:latest` tags. Not exploit guide. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Packer HCL or JSON template contents as a string (text only)",
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
const server = new Server({ name: "packer-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "packer_builds_list":
                return textResult(packerBuildsList({ text: String(args.text ?? "") }));
            case "packer_sources_hint":
                return textResult(packerSourcesHint({ text: String(args.text ?? "") }));
            case "packer_provisioners_hint":
                return textResult(packerProvisionersHint({ text: String(args.text ?? "") }));
            case "packer_lint_lite":
                return textResult(packerLintLite({ text: String(args.text ?? "") }));
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
    console.error("packer-lab failed to start:", err);
    process.exit(1);
});
