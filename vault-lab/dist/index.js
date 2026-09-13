/**
 * vault-lab — local stdio MCP for Vault HCL policy / auth / secrets-engine heuristics
 * Zero-auth. String/regex analysis only.
 * No vault CLI, server, network, filesystem follow, or eval.
 * Educational heuristics only — never invents/decodes secrets; not an exploit guide.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { vaultPoliciesList } from "./tools/vault_policies_list.js";
import { vaultAuthsHint } from "./tools/vault_auths_hint.js";
import { vaultSecretsHint } from "./tools/vault_secrets_hint.js";
import { vaultLintLite } from "./tools/vault_lint_lite.js";
const PURE = "Pure Vault HCL string analysis. No vault CLI, no server, no network, no filesystem follow, no eval. Educational heuristics only — never invents or decodes secrets; not an exploit guide.";
const TOOLS = [
    {
        name: "vault_policies_list",
        description: 'Parse policy HCL path "..." { capabilities = [...] }. Args: { text: string }. Returns { policies: [{path?, capabilities?}], count }. ' +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Vault policy/config HCL contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "vault_auths_hint",
        description: "Detect auth methods (auth/userpass, approle, kubernetes, github, jwt/oidc, ldap, aws) in config/HCL. Args: { text }. Returns { auths: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Vault config/HCL contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "vault_secrets_hint",
        description: "Detect secrets engine mounts/types (kv, kv-v2, database, pki, transit, aws) — mount paths/types only, never secret values. Args: { text }. Returns { engines: [{type?, path?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Vault config/HCL contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "vault_lint_lite",
        description: 'Educational tips: empty, missing path block, overly broad path "*" / sudo tip, plaintext root token tip, disable_mlock tip. Not exploit guide. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. ' +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Vault policy/config HCL contents as a string (text only)",
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
const server = new Server({ name: "vault-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "vault_policies_list":
                return textResult(vaultPoliciesList({ text: String(args.text ?? "") }));
            case "vault_auths_hint":
                return textResult(vaultAuthsHint({ text: String(args.text ?? "") }));
            case "vault_secrets_hint":
                return textResult(vaultSecretsHint({ text: String(args.text ?? "") }));
            case "vault_lint_lite":
                return textResult(vaultLintLite({ text: String(args.text ?? "") }));
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
    console.error("vault-lab failed to start:", err);
    process.exit(1);
});
