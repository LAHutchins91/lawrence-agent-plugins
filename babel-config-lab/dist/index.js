/**
 * babel-config-lab — local stdio MCP for babel config text
 * Zero-auth. Prefer JSONC; JS/TS via best-effort heuristics (no eval).
 * No babel binary, no network, no filesystem follow.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { babelPresetsList } from "./tools/babel_presets_list.js";
import { babelPluginsList } from "./tools/babel_plugins_list.js";
import { babelEnvTargets } from "./tools/babel_env_targets.js";
import { babelLintLite } from "./tools/babel_lint_lite.js";
const PURE = "Pure babel config string analysis — prefer JSONC (comment-strip then JSON.parse); babel.config.js / .babelrc.js / .mjs uses best-effort regex heuristics (no eval). No babel binary, no network.";
const TOOLS = [
    {
        name: "babel_presets_list",
        description: "Parse babel config text and extract presets (string or [name, options] entries) plus flattened names. Handles .babelrc / babel.config.json JSONC and JS module.exports / export default heuristics; unwraps package.json \"babel\" key. Args: { text: string }. Returns { presets: (string|object)[], names: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "babel config contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "babel_plugins_list",
        description: "List babel plugins from plugins: [...] (strings, tuples, require/call heuristics). Args: { text }. Returns { plugins: (string|object)[], names: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "babel config contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "babel_env_targets",
        description: "Extract top-level targets / browserslist, @babel/preset-env options targets, and env: { ... } blocks. Args: { text }. Returns { targets?, browserslist?, env?, envKeys: string[] }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "babel config contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "babel_lint_lite",
        description: "Educational heuristic lite lint: empty config, missing presets, duplicate plugins, stage-0 legacy, modules:false tips, package.json babel unwrap, missing targets, legacy es201x presets, JS no-eval limits. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "babel config contents as a string (text only)",
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
const server = new Server({ name: "babel-config-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "babel_presets_list":
                return textResult(babelPresetsList({ text: String(args.text ?? "") }));
            case "babel_plugins_list":
                return textResult(babelPluginsList({ text: String(args.text ?? "") }));
            case "babel_env_targets":
                return textResult(babelEnvTargets({ text: String(args.text ?? "") }));
            case "babel_lint_lite":
                return textResult(babelLintLite({ text: String(args.text ?? "") }));
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
    console.error("babel-config-lab failed to start:", err);
    process.exit(1);
});
