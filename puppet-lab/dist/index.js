/**
 * puppet-lab — local stdio MCP for Puppet manifest/module text heuristics
 * Zero-auth. Manifest string analysis only.
 * No Puppet CLI, agent/apply, network, filesystem follow, or eval.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { puppetClassesList } from "./tools/puppet_classes_list.js";
import { puppetModulesHint } from "./tools/puppet_modules_hint.js";
import { puppetParamsHint } from "./tools/puppet_params_hint.js";
import { puppetLintLite } from "./tools/puppet_lint_lite.js";
const PURE = "Pure Puppet manifest/module string analysis. No Puppet CLI, no agent/apply, no network, no filesystem follow, no eval.";
const TOOLS = [
    {
        name: "puppet_classes_list",
        description: "Parse Puppet manifest text for `class` / `define` names. Args: { text: string }. Returns { classes: [{name, kind?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Puppet manifest contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "puppet_modules_hint",
        description: "Detect module refs: include/require/contain, class { 'foo': }, metadata.json name/dependencies, Puppetfile mod. Args: { text }. Returns { modules: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Puppet manifest / Puppetfile / metadata.json contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "puppet_params_hint",
        description: "Extract class/define parameters and $facts/$trusted usage; flag password/secret/token param *names*. Args: { text }. Returns { params: string[], secretKeyNames?: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Puppet class/define manifest contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "puppet_lint_lite",
        description: "Educational tips: empty, missing class, plaintext passwords, exec without unless/creates, latest package ensure tip. Not exploit guide. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Puppet manifest/module text as a string (text only)",
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
const server = new Server({ name: "puppet-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "puppet_classes_list":
                return textResult(puppetClassesList({ text: String(args.text ?? "") }));
            case "puppet_modules_hint":
                return textResult(puppetModulesHint({ text: String(args.text ?? "") }));
            case "puppet_params_hint":
                return textResult(puppetParamsHint({ text: String(args.text ?? "") }));
            case "puppet_lint_lite":
                return textResult(puppetLintLite({ text: String(args.text ?? "") }));
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
    console.error("puppet-lab failed to start:", err);
    process.exit(1);
});
