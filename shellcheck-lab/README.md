# ShellCheck Lab

Zero-auth **local** MCP tools for scanning pasted **shell** / **ShellCheck** config: SC#### rule ids (`SC2086`, `SC2155`, …), `disable=` / `enable=` / `# shellcheck disable` / `exclude=` disable counts, `.shellcheckrc` / `--severity` / `--shell` / `--format` / `external-sources` / `source-path` config hints, and lite lint. Lite scanner (same family as hadolint-lab / checkov-lab) — **never runs shellcheck CLI**, no network.

This is **not** the shellcheck CLI. Documented heuristics only. Users may paste source that references ShellCheck — this plugin does not depend on or execute that binary.

## Tools

| Tool | Purpose |
|------|---------|
| `shellcheck_rules_list` | SC#### rule ids from shell/config/comments → `[{id?}]` |
| `shellcheck_disables_hint` | `disable=` / `enable=` / `# shellcheck disable` / `exclude=` → `[{method, count}]` |
| `shellcheck_config_hint` | `.shellcheckrc` / `--severity` / `--shell` / `--format` / `external-sources` / `source-path` → `[{method, count}]` |
| `shellcheck_lint_lite` | unquoted_variable, disable_without_reason, empty_file, broad_disable, missing_shebang → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, or shellcheck CLI execution for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full shell AST. Supported loosely: `#` comments stripped for instruction / config keyword counts (disable directives still scanned in raw text); simple `'/"/` string literals; common ShellCheck / shell keywords.
- Does not run shellcheck CLI and does not talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/shellcheck-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/shellcheck-lab`

## Skills

- **shellcheck-rules** — list SC#### rule ids and disable/config method counts from pasted shell/config
- **shellcheck-lint** — lite heuristic findings for shell / ShellCheck smells

## License

MIT © Lawrence Hutchins — FREE
