/**
 * astro-config-lab — local stdio MCP for astro.config text
 * Zero-auth. defineConfig / export default best-effort heuristics (no eval).
 * No astro binary, no network, no filesystem follow.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { astroIntegrationsList } from "./tools/astro_integrations_list.js";
import { astroOutputMode } from "./tools/astro_output_mode.js";
import { astroViteHint } from "./tools/astro_vite_hint.js";
import { astroLintLite } from "./tools/astro_lint_lite.js";
const PURE = "Pure astro.config string analysis — defineConfig / export default best-effort regex heuristics (no eval). Prefer JSONC when available. No astro binary, no network.";
const TOOLS = [
    {
        name: "astro_integrations_list",
        description: "Parse astro.config text and extract integration names from integrations: [...] (strings, call expressions like react()/mdx(), require heuristics). Handles defineConfig / export default best-effort. Args: { text: string }. Returns { integrations: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "astro.config contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "astro_output_mode",
        description: "Extract output / adapter / site / base / trailingSlash fields from astro.config text. Args: { text }. Returns { output?, adapter?, site?, base?, trailingSlash? }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "astro.config contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "astro_vite_hint",
        description: "Summarize nested vite: { … } block — plugin call names, server/build objects, and top-level vite keys. Args: { text }. Returns { vite?: { plugins?, server?, build?, keys: string[] } }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "astro.config contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "astro_lint_lite",
        description: "Educational heuristic lite lint: empty config, output server/hybrid without adapter, missing site for sitemap, experimental flags, trailingSlash/output values, JS/TS no-eval limits. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "astro.config contents as a string (text only)",
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
const server = new Server({ name: "astro-config-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "astro_integrations_list":
                return textResult(astroIntegrationsList({ text: String(args.text ?? "") }));
            case "astro_output_mode":
                return textResult(astroOutputMode({ text: String(args.text ?? "") }));
            case "astro_vite_hint":
                return textResult(astroViteHint({ text: String(args.text ?? "") }));
            case "astro_lint_lite":
                return textResult(astroLintLite({ text: String(args.text ?? "") }));
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
    console.error("astro-config-lab failed to start:", err);
    process.exit(1);
});
