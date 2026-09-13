/**
 * procfile-lab — local stdio MCP for Procfile text
 * Zero-auth. Pure text heuristics.
 * No network, no process spawn.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { procfileParse } from "./tools/procfile_parse.js";
import { procfileProcessList } from "./tools/procfile_process_list.js";
import { procfileEnvRefs } from "./tools/procfile_env_refs.js";
import { procfileLintLite } from "./tools/procfile_lint_lite.js";
const PURE = "Pure Procfile string analysis — name: command entries, process types, $VAR/${VAR} refs, educational lint. No network, no process spawn.";
const TOOLS = [
    {
        name: "procfile_parse",
        description: "Parse Procfile text into process entries. Skips blanks and # comments. Args: { text: string }. Returns { entries:[{name, command, line?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Procfile contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "procfile_process_list",
        description: "List process type names from Procfile text in declaration order. Args: { text }. Returns { processes: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Procfile contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "procfile_env_refs",
        description: "Best-effort collect $VAR / ${VAR} environment references from Procfile commands. Args: { text }. Returns { refs:[{name, process?, raw?}], unique: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Procfile contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "procfile_lint_lite",
        description: "Educational heuristic lite lint: empty file, missing web/worker common names (info), duplicate process names, invalid name chars, bare python without bind $PORT, missing $PORT on web-like entries, tabs, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Procfile contents as a string (text only)",
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
const server = new Server({ name: "procfile-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "procfile_parse":
                return textResult(procfileParse({ text: String(args.text ?? "") }));
            case "procfile_process_list":
                return textResult(procfileProcessList({ text: String(args.text ?? "") }));
            case "procfile_env_refs":
                return textResult(procfileEnvRefs({ text: String(args.text ?? "") }));
            case "procfile_lint_lite":
                return textResult(procfileLintLite({ text: String(args.text ?? "") }));
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
    console.error("procfile-lab failed to start:", err);
    process.exit(1);
});
