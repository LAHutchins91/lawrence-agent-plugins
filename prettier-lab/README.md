# Prettier Lab

Zero-auth **local** MCP tools for scanning pasted **Prettier** configs (`.prettierrc`, `prettier.config.*`) and related ignore directives: option keys, overrides/files/options nested hints, ignore-pattern hints, and lite config lint. It is a string-heuristic scanner — **never runs prettier CLI** and never fetches network resources.

This is **not** Prettier. It does not format code, resolve configs, or evaluate JavaScript config modules.

## Tools

| Tool | Purpose |
|------|---------|
| `prettier_options_list` | Option keys from pasted Prettier config → `{options: [{key?, value?}], count, notes}` |
| `prettier_overrides_hint` | `overrides`, `files:`, and `options:` nested hints → `{overrides: [{method, count}], count, notes}` |
| `prettier_ignores_hint` | `.prettierignore`, `prettier-ignore`, `# prettier-ignore`, `ignorePath` → `{ignores: [{method, count}], count, notes}` |
| `prettier_lint_lite` | conflicting_quotes, print_width_extreme, empty_file, tabs_and_spaces_mixed_hint, override_without_files → `{findings, ok, notes}` |

## Limits

- Pasted source only; no sockets, DNS, remote fetches, config resolution, or prettier CLI execution.
- Input capped at 1,048,576 characters (~1MB).
- Lite heuristics only. No Prettier AST and no module evaluation.
- `ok` follows the lab convention: false only for error-severity findings; current findings are warning/info.
- FREE MIT.

## Start

```bash
node /workspace/prettier-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/prettier-lab`

## Skills

- **prettier-options** — inspect option keys, overrides nesting, and ignore-pattern hints
- **prettier-lint** — inspect lightweight Prettier config lint findings

## License

MIT © Lawrence Hutchins — FREE
