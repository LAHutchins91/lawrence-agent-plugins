/**
 * package-json-lab — local stdio MCP for package.json text
 * Zero-auth. JSON string-level only.
 * No npm install, no network I/O, no filesystem reads beyond provided text.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { pkgScriptsList } from "./tools/pkg_scripts_list.js";
import { pkgDepsDiff } from "./tools/pkg_deps_diff.js";
import { pkgEnginesCheck } from "./tools/pkg_engines_check.js";
import { pkgLintLite } from "./tools/pkg_lint_lite.js";
const PURE = "Pure package.json string analysis — no npm install, no network I/O, no filesystem reads beyond provided text.";
const TOOLS = [
    {
        name: "pkg_scripts_list",
        description: "Parse package.json text and list scripts with name/command. Args: { text: string }. Returns { name?, scripts: [{name, command}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "package.json contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "pkg_deps_diff",
        description: "Bucket package name keys from dependencies / devDependencies / peerDependencies / optionalDependencies and compute onlyInDeps, onlyInDev, overlap. Args: { text }. Returns key arrays (names only). " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "package.json contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "pkg_engines_check",
        description: "Read engines from package.json text; if nodeVersion provided, check against engines.node using simple semver ranges (or note if complex). Args: { text, nodeVersion? }. Returns { engines?, satisfies?, notes }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "package.json contents as a string (text only)",
                },
                nodeVersion: {
                    type: "string",
                    description: "Optional Node.js version to check against engines.node (e.g. 20.11.0)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "pkg_lint_lite",
        description: "Educational heuristic lite lint for package.json: missing name/version, private+publishConfig smells, * ranges, file: deps notes, scripts with curl|bash, deps/devDeps overlap, etc. Not an exploit guide. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "package.json contents as a string (text only)",
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
const server = new Server({ name: "package-json-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "pkg_scripts_list":
                return textResult(pkgScriptsList({ text: String(args.text ?? "") }));
            case "pkg_deps_diff":
                return textResult(pkgDepsDiff({ text: String(args.text ?? "") }));
            case "pkg_engines_check":
                return textResult(pkgEnginesCheck({
                    text: String(args.text ?? ""),
                    nodeVersion: args.nodeVersion !== undefined && args.nodeVersion !== null
                        ? String(args.nodeVersion)
                        : undefined,
                }));
            case "pkg_lint_lite":
                return textResult(pkgLintLite({ text: String(args.text ?? "") }));
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
    console.error("package-json-lab failed to start:", err);
    process.exit(1);
});
