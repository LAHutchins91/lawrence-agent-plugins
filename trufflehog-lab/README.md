# TruffleHog Lab

Zero-auth **local** MCP tools for scanning pasted **TruffleHog** config / CI: detector names (`--include-detectors`, `detectors:`, `detector:`), exclude-paths / exclude-detectors / filter-entropy / include-paths filter counts, `--json` / `--only-verified` / `--results` / git / github / filesystem / s3 / `--concurrency` config hints, and lite lint. Lite scanner (same family as gitleaks-lab / age-lab) — **never runs trufflehog CLI**, **never returns secret values**, no network.

This is **not** the trufflehog CLI or trufflehog scan. Documented heuristics only. Users may paste source that references TruffleHog — this plugin does not depend on or execute that binary, and never outputs secret values (only detector names, filter method counts, and config keys; regex pattern *text* is metadata, not a secret).

## Tools

| Tool | Purpose |
|------|---------|
| `trufflehog_detectors_list` | detector names from `--include-detectors` / `detectors:` → `[{name?}]` |
| `trufflehog_filters_hint` | exclude-paths / exclude-detectors / filter-entropy / include-paths / `--exclude-paths` → `[{method, count}]` |
| `trufflehog_config_hint` | `--json` / `--only-verified` / `--results` / git / github / filesystem / s3 / `--concurrency` → `[{method, count}]` |
| `trufflehog_lint_lite` | no_verified_flag, exclude_all_detectors, empty_file, json_without_fail, filesystem_without_exclude → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, or trufflehog CLI execution for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full YAML/TOML/JSON AST. Supported loosely: `#` comments stripped for flag / keyword counts; simple `'/"/` string literals; common TruffleHog detector / filter / config keywords. Never returns secret *values* in tool output (structure/metadata only; detector names; filter method counts; config keys).
- Does not run trufflehog CLI and does not talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/trufflehog-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/trufflehog-lab`

## Skills

- **trufflehog-detectors** — list detector names and filter/config method counts from pasted config/CI
- **trufflehog-lint** — lite heuristic findings for TruffleHog config smells

## License

MIT © Lawrence Hutchins — FREE
