# Hadolint Lab

Zero-auth **local** MCP tools for scanning pasted **Dockerfile** / **Hadolint** config: DL/SC rule ids (`DL3008`, `SC2086`, …), `ignore=` / `--ignore` / `ignored:` / `trustedRegistries` ignore counts, `.hadolint.yaml` / `failure-threshold` / `override` / `label-schema` / `strict-labels` / `format` config hints, and lite lint. Lite scanner (same family as trufflehog-lab / gitleaks-lab) — **never runs hadolint CLI**, no network.

This is **not** the hadolint CLI or ShellCheck. Documented heuristics only. Users may paste source that references Hadolint — this plugin does not depend on or execute that binary.

## Tools

| Tool | Purpose |
|------|---------|
| `hadolint_rules_list` | DL/SC rule ids from Dockerfile/config/comments → `[{id?}]` |
| `hadolint_ignores_hint` | `ignore=` / `--ignore` / `ignored:` / `trustedRegistries` → `[{method, count}]` |
| `hadolint_config_hint` | `.hadolint.yaml` / `failure-threshold` / `override` / `label-schema` / `strict-labels` / `format` → `[{method, count}]` |
| `hadolint_lint_lite` | latest_tag, apt_without_no_install_recommends, ignore_without_reason, empty_file, broad_ignore → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, or hadolint CLI execution for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full Dockerfile/YAML AST. Supported loosely: `#` comments stripped for instruction / config keyword counts (ignore directives still scanned in raw text); simple `'/"/` string literals; common Hadolint / Dockerfile keywords.
- Does not run hadolint CLI and does not talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/hadolint-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/hadolint-lab`

## Skills

- **hadolint-rules** — list DL/SC rule ids and ignore/config method counts from pasted Dockerfile/config
- **hadolint-lint** — lite heuristic findings for Dockerfile / Hadolint smells

## License

MIT © Lawrence Hutchins — FREE
