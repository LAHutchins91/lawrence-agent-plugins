# Markdownlint Lab

Zero-auth **local** MCP tools for scanning pasted **Markdown** and **markdownlint config**: `MD###` rule IDs, extends/shareable-config hints, ignore/directive hints, and lite lint. It is a string-heuristic scanner — **never runs markdownlint CLI** and never fetches network resources.

This is **not** markdownlint. It does not parse a full Markdown AST or resolve shareable configurations.

## Tools

| Tool | Purpose |
|------|---------|
| `markdownlint_rules_list` | Unique `MD###` IDs from pasted config/comments → `{rules: [{id?}], count, notes}` |
| `markdownlint_extends_hint` | `extends`, `markdownlint-config-`, and `extends:` hints → `{extends: [{method, count}], count, notes}` |
| `markdownlint_ignores_hint` | `ignores`, `ignore:`, and markdownlint disable directives → `{ignores: [{method, count}], count, notes}` |
| `markdownlint_lint_lite` | missing_h1, trailing_spaces, empty_file, broad_disable, long_line_heuristic → `{findings, ok, notes}` |

## Limits

- Pasted source only; no sockets, DNS, remote fetches, config resolution, or markdownlint CLI execution.
- Input capped at 1,048,576 characters (~1MB).
- Lite heuristics only. Fenced-code handling is best effort, and no CommonMark/Markdown AST is built.
- `ok` follows the lab convention: false only for error-severity findings; current findings are warning/info.
- FREE MIT.

## Start

```bash
node /workspace/markdownlint-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/markdownlint-lab`

## Skills

- **markdownlint-rules** — inspect rule IDs, extends references, and ignore directives
- **markdownlint-lint** — inspect lightweight Markdown lint findings

## License

MIT © Lawrence Hutchins — FREE
