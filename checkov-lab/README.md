# Checkov Lab

Zero-auth **local** MCP tools for scanning pasted **Checkov** config, skip comments, and IaC hints: check ID listings (`CKV_` / `CKV2_`), framework hints (`terraform` / `cloudformation` / `kubernetes` / `dockerfile` / `secrets` / `arm` / `bicep` / `helm` / `github_actions`), skip hints (`checkov:skip=` / `skip_check` / `soft-fail` / `quiet` / `compact` / `--skip-check`), and lite lint. Lite scanner (same family as conftest-lab / opa-lab) — **never runs checkov CLI**, no network.

This is **not** the checkov CLI, Bridgecrew, or Prisma Cloud. Documented heuristics only. Users may paste source that references Checkov — this plugin does not depend on or execute those binaries.

## Tools

| Tool | Purpose |
|------|---------|
| `ckv_checks_list` | CKV_ / CKV2_ check IDs from config/code/comments → `[{id?}]` |
| `ckv_frameworks_hint` | terraform / cloudformation / kubernetes / dockerfile / secrets / arm / bicep / helm / github_actions → `[{method, count}]` |
| `ckv_skips_hint` | checkov_skip / skip_check / soft_fail / quiet / compact / skip_check_flag → `[{method, count}]` |
| `ckv_lint_lite` | skip without reason, broad skip-all, empty file, soft-fail only, missing framework → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, or checkov CLI execution for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full IaC AST. Supported loosely: `#` comments stripped for framework counts; simple `'/"/` string literals; common Checkov skip / config keywords. Check IDs and `checkov:skip=` are also read from comments. Not supported / incomplete: type system, official check catalog, remote policy fetch / `checkov -d`.
- Does not run checkov CLI, and does not talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/checkov-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/checkov-lab`

## Skills

- **ckv-checks** — list CKV_ / CKV2_ check IDs and framework method counts from pasted Checkov config/code
- **ckv-lint** — skip keyword listings + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
