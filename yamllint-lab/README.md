# yamllint Lab

Zero-auth **local** MCP tools for scanning pasted **YAML** / **yamllint** config: known rule names (`line-length`, `truthy`, `indentation`, …), `extends: default` / `relaxed` / `/path` counts, `ignore:` / `ignore-from-file:` / `yamllint disable` / `disable-line` / `disable-next-line` ignore counts, and lite lint. Lite scanner (same family as shellcheck-lab / hadolint-lab) — **never runs yamllint CLI**, no network.

This is **not** the yamllint CLI. Documented heuristics only. Users may paste source that references yamllint — this plugin does not depend on or execute that binary.

## Tools

| Tool | Purpose |
|------|---------|
| `yamllint_rules_list` | Known rule names from .yamllint / YAML → `[{id?}]` |
| `yamllint_extends_hint` | `extends: default` / `relaxed` / `/path` → `[{method, count}]` |
| `yamllint_ignores_hint` | `ignore:` / `ignore-from-file:` / `yamllint disable` / `disable-line` / `disable-next-line` → `[{method, count}]` |
| `yamllint_lint_lite` | tabs_in_indent, missing_document_start, empty_file, rule_level_disable_all, line_length_very_high → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, or yamllint CLI execution for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full YAML AST. Supported loosely: `#` comments stripped for instruction / config keyword counts (disable directives still scanned in raw text); simple `'/"/` string literals; common yamllint / YAML keywords.
- Does not run yamllint CLI and does not talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/yamllint-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/yamllint-lab`

## Skills

- **yamllint-rules** — list known yamllint rule names and extends/ignore method counts from pasted YAML/config
- **yamllint-lint** — lite heuristic findings for YAML / yamllint smells

## License

MIT © Lawrence Hutchins — FREE
