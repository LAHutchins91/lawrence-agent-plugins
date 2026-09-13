/**
 * github-actions-lab — local stdio MCP for GitHub Actions workflow YAML text
 * Zero-auth. YAML string-level only.
 * No GitHub API, no network I/O, no filesystem reads beyond provided text.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { ghaListJobs } from "./tools/gha_list_jobs.js";
import { ghaListTriggers } from "./tools/gha_list_triggers.js";
import { ghaSecretsRefs } from "./tools/gha_secrets_refs.js";
import { ghaLintLite } from "./tools/gha_lint_lite.js";
const PURE = "Pure workflow YAML string analysis — no GitHub API, no network I/O, no filesystem reads beyond provided text, never returns secret values.";
const TOOLS = [
    {
        name: "gha_list_jobs",
        description: "Parse GitHub Actions workflow YAML text and list jobs with id/name/runs-on/stepsCount. Args: { text: string }. Returns { name?, jobs: [{id, name?, runsOn?, stepsCount?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "GitHub Actions workflow YAML contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "gha_list_triggers",
        description: "Normalize workflow `on:` (string | list | map) into event names. Args: { text }. Returns { on: unknown, events: string[] }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "GitHub Actions workflow YAML contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "gha_secrets_refs",
        description: "Find secrets.NAME / ${{ secrets.NAME }} style references in workflow YAML text — returns secret **names only**, never values. Args: { text }. Returns { secrets: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "GitHub Actions workflow YAML contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "gha_lint_lite",
        description: "Educational heuristic lite lint for workflow YAML: pull_request_target + checkout notes, missing permissions (optional), curl|bash smells, actions@master / unpinned refs, etc. Not an exploit guide. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "GitHub Actions workflow YAML contents as a string (text only)",
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
const server = new Server({ name: "github-actions-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "gha_list_jobs":
                return textResult(ghaListJobs({ text: String(args.text ?? "") }));
            case "gha_list_triggers":
                return textResult(ghaListTriggers({ text: String(args.text ?? "") }));
            case "gha_secrets_refs":
                return textResult(ghaSecretsRefs({ text: String(args.text ?? "") }));
            case "gha_lint_lite":
                return textResult(ghaLintLite({ text: String(args.text ?? "") }));
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
    console.error("github-actions-lab failed to start:", err);
    process.exit(1);
});
