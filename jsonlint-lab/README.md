# JSON Lint Lab

Zero-auth **local** MCP tools for scanning pasted **JSON** / **jsonlint** CLI/config: modes (`compact` / `pretty` / `validate` / `quiet`), option flag counts (`--compact` / `--in-place` / `--quiet` / `--indent` / `--validate` / `-c` / `-i` / `-q`), sort-key hints (`--sort-keys` / `sortKeys` / `sorted` / `key order`), and lite lint. Lite scanner (same family as yamllint-lab / shellcheck-lab) — **never runs jsonlint CLI**, no network.

This is **not** the jsonlint CLI. Documented heuristics only. Users may paste source that references jsonlint — this plugin does not depend on or execute that binary. `JSON.parse` may be used for lite validation only.

## Tools

| Tool | Purpose |
|------|---------|
| `jsonlint_modes_list` | Modes compact / pretty / validate / quiet → `[{name?}]` |
| `jsonlint_options_hint` | `--compact` / `--in-place` / `--quiet` / `--indent` / `--validate` / `-c` / `-i` / `-q` → `[{method, count}]` |
| `jsonlint_sort_hint` | `--sort-keys` / `sortKeys` / `sorted` / `key order` → `[{method, count}]` |
| `jsonlint_lint_lite` | trailing_comma, single_quotes, empty_file, duplicate_keys_heuristic, comments_in_json → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, or jsonlint CLI execution for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full JSON AST / jsonlint CLI. Supported loosely: `#` / `//` / `/* */` comments stripped for instruction / config keyword counts; simple `'/"/` string literals; common jsonlint / JSON keywords.
- Does not run jsonlint CLI and does not talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/jsonlint-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/jsonlint-lab`

## Skills

- **jsonlint-modes** — list modes and option / sort method counts from pasted CLI/config
- **jsonlint-lint** — lite heuristic findings for JSON smells

## License

MIT © Lawrence Hutchins — FREE
