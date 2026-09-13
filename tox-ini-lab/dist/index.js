/**
 * tox-ini-lab — local stdio MCP for tox.ini text
 * Zero-auth. Pure text heuristics.
 * No tox binary, no network, no venv.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { toxEnvlist } from "./tools/tox_envlist.js";
import { toxCommandsMap } from "./tools/tox_commands_map.js";
import { toxDepsList } from "./tools/tox_deps_list.js";
import { toxLintLite } from "./tools/tox_lint_lite.js";
const PURE = "Pure tox.ini string analysis — envlist factors, testenv commands/deps, educational lint. No tox binary, no network, no venv.";
const TOOLS = [
    {
        name: "tox_envlist",
        description: "Parse [tox] envlist= from tox.ini text; best-effort expand simple py{310,311} style factors. Args: { text: string }. Returns { envlist: string[], expanded?: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "tox.ini contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "tox_commands_map",
        description: "Map commands from [testenv] / [testenv:NAME] (commands, commands_pre, commands_post; multiline). Args: { text }. Returns { envs:[{name, commands: string[]}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "tox.ini contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "tox_deps_list",
        description: "Collect deps= packages across [testenv] / [testenv:NAME]. Args: { text }. Returns { deps:[{env?, package}], unique: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "tox.ini contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "tox_lint_lite",
        description: "Educational heuristic lite lint: empty file, missing [tox]/envlist, skip_missing_interpreters tips, usedevelop vs package, passenv secret smells, empty commands, duplicate env sections, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "tox.ini contents as a string (text only)",
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
const server = new Server({ name: "tox-ini-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "tox_envlist":
                return textResult(toxEnvlist({ text: String(args.text ?? "") }));
            case "tox_commands_map":
                return textResult(toxCommandsMap({ text: String(args.text ?? "") }));
            case "tox_deps_list":
                return textResult(toxDepsList({ text: String(args.text ?? "") }));
            case "tox_lint_lite":
                return textResult(toxLintLite({ text: String(args.text ?? "") }));
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
    console.error("tox-ini-lab failed to start:", err);
    process.exit(1);
});
