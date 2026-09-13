/**
 * chef-lab — local stdio MCP for Chef cookbook/recipe Ruby DSL text heuristics
 * Zero-auth. Ruby DSL string analysis only.
 * No Chef CLI, knife, network, filesystem follow, or eval.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { chefCookbooksList } from "./tools/chef_cookbooks_list.js";
import { chefRecipesHint } from "./tools/chef_recipes_hint.js";
import { chefAttrsHint } from "./tools/chef_attrs_hint.js";
import { chefLintLite } from "./tools/chef_lint_lite.js";
const PURE = "Pure Chef cookbook/recipe Ruby DSL string analysis. No Chef CLI, no knife, no network, no filesystem follow, no eval.";
const TOOLS = [
    {
        name: "chef_cookbooks_list",
        description: "From metadata.rb / Policyfile / Berksfile text, list cookbook name, version, depends, supports. Args: { text: string }. Returns { cookbooks: [{name?, version?, depends?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Chef metadata.rb / Policyfile / Berksfile contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "chef_recipes_hint",
        description: "Heuristic scan of recipe Ruby: package, service, template, file, directory, execute, include_recipe, resources. Args: { text }. Returns { resources: [{type?, name?}], includes?: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Chef recipe Ruby DSL contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "chef_attrs_hint",
        description: "Extract default/override/normal attributes (default[...], node[...], attributes/*.rb keys); flag password/secret/token key *names*. Args: { text }. Returns { attrs: string[], secretKeyNames?: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Chef attributes Ruby contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "chef_lint_lite",
        description: "Educational tips: empty, missing name/version in metadata, plaintext passwords, execute without not_if/creates, :latest package versions tip. Not exploit guide. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Chef cookbook/recipe/attributes text as a string (text only)",
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
const server = new Server({ name: "chef-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "chef_cookbooks_list":
                return textResult(chefCookbooksList({ text: String(args.text ?? "") }));
            case "chef_recipes_hint":
                return textResult(chefRecipesHint({ text: String(args.text ?? "") }));
            case "chef_attrs_hint":
                return textResult(chefAttrsHint({ text: String(args.text ?? "") }));
            case "chef_lint_lite":
                return textResult(chefLintLite({ text: String(args.text ?? "") }));
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
    console.error("chef-lab failed to start:", err);
    process.exit(1);
});
