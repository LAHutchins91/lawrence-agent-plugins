/**
 * editorconfig-lab — local stdio MCP for .editorconfig text
 * Zero-auth. Pure INI-like parse + best-effort glob resolve/diff/lint.
 * No network, no disk walk beyond the pasted text.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { ecParse } from "./tools/ec_parse.js";
import { ecResolveForPath } from "./tools/ec_resolve_for_path.js";
import { ecDiffSections } from "./tools/ec_diff_sections.js";
import { ecLintLite } from "./tools/ec_lint_lite.js";
const PURE = "Pure .editorconfig string analysis — INI-like parse; best-effort EditorConfig glob rules. No network, no filesystem walk beyond the pasted text.";
const TOOLS = [
    {
        name: "ec_parse",
        description: "Parse INI-like .editorconfig text into root flag and sections. Args: { text: string }. Returns { root?, sections:[{name, glob?, properties}], sectionCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: ".editorconfig contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "ec_resolve_for_path",
        description: "Glob-match a path against .editorconfig sections (best-effort EditorConfig globs); later sections override earlier for same keys. Args: { text, path }. Returns { matched:[{section, glob?}], properties, path }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: ".editorconfig contents as a string (text only)",
                },
                path: {
                    type: "string",
                    description: "File path to resolve properties for (relative-style OK)",
                },
            },
            required: ["text", "path"],
        },
    },
    {
        name: "ec_diff_sections",
        description: "Diff section names and property values between two .editorconfig texts. Args: { textA, textB }. Returns { onlyA, onlyB, changed:[{key, a?, b?}], sectionDiffs }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                textA: {
                    type: "string",
                    description: "First .editorconfig contents",
                },
                textB: {
                    type: "string",
                    description: "Second .editorconfig contents",
                },
            },
            required: ["textA", "textB"],
        },
    },
    {
        name: "ec_lint_lite",
        description: "Educational heuristic lite lint: missing root=true, invalid indent_style/indent_size/end_of_line/charset/trim_trailing_whitespace/insert_final_newline, indent_size=tab without indent_style=tab, empty file, duplicate section globs, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: ".editorconfig contents as a string (text only)",
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
const server = new Server({ name: "editorconfig-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "ec_parse":
                return textResult(ecParse({ text: String(args.text ?? "") }));
            case "ec_resolve_for_path":
                return textResult(ecResolveForPath({
                    text: String(args.text ?? ""),
                    path: String(args.path ?? ""),
                }));
            case "ec_diff_sections":
                return textResult(ecDiffSections({
                    textA: String(args.textA ?? ""),
                    textB: String(args.textB ?? ""),
                }));
            case "ec_lint_lite":
                return textResult(ecLintLite({ text: String(args.text ?? "") }));
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
    console.error("editorconfig-lab failed to start:", err);
    process.exit(1);
});
