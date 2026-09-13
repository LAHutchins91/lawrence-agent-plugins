/**
 * tilt-lab — local stdio MCP for Tiltfile text heuristics
 * Zero-auth. Regex/string-level only (Starlark-ish text).
 * No Tilt CLI, cluster access, network, filesystem follow, or eval.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { tiltResourcesList } from "./tools/tilt_resources_list.js";
import { tiltTriggersHint } from "./tools/tilt_triggers_hint.js";
import { tiltExtensionsHint } from "./tools/tilt_extensions_hint.js";
import { tiltLintLite } from "./tools/tilt_lint_lite.js";
const PURE = "Pure Tiltfile string/regex analysis. No Tilt CLI, no cluster, no network, no filesystem follow, no eval.";
const TOOLS = [
    {
        name: "tilt_resources_list",
        description: "From Tiltfile text, list resources: docker_build/custom_build images, k8s_yaml/k8s_resource names, local_resource names, dc_resource/docker_compose. Args: { text: string }. Returns { resources: [{kind, name?, image?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Tiltfile contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "tilt_triggers_hint",
        description: "Extract trigger/deps hints: deps=, resource_deps=, trigger_mode, auto_init, labels, links. Args: { text }. Returns { triggers: [{resource?, deps?, resourceDeps?, triggerMode?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Tiltfile contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "tilt_extensions_hint",
        description: "Detect load( / load_dynamic( / v1alpha1.extension / tilt_extensions / github.com/tilt-dev paths. Args: { text }. Returns { extensions: [{path?, symbols?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Tiltfile contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "tilt_lint_lite",
        description: "Educational tips: empty, missing docker_build/k8s_yaml, :latest tags, plaintext secret/password in Tiltfile, remote git load tip, allow_k8s_contexts tip. Not exploit guide. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Tiltfile contents as a string (text only)",
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
const server = new Server({ name: "tilt-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "tilt_resources_list":
                return textResult(tiltResourcesList({ text: String(args.text ?? "") }));
            case "tilt_triggers_hint":
                return textResult(tiltTriggersHint({ text: String(args.text ?? "") }));
            case "tilt_extensions_hint":
                return textResult(tiltExtensionsHint({ text: String(args.text ?? "") }));
            case "tilt_lint_lite":
                return textResult(tiltLintLite({ text: String(args.text ?? "") }));
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
    console.error("tilt-lab failed to start:", err);
    process.exit(1);
});
