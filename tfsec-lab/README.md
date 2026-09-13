# tfsec Lab

Zero-auth **local** MCP tools for scanning pasted **tfsec** config, ignore comments, and HCL hints: check ID listings (`AWS006` / `AVD-`), ignore hints (`tfsec:ignore:` / `#tfsec:ignore` / `exclude:` / `--exclude`), severity hints (`CRITICAL` / `HIGH` / `MEDIUM` / `LOW` / `minimum-severity` / `soft-fail`), and lite lint. Lite scanner (same family as checkov-lab / conftest-lab) — **never runs tfsec CLI**, no network.

This is **not** the tfsec CLI, Trivy, or Aqua Security. Documented heuristics only. Users may paste source that references tfsec — this plugin does not depend on or execute those binaries.

## Tools

| Tool | Purpose |
|------|---------|
| `tfsec_checks_list` | AWS006 / AVD- / tfsec check IDs from HCL/config/comments → `[{id?}]` |
| `tfsec_ignores_hint` | tfsec_ignore / hash_tfsec_ignore / exclude / exclude_flag → `[{method, count}]` |
| `tfsec_severity_hint` | critical / high / medium / low / minimum_severity / soft_fail → `[{method, count}]` |
| `tfsec_lint_lite` | ignore without reason, broad exclude, empty file, soft-fail only, minimum-severity HIGH+ → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, or tfsec CLI execution for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full HCL AST. Supported loosely: `#` comments stripped for severity counts; simple `'/"/` string literals; common tfsec ignore / config keywords. Check IDs and `tfsec:ignore:` are also read from comments. Not supported / incomplete: type system, official check catalog, remote policy fetch / `tfsec .`.
- Does not run tfsec CLI, and does not talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/tfsec-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/tfsec-lab`

## Skills

- **tfsec-checks** — list AWS006 / AVD- / tfsec check IDs and severity method counts from pasted HCL/config
- **tfsec-lint** — ignore keyword listings + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
