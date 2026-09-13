# Helm Chart Lab

Zero-auth **local** MCP tools for Helm **Chart.yaml**, **values.yaml**, and **templates** YAML/Go-template text: chart metadata inventory, values key hints, template kind/`.Values.`/helper hints, and educational lite lint. **String-level** analysis only — no Helm CLI, no cluster, no network, no filesystem follow, no eval. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Helm chart text** workflows — Chart.yaml fields/dependencies, values top-level + nested image/service/ingress hints, template kind and helper inventory, and quick smell heuristics without installing Helm or talking to a cluster.

## Tools

| Tool | Purpose |
|------|---------|
| `helm_charts_list` | Chart.yaml text → `{ charts, count }` |
| `helm_values_hint` | values.yaml text → `{ keys, hints, secretKeyNames?, count }` |
| `helm_templates_hint` | templates YAML/Go-template text → `{ kinds, valuesRefs, helpers, count }` |
| `helm_lint_lite` | chart/values/templates text → `{ findings, findingCount }` |

## Caps & caveats

- **YAML/string analysis only** — never runs `helm`, never talks to a cluster, never opens chart paths on disk, never evaluates Go templates.
- Chart/values use `yaml` parse; templates also use regex for `.Values.`, `define`/`include`/`tpl`, and kind hints (multi-doc `---` ok).
- Secret detection flags **key names** only (password/secret/token) — never invents or echoes secret values.
- Lint rules are educational heuristics (empty, missing Chart name/version/apiVersion, `:latest` tags, plaintext password key names, privileged/hostNetwork, missing templates tip) — **not** an exploit guide.

## Start

```bash
node /workspace/helm-chart-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/helm-chart-lab`

## Skills

- **helm-charts-values** — Chart.yaml inventory + values hints
- **helm-templates-lint** — templates hints + lite lint

## License

MIT © Lawrence Hutchins
