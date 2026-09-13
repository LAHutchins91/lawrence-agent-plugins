/**
 * helm-chart-lab — local stdio MCP for Helm Chart.yaml / values.yaml / templates text
 * Zero-auth. YAML string-level + regex for Go-template bits.
 * No Helm CLI, cluster access, network, filesystem follow, or eval.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { helmChartsList } from "./tools/helm_charts_list.js";
import { helmValuesHint } from "./tools/helm_values_hint.js";
import { helmTemplatesHint } from "./tools/helm_templates_hint.js";
import { helmLintLite } from "./tools/helm_lint_lite.js";
const PURE = "Pure Helm Chart.yaml / values.yaml / templates string analysis via yaml + regex. No Helm CLI, no cluster, no network, no filesystem follow, no eval.";
const TOOLS = [
    {
        name: "helm_charts_list",
        description: "Parse Chart.yaml text. Return name, version, apiVersion, type, appVersion, description, dependencies. Args: { text: string }. Returns { charts: [{name?, version?, apiVersion?, type?, appVersion?, description?, dependencies?}], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Chart.yaml contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "helm_values_hint",
        description: "Parse values.yaml text; top-level keys; nested hints for image/tag/replicaCount/service/ingress/resources; flag secret/password/token key names only (never invent secret values). Args: { text }. Returns { keys: string[], hints: [{path, kind}], secretKeyNames?: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "values.yaml contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "helm_templates_hint",
        description: "Scan templates YAML/Go-template text (multi-doc --- ok). Hint K8s kinds, .Values. refs, define/include/tpl. Args: { text }. Returns { kinds: string[], valuesRefs: string[], helpers: string[], count }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Helm templates YAML/Go-template contents as a string (text only)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "helm_lint_lite",
        description: "Educational tips: empty, missing Chart name/version/apiVersion, :latest tags in values, plaintext password key names, privileged/hostNetwork in templates, missing templates tip. Not an exploit guide. Args: { text?: string, chartText?: string, valuesText?: string, templatesText?: string } — accept single combined text OR the three parts. Returns { findings:[{severity,rule,advice}], findingCount }. " +
            PURE,
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Optional single combined chart/values/templates text",
                },
                chartText: {
                    type: "string",
                    description: "Optional Chart.yaml text",
                },
                valuesText: {
                    type: "string",
                    description: "Optional values.yaml text",
                },
                templatesText: {
                    type: "string",
                    description: "Optional templates YAML/Go-template text",
                },
            },
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
const server = new Server({ name: "helm-chart-lab", version: "1.0.0" }, { capabilities: { tools: {} } });
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
            case "helm_charts_list":
                return textResult(helmChartsList({ text: String(args.text ?? "") }));
            case "helm_values_hint":
                return textResult(helmValuesHint({ text: String(args.text ?? "") }));
            case "helm_templates_hint":
                return textResult(helmTemplatesHint({ text: String(args.text ?? "") }));
            case "helm_lint_lite":
                return textResult(helmLintLite({
                    ...(args.text !== undefined ? { text: String(args.text) } : {}),
                    ...(args.chartText !== undefined
                        ? { chartText: String(args.chartText) }
                        : {}),
                    ...(args.valuesText !== undefined
                        ? { valuesText: String(args.valuesText) }
                        : {}),
                    ...(args.templatesText !== undefined
                        ? { templatesText: String(args.templatesText) }
                        : {}),
                }));
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
    console.error("helm-chart-lab failed to start:", err);
    process.exit(1);
});
