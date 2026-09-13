# Skaffold Lab

Zero-auth **local** MCP tools for **skaffold.yaml** text: pipeline/profile inventory, build artifact hints, deploy config hints, and educational lite lint. **String-level** analysis only — no Skaffold CLI, no cluster, no network, no filesystem follow, no eval. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **skaffold.yaml text** workflows — Config apiVersion/metadata/profiles, build.artifacts builders (docker/buildpacks/jib/kaniko/custom), deploy.kubectl/helm/kustomize, and quick smell heuristics without installing Skaffold or talking to a cluster.

## Tools

| Tool | Purpose |
|------|---------|
| `sk_pipelines_list` | skaffold.yaml text → `{ pipelines, profiles, count }` |
| `sk_builds_hint` | skaffold.yaml text → `{ builds, count }` |
| `sk_deploys_hint` | skaffold.yaml text → `{ deploys, count }` |
| `sk_lint_lite` | skaffold.yaml text → `{ findings, findingCount }` |

## Caps & caveats

- **YAML/string analysis only** — never runs `skaffold`, never talks to a cluster, never opens paths on disk, never evaluates build scripts.
- Multi-doc `---` configs are supported.
- Build builders detected: `docker`, `buildpacks`, `jib`, `kaniko`, `custom`.
- Deploy types: `kubectl` (manifests paths), `helm` (releases), `kustomize` (paths), plus `statusCheck` when present.
- Lint rules are educational heuristics (empty, missing apiVersion/kind, missing build.artifacts, `:latest` tags, plaintext secrets in manifests paths tip, remote git repo tip) — **not** an exploit guide.

## Start

```bash
node /workspace/skaffold-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/skaffold-lab`

## Skills

- **sk-pipelines-builds** — pipelines/profiles inventory + build artifact hints
- **sk-deploys-lint** — deploy hints + lite lint

## License

MIT © Lawrence Hutchins
