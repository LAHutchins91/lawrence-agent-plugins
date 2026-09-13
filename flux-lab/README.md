# Flux Lab

Zero-auth **local** MCP tools for scanning pasted **Flux GitOps** YAML: GitRepository / HelmRepository / OCIRepository / Bucket listings, Kustomization hints (`Kustomization` / `path` / `sourceRef` / `prune` / `interval` / `healthChecks` / `dependsOn`), HelmRelease hints (`HelmRelease` / `chart` / `values` / `valuesFrom` / `chartRef` / `install` / `upgrade` / `rollback` / `test`), and lite lint. Lite scanner (same family as argocd-lab / kustomize-lab) — **never runs flux or kubectl, never fetches remote repos**, no network.

This is **not** a flux CLI or kubectl. Documented heuristics only. Users may paste source that references Flux — this plugin does not depend on or execute those binaries.

## Tools

| Tool | Purpose |
|------|---------|
| `flux_sources_list` | GitRepository / HelmRepository / OCIRepository / Bucket → `[{kind?, name?}]` |
| `flux_kustomizations_hint` | Kustomization / path / sourceRef / prune / interval / healthChecks / dependsOn → `[{method, count}]` |
| `flux_helmreleases_hint` | HelmRelease / chart / values / valuesFrom / chartRef / install / upgrade / rollback / test → `[{method, count}]` |
| `flux_lint_lite` | missing interval, missing sourceRef/chartRef, prune: false, empty file, insecure `http://` url → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, flux execution, or kubectl for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full YAML AST. Supported loosely: `#` comments stripped; simple `'/"/` string literals; common Flux YAML keys. Not supported / incomplete: anchors/aliases, full multi-doc merge, remote repo fetch.
- Does not run flux/kubectl or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/flux-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/flux-lab`

## Skills

- **flux-sources** — list GitRepository/HelmRepository/OCIRepository/Bucket and Kustomization hints from pasted Flux YAML
- **flux-lint** — HelmRelease listings + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
