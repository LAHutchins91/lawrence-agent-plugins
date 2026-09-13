/**
 * nomad-lab — local stdio MCP for Nomad job HCL text heuristics
 * Zero-auth. String/regex analysis only.
 * No nomad CLI, cluster, network, filesystem follow, or eval.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { nomadJobsList } from "./tools/nomad_jobs_list.js";
import { nomadGroupsHint } from "./tools/nomad_groups_hint.js";
import { nomadTasksHint } from "./tools/nomad_tasks_hint.js";
import { nomadLintLite } from "./tools/nomad_lint_lite.js";
const PURE = "Pure Nomad job HCL string analysis. No nomad CLI, no cluster, no network, no filesystem follow, no eval.";
const TOOLS = [
    {
        name: "nomad_jobs_list",
        description: "Parse Nomad job HCL; list job id/name, type (service/batch/system), datacenters, namespace. Args: { text: string }. Returns { jobs: [{id?, type?, datacenters?, namespace?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Nomad job HCL contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "nomad_groups_hint",
        description: "Extract group blocks (name, count, network ports). Args: { text }. Returns { groups: [{name?, count?, networks?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Nomad job HCL contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "nomad_tasks_hint",
        description: "Extract task blocks (name, driver docker/exec/java, image/config hints, env key names; flag secret/password/token env *names*). Args: { text }. Returns { tasks: [{name?, driver?, image?}], secretKeyNames?: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Nomad job HCL contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "nomad_lint_lite",
        description: "Educational tips: empty, missing job/task, `:latest` images, privileged/host network tip, plaintext secrets. Not exploit guide. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Nomad job HCL contents as a string (text only)",
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
const server = new Server({ name: "nomad-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "nomad_jobs_list":
                return textResult(nomadJobsList({ text: String(args.text ?? "") }));
            case "nomad_groups_hint":
                return textResult(nomadGroupsHint({ text: String(args.text ?? "") }));
            case "nomad_tasks_hint":
                return textResult(nomadTasksHint({ text: String(args.text ?? "") }));
            case "nomad_lint_lite":
                return textResult(nomadLintLite({ text: String(args.text ?? "") }));
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
    console.error("nomad-lab failed to start:", err);
    process.exit(1);
});
