# Stylelint Lab

Zero-auth **local** MCP tools for scanning pasted **Stylelint** configs (`.stylelintrc*`, `stylelint.config.*`): rule ids/severities, extends/stylelint-config-/standard/prettier/recommended hints, overrides/files/customSyntax/plugins/ignoreFiles/defaultSeverity hints, and lite config lint. It is a string-heuristic scanner — **never runs stylelint CLI** and never fetches network resources.

This is **not** Stylelint. It does not lint CSS, resolve configs, or evaluate JavaScript config modules.

## Tools

| Tool | Purpose |
|------|---------|
| `stylelint_rules_list` | Rule ids from pasted Stylelint config → `{rules: [{id?, severity?}], count, notes}` |
| `stylelint_extends_hint` | `extends`, `stylelint-config-`, `standard`, `prettier`, `recommended` → `{extends: [{method, count}], count, notes}` |
| `stylelint_overrides_hint` | `overrides`, `files:`, `customSyntax`, `plugins`, `ignoreFiles`, `defaultSeverity` → `{overrides: [{method, count}], count, notes}` |
| `stylelint_lint_lite` | rule_null_many, missing_extends, empty_file, override_without_files, conflicting_prettier_extends → `{findings, ok, notes}` |

## Limits

- Pasted source only; no sockets, DNS, remote fetches, config resolution, or stylelint CLI execution.
- Input capped at 1,048,576 characters (~1MB).
- Lite heuristics only. No Stylelint AST and no module evaluation.
- `ok` follows the lab convention: false only for error-severity findings; current findings are warning/info.
- FREE MIT.

## Start

```bash
node /workspace/stylelint-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/stylelint-lab`

## Skills

- **stylelint-rules** — inspect rule ids, extends hints, and overrides/customSyntax/plugins hints
- **stylelint-lint** — inspect lightweight Stylelint config lint findings

## License

MIT © Lawrence Hutchins — FREE
