# Kustomize Lab

Zero-auth **local** MCP tools for scanning pasted **kustomization.yaml** configs: resources/bases/components listings, overlay counts (`namespace` / `namePrefix` / `nameSuffix` / `commonLabels` / `commonAnnotations` / `images` / `configMapGenerator` / `secretGenerator` / `replicas`), patches hints (`patches` / `patchesStrategicMerge` / `patchesJson6902` / `replacements` / `transformers` / `crds`), and lite lint. Lite scanner (same family as kiwi-lab / orval-lab) — **never runs kustomize or kubectl, never fetches remote resources**, no network.

This is **not** a kustomize CLI or kubectl. Documented heuristics only. Users may paste source that references kustomize — this plugin does not depend on or execute those binaries.

## Tools

| Tool | Purpose |
|------|---------|
| `kust_resources_list` | `resources:` / `bases:` / `components:` entries → `[{path?}]` |
| `kust_overlays_hint` | namespace / namePrefix / nameSuffix / commonLabels / commonAnnotations / images / configMapGenerator / secretGenerator / replicas → `[{method, count}]` |
| `kust_patches_hint` | patches / patchesStrategicMerge / patchesJson6902 / replacements / transformers / crds → `[{method, count}]` |
| `kust_lint_lite` | without resources/bases, secretGenerator plaintext literals, deprecated `bases:`, empty file, remote `http(s)://` → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, kustomize execution, or kubectl for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full YAML AST. Supported loosely: `#` comments stripped; simple `'/"/` string literals; common kustomization.yaml keys. Not supported / incomplete: anchors/aliases, full multi-doc merge, remote resource fetch.
- Does not run kustomize/kubectl or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/kustomize-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/kustomize-lab`

## Skills

- **kust-resources** — list resources/bases/components and overlay hints from pasted kustomization.yaml
- **kust-lint** — patches listings + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
