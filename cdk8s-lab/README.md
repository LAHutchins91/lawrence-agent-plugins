# cdk8s Lab

Zero-auth **local** MCP tools for **cdk8s** app/chart text: chart/app inventory, import detection, resource constructor hints, and educational lite lint. **YAML/string/regex** heuristics only — no cdk8s CLI, no cluster, no network, no filesystem follow, no eval. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **cdk8s** workflows — `cdk8s.yaml` language/app/imports, `Chart` subclasses, `cdk8s` / `cdk8s-plus-*` / `imports/k8s` / CRD / `ApiObject` imports, `new kplus.Deployment` / `new k8s.KubeService` / synth YAML kind/apiVersion, and quick smell heuristics without installing the cdk8s CLI or talking to a cluster.

## Tools

| Tool | Purpose |
|------|---------|
| `cdk8s_charts_list` | App/chart text → `{ charts: [{name?, apiVersion?, language?, runtime?, app?, description?, version?}], count }` |
| `cdk8s_imports_hint` | Program/cdk8s.yaml → `{ imports: [{kind, module?, detail?}], count }` |
| `cdk8s_resources_hint` | Program/synth YAML → `{ resources: [{type?, name?, kind?, apiVersion?}], count }` |
| `cdk8s_lint_lite` | Text → `{ findings:[{severity,rule,advice}], findingCount }` |

## Caps & caveats

- **YAML/string/regex analysis only** — never runs `cdk8s`, never talks to a cluster, never opens paths on disk, never evaluates code.
- Not a cdk8s engine — nested/complex expressions and dynamic constructs may be under-parsed.
- Resources: `new kplus.*` / `new k8s.Kube*` / `ApiObject`, plus kind/apiVersion in pasted synth YAML.
- Lint rules are educational heuristics (empty, missing cdk8s import, `:latest` image tags, privileged/hostNetwork, plaintext secrets in constructs) — **not** an exploit guide.

## Start

```bash
node /workspace/cdk8s-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/cdk8s-lab`

## Skills

- **cdk8s-charts-resources** — chart/app inventory + resource constructor hints
- **cdk8s-imports-lint** — import detection + lite lint

## License

MIT © Lawrence Hutchins
