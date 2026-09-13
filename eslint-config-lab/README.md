# ESLint Config Lab

Zero-auth **local** MCP tools for **ESLint config text**: list `extends`, summarize `rules` severities, extract `env`/`parser`/`parserOptions`/`plugins`, and heuristic lite lint. Prefer robust **JSONC**; YAML via the `yaml` package; `.eslintrc.js` / `eslint.config.js` use **best-effort string heuristics** (no eval). No `eslint` binary, no network. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **ESLint config text** workflows — extends inventory, rules severity tallies, env/parser/plugins extraction, and quick educational smell heuristics without invoking ESLint.

## Tools

| Tool | Purpose |
|------|---------|
| `eslint_extends_list` | config text → `{ extends, count }` |
| `eslint_rules_summary` | config text → `{ rules:[{id,severity}], counts, total }` |
| `eslint_env_parser` | config text → `{ env?, parser?, parserOptions?, plugins? }` |
| `eslint_lint_lite` | config text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never runs `eslint`, never opens configs on disk or over the network.
- JSONC: strips `//` and `/* */` then `JSON.parse` (also shallow-merges flat-config JSON arrays).
- YAML: `.eslintrc.yml`-style mappings via `yaml`.
- **JS limits**: regex/balanced-extract heuristics for `extends`, `plugins`, `env`, `parser`, `parserOptions`, `rules` — no eval, no `require` resolution, no spreads/computed keys; flat multi-object merges are best-effort.
- Lint rules are educational heuristics (empty config, extends needing plugins, all rules off, recommended alone / +all, sparse config, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/eslint-config-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/eslint-config-lab`

## Skills

- **eslint-extends-rules** — extends list + rules severity summary
- **eslint-env-lint** — env/parser/plugins extraction + lite lint

## License

MIT © Lawrence Hutchins
