# K8s Manifest Lab

Zero-auth **local** MCP tools for Kubernetes **multi-doc YAML text**: list kinds, find by name, extract container images, and heuristic lite lint. **String-level** analysis only — no kubectl, no cluster/API access, no filesystem reads beyond the text you pass, no network I/O. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Kubernetes multi-doc YAML text** workflows — resource inventory across `---` docs, name lookup, image extraction from containers/initContainers, and quick risk/smell heuristics without talking to a cluster.

## Tools

| Tool | Purpose |
|------|---------|
| `k8s_list_kinds` | multi-doc YAML → `{ resources, kinds, count }` |
| `k8s_find_by_name` | multi-doc YAML + name → `{ matches }` |
| `k8s_images_list` | multi-doc YAML → `{ images, unique }` |
| `k8s_lint_lite` | multi-doc YAML → `{ findings, findingCount }` |

## Caps & caveats

- **YAML string analysis only** — never runs kubectl, never talks to a cluster or API server, never opens manifest paths on disk.
- Splits multi-document YAML on `---` (via `yaml` parseAllDocuments); flattens `*List` items when present.
- Images come from `containers` / `initContainers` on Pods and common workload templates (Deployment, StatefulSet, DaemonSet, Job, CronJob, etc.).
- Lint rules are heuristics (missing name/kind, `:latest`/untagged images, privileged, hostNetwork, empty selectors, hostPath, etc.).

## Start

```bash
node /workspace/k8s-manifest-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/k8s-manifest-lab`

## Skills

- **k8s-inventory-images** — List kinds/resources and extract images
- **k8s-find-lint** — Find by name and lite lint

## License

MIT © Lawrence Hutchins
