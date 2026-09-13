/**
 * vagrant-lab — local stdio MCP for Vagrantfile Ruby DSL text heuristics
 * Zero-auth. String/regex analysis only.
 * No vagrant CLI, VM start, network, filesystem follow, or eval.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { vagrantBoxesList } from "./tools/vagrant_boxes_list.js";
import { vagrantProvidersHint } from "./tools/vagrant_providers_hint.js";
import { vagrantProvisionsHint } from "./tools/vagrant_provisions_hint.js";
import { vagrantLintLite } from "./tools/vagrant_lint_lite.js";
const PURE = "Pure Vagrantfile Ruby DSL string analysis. No vagrant CLI, no VM start, no network, no filesystem follow, no eval.";
const TOOLS = [
    {
        name: "vagrant_boxes_list",
        description: "Extract `config.vm.box`, box_url, box_version, define VM names from Vagrantfile text. Args: { text: string }. Returns { boxes: [{name?, box?, version?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Vagrantfile Ruby DSL contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "vagrant_providers_hint",
        description: "Detect providers (virtualbox, vmware, libvirt, docker, hyperv) and provider config blocks. Args: { text }. Returns { providers: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Vagrantfile Ruby DSL contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "vagrant_provisions_hint",
        description: "Extract provisioners (shell, ansible, chef, puppet, docker, file) with type/name hints. Args: { text }. Returns { provisions: [{type?, name?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Vagrantfile Ruby DSL contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "vagrant_lint_lite",
        description: "Educational tips: empty, missing box, plaintext passwords, insecure private_network tip, synced folder `.` dangers tip. Not exploit guide. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Vagrantfile Ruby DSL contents as a string (text only)",
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
const server = new Server({ name: "vagrant-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "vagrant_boxes_list":
                return textResult(vagrantBoxesList({ text: String(args.text ?? "") }));
            case "vagrant_providers_hint":
                return textResult(vagrantProvidersHint({ text: String(args.text ?? "") }));
            case "vagrant_provisions_hint":
                return textResult(vagrantProvisionsHint({ text: String(args.text ?? "") }));
            case "vagrant_lint_lite":
                return textResult(vagrantLintLite({ text: String(args.text ?? "") }));
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
    console.error("vagrant-lab failed to start:", err);
    process.exit(1);
});
