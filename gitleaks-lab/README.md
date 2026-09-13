# Gitleaks Lab

Zero-auth **local** MCP tools for scanning pasted **Gitleaks** `.gitleaks.toml` config: `[[rules]]` id/description, allowlist path/regex/stopword counts, title / extend / useDefault / entropy / keywords / tags / path config hints, and lite lint. Lite scanner (same family as age-lab / sops-lab) — **never runs gitleaks CLI**, **never returns secret values**, no network.

This is **not** the gitleaks CLI or gitleaks detect/protect. Documented heuristics only. Users may paste source that references Gitleaks — this plugin does not depend on or execute that binary, and never outputs secret values (only rule ids/descriptions, allowlist path patterns, and config keys; regex pattern *text* is metadata, not a secret).

## Tools

| Tool | Purpose |
|------|---------|
| `gitleaks_rules_list` | `[[rules]]` id/description → `[{id?, description?}]` |
| `gitleaks_allowlist_hint` | allowlist / paths / regexes / stopwords / allowlists → `[{method, count}]` |
| `gitleaks_config_hint` | title / extend / useDefault / entropy / keywords / tags / path → `[{method, count}]` |
| `gitleaks_lint_lite` | rule_without_id, allowlist_too_broad, empty_file, no_rules, entropy_only → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, or gitleaks CLI execution for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full TOML AST. Supported loosely: `#` comments stripped for flag / keyword counts; simple `'/"/` string literals; common Gitleaks rule / allowlist / config keywords. Never returns secret *values* in tool output (structure/metadata only; rule ids & descriptions; allowlist path patterns; config keys).
- Does not run gitleaks CLI and does not talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/gitleaks-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/gitleaks-lab`

## Skills

- **gitleaks-rules** — list `[[rules]]` id/description and allowlist/config method counts from pasted config
- **gitleaks-lint** — lite heuristic findings for Gitleaks config smells

## License

MIT © Lawrence Hutchins — FREE
