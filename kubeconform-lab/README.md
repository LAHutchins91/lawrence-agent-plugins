# Kubeconform Lab

Zero-auth **local** MCP tools for **kubeconform** CLI-flags / config *heuristics*: schema-location / kubernetes-version inventory, strict / ignore-missing-schemas / summary hints, skip-kind lists, and educational lite lint. **String / YAML / flag** analysis only — no kubeconform CLI, no network schema fetch, no filesystem follow, no eval. No SaaS.

## Why novel

No zero-auth local MCP in this packaging focuses on practical **kubeconform flags/config** workflows — schema location + version hints, strict/summary toggles, skip lists, plus quick smell heuristics without installing kubeconform or fetching schemas.

## Tools

| Tool | Purpose |
|------|---------|
| `kubeconform_schemas_list` | Text → `{ schemas: [{location?, version?}], count }` |
| `kubeconform_strict_hint` | Text → `{ strict?: boolean, ignoreMissingSchemas?: boolean, summary? }` |
| `kubeconform_skip_hint` | Text → `{ skip: string[], count }` |
| `kubeconform_lint_lite` | Text → `{ findings:[{severity,rule,advice}], findingCount }` |

## Caps & caveats

- **String / YAML / flag heuristics only** — never runs `kubeconform`, never opens paths on disk, never fetches schemas, never evaluates expressions, never talks to a cluster or network.
- Not a kubeconform engine — nested / partial YAML and exotic flag quoting may be under-parsed.
- Lint rules are educational heuristics (empty, missing schema location, skip-all tip, plaintext token in schema URL tip) — **not** an exploit guide.
- Never invents credentials or attack steps.

## Start

```bash
node /workspace/kubeconform-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/kubeconform-lab`

## Skills

- **kubeconform-schemas-strict** — schema-location / kubernetes-version inventory + strict / ignore-missing-schemas / summary hints
- **kubeconform-skip-lint** — skip-kind lists + lite lint

## License

MIT © Lawrence Hutchins
