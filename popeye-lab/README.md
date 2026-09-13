# Popeye Lab

Zero-auth **local** MCP tools for **Popeye** (Kubernetes cluster sanitizer) config *heuristics*: scan section / resource-kind inventory, sanitizer / code hints (e.g. POP-106), excludes / namespace / FQN skip hints, and educational lite lint. **YAML / report text** analysis only — no popeye CLI, no network, no filesystem follow, no eval. No SaaS.

## Why novel

No zero-auth local MCP in this packaging focuses on practical **Popeye spinach** workflows — scan sections, sanitizer codes, excludes inventory, plus quick smell heuristics without installing Popeye.

## Tools

| Tool | Purpose |
|------|---------|
| `popeye_scans_list` | Text → `{ scans: [{section?, kind?}], count }` |
| `popeye_sanitizers_hint` | Text → `{ sanitizers: string[], count }` |
| `popeye_excludes_hint` | Text → `{ excludes: [{namespace?, name?, codes?}], count }` |
| `popeye_lint_lite` | Text → `{ findings:[{severity,rule,advice}], findingCount }` |

## Caps & caveats

- **String / YAML heuristics only** — never runs `popeye`, never opens paths on disk, never evaluates expressions, never talks to a cluster or network.
- Not a Popeye engine — nested / partial spinach YAML and report formats may be under-parsed.
- Lint rules are educational heuristics (empty, all excluded, privileged/hostNetwork tip, missing spinach config) — **not** an exploit guide.
- Never invents credentials or attack steps.

## Start

```bash
node /workspace/popeye-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/popeye-lab`

## Skills

- **popeye-scans-sanitizers** — scan section / kind inventory + sanitizer / code hints
- **popeye-excludes-lint** — excludes inventory + lite lint

## License

MIT © Lawrence Hutchins
