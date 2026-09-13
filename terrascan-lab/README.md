# Terrascan Lab

Zero-auth **local** MCP tools for **Terrascan** policy / config / scan-report *heuristics*: policy ID inventory, iac-type / skip-rules / dir scan targets, severity summaries from sample findings JSON, and educational lite lint. **YAML / JSON / TOML-ish text** analysis only — no terrascan CLI, no network, no filesystem follow, no eval. No SaaS.

## Why novel

No zero-auth local MCP in this packaging focuses on practical **Terrascan policy/config/scan-report** workflows — policy ID inventory, iac-type / skip-rule / dir hints, severity rollups from pasted findings JSON, plus quick smell heuristics without installing Terrascan.

## Tools

| Tool | Purpose |
|------|---------|
| `terrascan_policies_list` | Text → `{ policies: [{id?, category?, severity?}], count }` |
| `terrascan_scans_hint` | Text → `{ iacTypes: string[], skipRules?: string[], dirs?: string[], count }` |
| `terrascan_severity_hint` | Text → `{ severities: [{level, count?}], minSeverity? }` |
| `terrascan_lint_lite` | Text → `{ findings:[{severity,rule,advice}], findingCount }` |

## Caps & caveats

- **String / YAML / JSON / TOML-ish heuristics only** — never runs `terrascan`, never opens paths on disk, never evaluates Rego/expressions, never talks to a network.
- Not a Terrascan engine — nested / partial TOML and advanced policy filters may be under-parsed.
- Lint rules are educational heuristics (empty, missing iac-type, all policies skipped tip, plaintext secrets tip) — **not** an exploit guide. Secret *values* are never returned; only key *names* / presence hints.
- Never invents credentials.

## Start

```bash
node /workspace/terrascan-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/terrascan-lab`

## Skills

- **terrascan-policies-scans** — policy ID inventory + iac-type / skip-rules / dir scan hints
- **terrascan-severity-lint** — severity rollups from findings JSON + lite lint

## License

MIT © Lawrence Hutchins
