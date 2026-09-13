/**
 * eslint-config-lab — local stdio MCP for ESLint config text
 * Zero-auth. Prefer JSONC; YAML via yaml; JS via best-effort heuristics.
 * No eslint binary, no network, no filesystem config follow.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { eslintExtendsList } from "./tools/eslint_extends_list.js";
import { eslintRulesSummary } from "./tools/eslint_rules_summary.js";
import { eslintEnvParser } from "./tools/eslint_env_parser.js";
import { eslintLintLite } from "./tools/eslint_lint_lite.js";
const PURE = "Pure ESLint config string analysis — prefer JSONC (comment-strip then JSON.parse); YAML via yaml package; .eslintrc.js / eslint.config.js use best-effort regex heuristics (no eval). No eslint binary, no network.";
const TOOLS = [
    {
        name: "eslint_extends_list",
        description: "Parse ESLint config text and return extends as string[] plus count. Handles JSON/JSONC .eslintrc*, YAML extends:, and JS heuristic array/string extraction. Args: { text: string }. Returns { extends: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "ESLint config contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "eslint_rules_summary",
        description: "Extract rules object into [{id, severity}] with counts {error,warn,off,other} and total. Severity from 0/1/2 or off/warn/error (arrays use first element). Args: { text }. Returns { rules, counts, total }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "ESLint config contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "eslint_env_parser",
        description: "Extract env keys (enabled), parser, parserOptions, and plugins from ESLint config text. Args: { text }. Returns { env?, parser?, parserOptions?, plugins? }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "ESLint config contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "eslint_lint_lite",
        description: "Educational heuristic lite lint: empty config, extends needing plugins, all rules off, eslint:recommended alone, recommended+all conflict, sparse config, JS heuristic limits, etc. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "ESLint config contents as a string (text only)",
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
const server = new Server({ name: "eslint-config-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "eslint_extends_list":
                return textResult(eslintExtendsList({ text: String(args.text ?? "") }));
            case "eslint_rules_summary":
                return textResult(eslintRulesSummary({ text: String(args.text ?? "") }));
            case "eslint_env_parser":
                return textResult(eslintEnvParser({ text: String(args.text ?? "") }));
            case "eslint_lint_lite":
                return textResult(eslintLintLite({ text: String(args.text ?? "") }));
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
    console.error("eslint-config-lab failed to start:", err);
    process.exit(1);
});
