/**
 * makefile-lab — local stdio MCP for Makefile text
 * Zero-auth. Pure text heuristics.
 * No make binary, no network, no shell execution.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { makeTargetsList } from "./tools/make_targets_list.js";
import { makePhonyList } from "./tools/make_phony_list.js";
import { makeVarLookup } from "./tools/make_var_lookup.js";
import { makeLintLite } from "./tools/make_lint_lite.js";
const PURE = "Pure Makefile string analysis — explicit rules, .PHONY, simple VAR assignments, educational lint. No make binary, no network, no shell.";
const TOOLS = [
    {
        name: "make_targets_list",
        description: "List explicit rule targets from Makefile text (skip pattern rules like %.o). .PHONY declaration lines are not targets unless the name also has a rule. Args: { text: string }. Returns { targets:[{name, deps?, line?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Makefile contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "make_phony_list",
        description: "Collect names from .PHONY: declarations in Makefile text. Args: { text }. Returns { phony: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Makefile contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "make_var_lookup",
        description: "List simple VAR = / := / ?= / += assignments; optional name filters to that variable. Args: { text, name? }. Returns { vars:[{name, value?, flavor?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Makefile contents as a string (text only)",
                },
                name: {
                    type: "string",
                    description: "Optional variable name to filter (exact, case-sensitive)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "make_lint_lite",
        description: "Educational heuristic lite lint: tabs vs spaces in recipe lines, missing .PHONY for common targets (all/clean/test/install), recursive make smells, empty file, undefined-looking $(VAR) refs without assignment (best-effort), duplicate targets, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Makefile contents as a string (text only)",
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
const server = new Server({ name: "makefile-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "make_targets_list":
                return textResult(makeTargetsList({ text: String(args.text ?? "") }));
            case "make_phony_list":
                return textResult(makePhonyList({ text: String(args.text ?? "") }));
            case "make_var_lookup":
                return textResult(makeVarLookup({
                    text: String(args.text ?? ""),
                    name: args.name === undefined ? undefined : String(args.name),
                }));
            case "make_lint_lite":
                return textResult(makeLintLite({ text: String(args.text ?? "") }));
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
    console.error("makefile-lab failed to start:", err);
    process.exit(1);
});
