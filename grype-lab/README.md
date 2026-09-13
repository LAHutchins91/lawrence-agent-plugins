# Grype Lab

Zero-auth **local** MCP tools for scanning pasted **Grype** config, CI snippets, and ignore hints: scan listings (`dir` / `image` / `sbom` / `file` / `docker`), ignore hints (`.grype.yaml` / `ignore:` / `VEX` / `--exclude` / `CVE-`), severity hints (`Critical` / `High` / `Medium` / `Low` / `Negligible` / `Unknown` / `fail-on` / `--fail-on`), and lite lint. Lite scanner (same family as trivy-lab / tfsec-lab) — **never runs grype CLI**, no network.

This is **not** the Grype CLI or Anchore. Documented heuristics only. Users may paste source that references grype — this plugin does not depend on or execute those binaries.

## Tools

| Tool | Purpose |
|------|---------|
| `grype_scans_list` | dir / image / sbom / file / docker scans from config/CI → `[{kind?, target?}]` |
| `grype_ignores_hint` | grype_yaml / ignore / vex / exclude / cve → `[{method, count}]` |
| `grype_severity_hint` | critical / high / medium / low / negligible / unknown / fail_on / fail_on_key → `[{method, count}]` |
| `grype_lint_lite` | ignore without reason, broad exclude, empty file, no fail-on, fail-on critical-only → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, or grype CLI execution for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full YAML AST. Supported loosely: `#` comments stripped for severity counts; simple `'/"/` string literals; common Grype ignore / scan keywords. Scan kinds and ignore / CVE- are also read from comments. Not supported / incomplete: type system, official vulnerability DB, remote scan / `grype image`.
- Does not run grype CLI, and does not talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/grype-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/grype-lab`

## Skills

- **grype-scans** — list dir / image / sbom / file / docker scans and severity method counts from pasted config/CI
- **grype-lint** — ignore keyword listings + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
