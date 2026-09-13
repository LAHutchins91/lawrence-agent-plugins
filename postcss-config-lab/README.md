# PostCSS Config Lab

Zero-auth **local** MCP tools for **postcss config text**: list plugins, syntax/parser/stringifier, source-map / from / to, and heuristic lite lint. No `postcss` binary. No network. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **PostCSS config text** workflows — plugin inventory from object keys or arrays, syntax/parser/stringifier hints, map/from/to options, and quick educational smell heuristics without invoking PostCSS.

## Tools

| Tool | Purpose |
|------|---------|
| `postcss_plugins_list` | postcss config text → `{ plugins: string[], count }` |
| `postcss_syntax_hint` | postcss config text → `{ syntax?, parser?, stringifier? }` |
| `postcss_map_options` | postcss config text → `{ map?, from?, to? }` |
| `postcss_lint_lite` | postcss config text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never runs PostCSS, never opens files on disk or over the network.
- Prefer **JSON/JSONC** (`postcss.config.json`, `.postcssrc`, `.postcssrc.json`). `postcss.config.js` / `.cjs` / `.mjs` / `.ts` text uses **best-effort regex heuristics (no eval)** — spreads, computed keys, `require()` resolution, and function-returned dynamic configs are not fully resolved.
- Plugin names come from `plugins` **object keys** or **array** entries (strings, `[name, options]` tuples, and call/require heuristics).
- If paste is a full `package.json`, the `"postcss"` key is unwrapped when present.
- Lint rules are educational heuristics (empty, missing plugins, autoprefixer without browserslist tip, deprecated plugins, JS no-eval limits, package.json unwrap) — **not** an exploit guide.

## Start

```bash
node /workspace/postcss-config-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/postcss-config-lab`

## Skills

- **postcss-plugins-syntax** — plugins list + syntax/parser/stringifier
- **postcss-map-lint** — map/from/to + lite lint

## License

MIT © Lawrence Hutchins
