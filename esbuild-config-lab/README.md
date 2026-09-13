# Esbuild Config Lab

Zero-auth **local** MCP tools for scanning pasted esbuild build options / config text: entryPoints, loader map, external list, and lite lint. Lite JS/TS config scanner only (`build({…})` or exported options) — no `esbuild` binary for tool logic, no resolve/run, no network.

This is **not** the esbuild CLI and **not** a full AST (no Babel/TypeScript parser): common `build({ entryPoints, loader, external, outfile, outdir, bundle, format, platform, minify, sourcemap })` shapes are supported. Spreads are not expanded; path expressions are captured as raw text only.

## Tools

| Tool | Purpose |
|------|---------|
| `esbuild_entry_points` | → `{entries: [{name?, path}]}` from `entryPoints` string / array / object |
| `esbuild_loaders_map` | → `{loaders: [{ext, loader}]}` from `loader: { '.png': 'file', … }` |
| `esbuild_external_list` | → `{external: [string]}` from `external: […]` |
| `esbuild_lint_lite` | missing outfile/outdir, `bundle: false` + multiple entries, format missing when platform browser, minify without sourcemap note → `{findings[]}` |

## Limits

- Pasted esbuild config / build-options text you already have. No sockets, DNS, remote fetches, or esbuild CLI for tool logic (`npx esbuild` never run by tools).
- Input capped at ~1MB (`1048576` characters).
- **Lite JS/TS scanner**: `//` and `/* */` comments stripped loosely; simple `'…'` / `"…"` / `` `…` `` strings; labeled keys only when written literally. Prefers `build({…})` / `esbuild.build({…})` option objects when present. Not a full language parser — no AST, no spreads resolved, no imported values.
- Unusual formatting may be missed. Documented heuristics only — not `esbuild.build()`.
- FREE MIT.

## Start

```bash
node /workspace/esbuild-config-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/esbuild-config-lab`

## Skills

- **esbuild-entry** — list entryPoints, loader map, and external packages from pasted config
- **esbuild-lint** — lite heuristic findings on pasted esbuild config

## License

MIT © Lawrence Hutchins — FREE
