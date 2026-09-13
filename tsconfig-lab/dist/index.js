/**
 * tsconfig-lab — local stdio MCP for tsconfig.json / JSONC text
 * Zero-auth. String-level only (comment-strip then JSON.parse).
 * No tsc exec, no filesystem extends follow beyond listing declared strings.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { tscCompilerOptions } from "./tools/tsc_compiler_options.js";
import { tscPathsMap } from "./tools/tsc_paths_map.js";
import { tscExtendsChain } from "./tools/tsc_extends_chain.js";
import { tscLintLite } from "./tools/tsc_lint_lite.js";
const PURE = "Pure tsconfig JSONC string analysis — strips // and block comments before parse; no tsc exec, no filesystem extends follow.";
const TOOLS = [
    {
        name: "tsc_compiler_options",
        description: "Parse tsconfig.json text and return compilerOptions object plus sorted keys. Args: { text: string }. Returns { compilerOptions: Record<string, unknown>, keys: string[] }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "tsconfig.json / JSONC contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "tsc_paths_map",
        description: "Extract compilerOptions.baseUrl and paths map (alias → string[] targets) plus sorted aliases. Args: { text }. Returns { baseUrl?, paths, aliases }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "tsconfig.json / JSONC contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "tsc_extends_chain",
        description: "Report top-level extends as declared string|string[]|null and a shallow chain of those declared refs only (does not fetch/read files). Args: { text }. Returns { extends, chain }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "tsconfig.json / JSONC contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "tsc_lint_lite",
        description: "Educational heuristic lite lint for tsconfig: strict false, skipLibCheck note, module/moduleResolution conflicts, paths without baseUrl, allowJs without checkJs, noEmit+emitDeclarationOnly, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "tsconfig.json / JSONC contents as a string (text only)",
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
const server = new Server({ name: "tsconfig-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "tsc_compiler_options":
                return textResult(tscCompilerOptions({ text: String(args.text ?? "") }));
            case "tsc_paths_map":
                return textResult(tscPathsMap({ text: String(args.text ?? "") }));
            case "tsc_extends_chain":
                return textResult(tscExtendsChain({ text: String(args.text ?? "") }));
            case "tsc_lint_lite":
                return textResult(tscLintLite({ text: String(args.text ?? "") }));
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
    console.error("tsconfig-lab failed to start:", err);
    process.exit(1);
});
