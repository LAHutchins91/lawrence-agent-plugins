# Kube-Linter Lab

Zero-auth **local** MCP tools for **kube-linter** `.kube-linter.yaml` *heuristics*: check / customChecks inventory, checks.add/exclude / doNotAutoAddDefaults hints, severity remaps / findings rollups, and educational lite lint. **YAML text** analysis only — no kube-linter CLI, no network, no filesystem follow, no eval. No SaaS.

## Why novel

No zero-auth local MCP in this packaging focuses on practical **kube-linter config/check** workflows — check inventory, add/exclude/customChecks hints, severity remaps from pasted reports, plus quick smell heuristics without installing kube-linter.

## Tools

| Tool | Purpose |
|------|---------|
| `kube_linter_checks_list` | Text → `{ checks: [{name?, enabled?, template?}], count }` |
| `kube_linter_config_hint` | Text → `{ add?: string[], exclude?: string[], customCount?: number }` |
| `kube_linter_severity_hint` | Text → `{ severities: [{level, count?}], remaps? }` |
| `kube_linter_lint_lite` | Text → `{ findings:[{severity,rule,advice}], findingCount }` |

## Caps & caveats

- **String / YAML heuristics only** — never runs `kube-linter`, never opens paths on disk, never evaluates expressions, never talks to a cluster or network.
- Not a kube-linter engine — nested / partial YAML and advanced custom check params may be under-parsed.
- Lint rules are educational heuristics (empty, all checks excluded tip, privileged/hostNetwork tip, missing checks) — **not** an exploit guide.
- Never invents credentials or attack steps.

## Start

```bash
node /workspace/kube-linter-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/kube-linter-lab`

## Skills

- **kube-linter-checks-config** — check / customChecks inventory + checks.add/exclude / doNotAutoAddDefaults hints
- **kube-linter-severity-lint** — severity remaps / findings rollups + lite lint

## License

MIT © Lawrence Hutchins
