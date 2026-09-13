# Prettier Config Lab

Zero-auth **local** MCP tools for **Prettier config text**: summarize core options, list `overrides`, list `plugins`, and heuristic lite lint. Prefer robust **JSONC**; YAML via the `yaml` package; `prettier.config.js` / `.prettierrc.js` use **best-effort string heuristics** (no eval). No `prettier` binary, no network. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Prettier config text** workflows — options inventory, overrides/plugins extraction, and quick educational smell heuristics without invoking Prettier.

## Tools

| Tool | Purpose |
|------|---------|
| `prettier_options_summary` | config text → `{ options, keys }` |
| `prettier_overrides_list` | config text → `{ overrides:[{files?, options?}], count }` |
| `prettier_plugins_list` | config text → `{ plugins, count }` |
| `prettier_lint_lite` | config text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never runs `prettier`, never opens configs on disk or over the network.
- JSONC: strips `//` and `/* */` then `JSON.parse` (also unwraps `package.json` `"prettier"` key).
- YAML: `.prettierrc.yml`-style mappings via `yaml`.
- **JS limits**: regex/balanced-extract heuristics for options, `plugins`, `overrides` — no eval, no `require` resolution, no spreads/computed keys.
- Lint rules are educational heuristics (empty config, useTabs+tabWidth, printWidth extremes, trailingComma smells, deprecated keys, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/prettier-config-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/prettier-config-lab`

## Skills

- **prettier-options-overrides** — options summary + overrides list
- **prettier-plugins-lint** — plugins list + lite lint

## License

MIT © Lawrence Hutchins
