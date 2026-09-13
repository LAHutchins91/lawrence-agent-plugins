# Argo CD Lab

Zero-auth **local** MCP tools for scanning pasted **Argo CD** YAML: Application / AppProject / ApplicationSet listings, source counts (`repoURL` / `path` / `chart` / `targetRevision` / `helm` / `kustomize` / `directory` / `sources:`), syncPolicy hints (`syncPolicy` / `automated` / `prune` / `selfHeal` / `syncOptions` / `CreateNamespace` / `ServerSideApply` / `retry`), and lite lint. Lite scanner (same family as kustomize-lab / kiwi-lab) — **never runs argocd or kubectl, never fetches remote repos**, no network.

This is **not** an argocd CLI or kubectl. Documented heuristics only. Users may paste source that references Argo CD — this plugin does not depend on or execute those binaries.

## Tools

| Tool | Purpose |
|------|---------|
| `argo_apps_list` | Application / AppProject / ApplicationSet → `[{kind?, name?}]` |
| `argo_sources_hint` | repoURL / path / chart / targetRevision / helm / kustomize / directory / sources: → `[{method, count}]` |
| `argo_sync_hint` | syncPolicy / automated / prune / selfHeal / syncOptions / CreateNamespace / ServerSideApply / retry → `[{method, count}]` |
| `argo_lint_lite` | missing destination, missing source/sources, automated without prune, empty file, insecure `http://` repoURL → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, argocd execution, or kubectl for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full YAML AST. Supported loosely: `#` comments stripped; simple `'/"/` string literals; common Argo CD YAML keys. Not supported / incomplete: anchors/aliases, full multi-doc merge, remote repo fetch.
- Does not run argocd/kubectl or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/argocd-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/argocd-lab`

## Skills

- **argo-apps** — list Application/AppProject/ApplicationSet and source hints from pasted Argo CD YAML
- **argo-lint** — syncPolicy listings + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
