/**
 * jest-config-lab — local stdio MCP for Jest config text
 * Zero-auth. Prefer JSONC; JS via best-effort heuristics (no eval).
 * Unwrap package.json "jest" key. No jest binary, no network, no filesystem follow.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { jestTestMatch } from "./tools/jest_test_match.js";
import { jestCoverageSummary } from "./tools/jest_coverage_summary.js";
import { jestProjectsList } from "./tools/jest_projects_list.js";
import { jestLintLite } from "./tools/jest_lint_lite.js";
const PURE = "Pure Jest config string analysis — prefer JSONC (comment-strip then JSON.parse); jest.config.js uses best-effort regex heuristics (no eval); unwraps package.json \"jest\" key. No jest binary, no network.";
const TOOLS = [
    {
        name: "jest_test_match",
        description: "Parse Jest config text and extract testMatch, testRegex, testPathIgnorePatterns, and roots. Handles JSON/JSONC, package.json jest key, and JS heuristic extract. Args: { text: string }. Returns { testMatch?, testRegex?, testPathIgnorePatterns?, roots? }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Jest config contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "jest_coverage_summary",
        description: "Extract coverage-related Jest options: collectCoverage, coverageDirectory, coverageThreshold, collectCoverageFrom, coverageReporters. Args: { text }. Returns coverage summary object. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Jest config contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "jest_projects_list",
        description: "Extract projects array (strings or objects with displayName) from Jest config text. Args: { text }. Returns { projects: unknown[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Jest config contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "jest_lint_lite",
        description: "Educational heuristic lite lint: empty config, missing testMatch/testRegex, coverageThreshold without collectCoverage, deprecated keys (testURL, timers, setupTestFrameworkScriptFile, …), transformIgnorePatterns tips, JS heuristic limits, package.json jest unwrap. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Jest config contents as a string (text only)",
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
const server = new Server({ name: "jest-config-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "jest_test_match":
                return textResult(jestTestMatch({ text: String(args.text ?? "") }));
            case "jest_coverage_summary":
                return textResult(jestCoverageSummary({ text: String(args.text ?? "") }));
            case "jest_projects_list":
                return textResult(jestProjectsList({ text: String(args.text ?? "") }));
            case "jest_lint_lite":
                return textResult(jestLintLite({ text: String(args.text ?? "") }));
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
    console.error("jest-config-lab failed to start:", err);
    process.exit(1);
});
