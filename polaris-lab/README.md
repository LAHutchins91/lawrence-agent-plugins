# Polaris Lab

Zero-auth **local** MCP tools for **Fairwinds Polaris** config *heuristics*: check inventory (id / enabled / severity), exemptions / namespace ignore hints, severity level rollups / mutators, and educational lite lint. **YAML text** analysis only — no polaris CLI, no network, no filesystem follow, no eval. No SaaS.

## Why novel

No zero-auth local MCP in this packaging focuses on practical **Polaris config** workflows — check severity maps, exemptions inventory, severity / mutator rollups, plus quick smell heuristics without installing Polaris.

## Tools

| Tool | Purpose |
|------|---------|
| `polaris_checks_list` | Text → `{ checks: [{id?, enabled?, severity?}], count }` |
| `polaris_exemptions_hint` | Text → `{ exemptions: [{namespace?, controllerName?, rules?}], count }` |
| `polaris_severity_hint` | Text → `{ severities: [{level, count?}], mutators? }` |
| `polaris_lint_lite` | Text → `{ findings:[{severity,rule,advice}], findingCount }` |

## Caps & caveats

- **String / YAML heuristics only** — never runs `polaris`, never opens paths on disk, never evaluates expressions, never talks to a cluster or network.
- Not a Polaris engine — nested / partial YAML and advanced custom checks may be under-parsed.
- Lint rules are educational heuristics (empty, all checks disabled, privileged/hostNetwork tip, missing checks block) — **not** an exploit guide.
- Never invents credentials or attack steps.

## Start

```bash
node /workspace/polaris-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/polaris-lab`

## Skills

- **polaris-checks-exemptions** — check inventory + exemptions / namespace ignore hints
- **polaris-severity-lint** — severity / mutator rollups + lite lint

## License

MIT © Lawrence Hutchins
