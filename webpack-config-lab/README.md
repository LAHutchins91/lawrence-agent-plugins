# Webpack Config Lab

Zero-auth **local** MCP tools for **webpack config text**: extract entry/output, summarize `module.rules` loaders, list plugin constructor names, and heuristic lite lint. No `webpack` binary. No network. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **webpack.config text** workflows — entry/output inventory, loader rule summaries, plugin name lists, and quick educational smell heuristics without invoking webpack.

## Tools

| Tool | Purpose |
|------|---------|
| `wp_entry_points` | webpack config text → `{ entry, entries, mode?, output? }` |
| `wp_loaders_summary` | webpack config text → `{ rules, count }` from `module.rules` |
| `wp_plugins_list` | webpack config text → `{ plugins, count }` constructor names / require paths |
| `wp_lint_lite` | webpack config text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never runs `webpack` / `webpack-cli`, never opens files on disk or over the network.
- Prefer **JSON/JSONC**. `webpack.config.js` / `.ts` / `.mjs` text uses **best-effort regex heuristics (no eval)** — spreads, computed keys, `require()` resolution, and function-returned dynamic configs are not fully resolved.
- Plugin names come from `new Foo(...)` / `require('...')` / quoted strings inside `plugins: [...]`.
- Lint rules are educational heuristics (empty config, missing entry/output, production without `optimization`, deprecated loaders, source-map in prod, DefinePlugin secret smells, JS no-eval limits) — **not** an exploit guide.

## Start

```bash
node /workspace/webpack-config-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/webpack-config-lab`

## Skills

- **wp-entry-output** — entry points + output / mode
- **wp-loaders-plugins-lint** — loaders, plugins, lite lint

## License

MIT © Lawrence Hutchins
