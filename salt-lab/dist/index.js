/**
 * salt-lab — local stdio MCP for Salt state/pillar YAML text heuristics
 * Zero-auth. YAML/string analysis only.
 * No salt CLI, minion/master, network, filesystem follow, or eval.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { saltStatesList } from "./tools/salt_states_list.js";
import { saltPillarsHint } from "./tools/salt_pillars_hint.js";
import { saltGrainsHint } from "./tools/salt_grains_hint.js";
import { saltLintLite } from "./tools/salt_lint_lite.js";
const PURE = "Pure Salt state/pillar YAML string analysis. No salt CLI, no minion/master, no network, no filesystem follow, no eval.";
const TOOLS = [
    {
        name: "salt_states_list",
        description: "Parse SLS/state YAML; list state IDs and modules (`pkg.installed`, `service.running`, `file.managed`, etc.). Args: { text: string }. Returns { states: [{id?, module?, fun?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Salt SLS/state YAML contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "salt_pillars_hint",
        description: "Extract pillar keys from pillar YAML / `{% pillar %}` / `pillar.get`; flag password/secret/token key *names*. Args: { text }. Returns { pillars: string[], secretKeyNames?, count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Salt pillar YAML / SLS Jinja contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "salt_grains_hint",
        description: "Detect grain refs (`grains[...]`, `grains.get`, `salt['grains.get']`, jinja grains). Args: { text }. Returns { grains: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Salt SLS/Jinja contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "salt_lint_lite",
        description: "Educational tips: empty, missing state module, plaintext passwords, cmd.run without unless/creates, latest pkg tip. Not exploit guide. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Salt SLS/pillar YAML contents as a string (text only)",
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
const server = new Server({ name: "salt-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "salt_states_list":
                return textResult(saltStatesList({ text: String(args.text ?? "") }));
            case "salt_pillars_hint":
                return textResult(saltPillarsHint({ text: String(args.text ?? "") }));
            case "salt_grains_hint":
                return textResult(saltGrainsHint({ text: String(args.text ?? "") }));
            case "salt_lint_lite":
                return textResult(saltLintLite({ text: String(args.text ?? "") }));
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
    console.error("salt-lab failed to start:", err);
    process.exit(1);
});
