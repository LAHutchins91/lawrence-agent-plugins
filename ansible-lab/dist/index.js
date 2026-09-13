/**
 * ansible-lab — local stdio MCP for Ansible playbook/role YAML text heuristics
 * Zero-auth. YAML string analysis only.
 * No ansible CLI, SSH, network, filesystem follow, or eval.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { ansiblePlaysList } from "./tools/ansible_plays_list.js";
import { ansibleRolesHint } from "./tools/ansible_roles_hint.js";
import { ansibleVarsHint } from "./tools/ansible_vars_hint.js";
import { ansibleLintLite } from "./tools/ansible_lint_lite.js";
const PURE = "Pure Ansible playbook/role YAML string analysis. No ansible CLI, no SSH, no network, no filesystem follow, no eval.";
const TOOLS = [
    {
        name: "ansible_plays_list",
        description: "Parse playbook YAML; list plays (name, hosts, become, gather_facts, strategy). Args: { text: string }. Returns { plays: [{name?, hosts?, become?, gatherFacts?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Ansible playbook YAML contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "ansible_roles_hint",
        description: "Extract roles (roles: list, import_role, include_role, role: name). Args: { text }. Returns { roles: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Ansible playbook YAML contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "ansible_vars_hint",
        description: "Extract vars/vars_files/set_fact/key names; flag secret/password/token key *names* only. Args: { text }. Returns { vars: string[], secretKeyNames?, varsFiles?, count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Ansible playbook YAML contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "ansible_lint_lite",
        description: "Educational tips: empty, missing hosts, shell/command without creates, plaintext passwords, become without become_user tip, wild hosts `all` with dangerous modules tip. Not exploit guide. Args: { text }. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Ansible playbook YAML contents as a string (text only)",
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
const server = new Server({ name: "ansible-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "ansible_plays_list":
                return textResult(ansiblePlaysList({ text: String(args.text ?? "") }));
            case "ansible_roles_hint":
                return textResult(ansibleRolesHint({ text: String(args.text ?? "") }));
            case "ansible_vars_hint":
                return textResult(ansibleVarsHint({ text: String(args.text ?? "") }));
            case "ansible_lint_lite":
                return textResult(ansibleLintLite({ text: String(args.text ?? "") }));
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
    console.error("ansible-lab failed to start:", err);
    process.exit(1);
});
