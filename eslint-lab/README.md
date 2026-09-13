# ESLint Lab

Zero-auth **local** MCP tools for scanning pasted **ESLint** configs (`.eslintrc*`, `eslint.config.*`): rule ids/severities, extends/plugin:/eslint:recommended/airbnb/next hints, overrides/files/parserOptions/env/plugins/ignorePatterns hints, and lite config lint. It is a string-heuristic scanner — **never runs eslint CLI** and never fetches network resources.

This is **not** ESLint. It does not lint code, resolve configs, or evaluate JavaScript config modules.

## Tools

| Tool | Purpose |
|------|---------|
| `eslint_rules_list` | Rule ids from pasted ESLint config → `{rules: [{id?, severity?}], count, notes}` |
| `eslint_extends_hint` | `extends`, `plugin:`, `eslint:recommended`, `airbnb`, `next` → `{extends: [{method, count}], count, notes}` |
| `eslint_overrides_hint` | `overrides`, `files:`, `parserOptions`, `env`, `plugins`, `ignorePatterns` → `{overrides: [{method, count}], count, notes}` |
| `eslint_lint_lite` | rule_off_all, missing_extends, empty_file, override_without_files, conflicting_semi_quotes_hint → `{findings, ok, notes}` |

## Limits

- Pasted source only; no sockets, DNS, remote fetches, config resolution, or eslint CLI execution.
- Input capped at 1,048,576 characters (~1MB).
- Lite heuristics only. No ESLint AST and no module evaluation.
- `ok` follows the lab convention: false only for error-severity findings; current findings are warning/info.
- FREE MIT.

## Start

```bash
node /workspace/eslint-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/eslint-lab`

## Skills

- **eslint-rules** — inspect rule ids, extends hints, and overrides/env/plugins hints
- **eslint-lint** — inspect lightweight ESLint config lint findings

## License

MIT © Lawrence Hutchins — FREE
