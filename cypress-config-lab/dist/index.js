/**
 * cypress-config-lab — local stdio MCP for Cypress config text
 * Zero-auth. Prefer JSONC; JS/TS via defineConfig + best-effort heuristics (no eval).
 * No cypress binary, no network, no filesystem follow.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { cyE2eSummary } from "./tools/cy_e2e_summary.js";
import { cyComponentSummary } from "./tools/cy_component_summary.js";
import { cyEnvKeys } from "./tools/cy_env_keys.js";
import { cyLintLite } from "./tools/cy_lint_lite.js";
const PURE = "Pure Cypress config string analysis — prefer JSONC (comment-strip then JSON.parse); cypress.config.js/ts uses defineConfig unwrap + best-effort regex heuristics (no eval). No cypress binary, no network.";
const TOOLS = [
    {
        name: "cy_e2e_summary",
        description: "Parse Cypress config text and extract the e2e block (baseUrl, specPattern, supportFile, excludeSpecPattern, viewport*, timeouts, video, …). Handles JSON/JSONC and defineConfig / JS/TS heuristic extract. Args: { text: string }. Returns { e2e?: Record, keys: string[] }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Cypress config contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "cy_component_summary",
        description: "Extract the component testing block (devServer, specPattern, supportFile, …) from Cypress config text. Args: { text }. Returns { component?: Record, keys: string[] }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Cypress config contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "cy_env_keys",
        description: "Extract env map from top-level env plus nested e2e.env / component.env. Args: { text }. Returns { env: Record, keys: string[], count }. Obvious secret-looking values are redacted to [REDACTED]; keys are always listed. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Cypress config contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "cy_lint_lite",
        description: "Educational heuristic lite lint: empty config, missing e2e+component, chromeWebSecurity false tip, video/screenshot defaults, hardcoded secrets in env, deprecated keys (integrationFolder, testFiles, pluginsFile, …), JS/TS heuristic limits. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Cypress config contents as a string (text only)",
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
const server = new Server({ name: "cypress-config-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "cy_e2e_summary":
                return textResult(cyE2eSummary({ text: String(args.text ?? "") }));
            case "cy_component_summary":
                return textResult(cyComponentSummary({ text: String(args.text ?? "") }));
            case "cy_env_keys":
                return textResult(cyEnvKeys({ text: String(args.text ?? "") }));
            case "cy_lint_lite":
                return textResult(cyLintLite({ text: String(args.text ?? "") }));
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
    console.error("cypress-config-lab failed to start:", err);
    process.exit(1);
});
