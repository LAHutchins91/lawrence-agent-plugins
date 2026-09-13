# Trivy Lab

Zero-auth **local** MCP tools for scanning pasted **Trivy** config, CI snippets, and ignore hints: scan listings (`image` / `fs` / `repo` / `config` / `sbom` / `kubernetes` / `vuln`), ignore hints (`.trivyignore` / `trivy:ignore` / `ignorefile` / `--ignorefile` / `CVE-`), severity hints (`CRITICAL` / `HIGH` / `MEDIUM` / `LOW` / `UNKNOWN` / `--severity` / `severity:`), and lite lint. Lite scanner (same family as tfsec-lab / checkov-lab) — **never runs trivy CLI**, no network.

This is **not** the Trivy CLI or Aqua Security. Documented heuristics only. Users may paste source that references trivy — this plugin does not depend on or execute those binaries.

## Tools

| Tool | Purpose |
|------|---------|
| `trivy_scans_list` | image / fs / repo / config / sbom / kubernetes / vuln scans from config/CI → `[{kind?, target?}]` |
| `trivy_ignores_hint` | trivyignore / trivy_ignore / ignorefile / ignorefile_flag / cve → `[{method, count}]` |
| `trivy_severity_hint` | critical / high / medium / low / unknown / severity_flag / severity_key → `[{method, count}]` |
| `trivy_lint_lite` | ignore without expiry, broad ignore all, empty file, exit-code 0, severity CRITICAL-only → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, or trivy CLI execution for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full YAML AST. Supported loosely: `#` comments stripped for severity counts; simple `'/"/` string literals; common Trivy ignore / scan keywords. Scan kinds and `trivy:ignore` / CVE- are also read from comments. Not supported / incomplete: type system, official vulnerability DB, remote scan / `trivy image`.
- Does not run trivy CLI, and does not talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/trivy-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/trivy-lab`

## Skills

- **trivy-scans** — list image / fs / repo / config / sbom / kubernetes / vuln scans and severity method counts from pasted config/CI
- **trivy-lint** — ignore keyword listings + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
