# Vite Config Lab

Zero-auth **local** MCP tools for scanning pasted `vite.config.*` text: plugins, resolve.alias, server.proxy hints, and lite lint. Lite JS/TS config scanner only — no `vite` binary, no resolve/run, no network.

This is **not** the Vite CLI and **not** a full AST (no Babel/TypeScript parser): common `defineConfig({ plugins, resolve.alias, server.proxy, root, base, build })` shapes are supported. Spreads are not expanded; `path.resolve(...)` replacements are captured as raw text only.

## Tools

| Tool | Purpose |
|------|---------|
| `vite_plugins_list` | → `{plugins: [{nameOrCall}]}` from `plugins: [react(), …]` |
| `vite_alias_map` | → `{aliases: [{find, replacement}]}` object or array form |
| `vite_server_proxy_hint` | → `{proxies: [{path, target?}]}` from `server.proxy` |
| `vite_lint_lite` | missing root/base notes, `server.host` true caution, empty plugins, `build.outDir` missing when build present → `{findings[]}` |

## Limits

- Pasted `vite.config.*` text you already have. No sockets, DNS, remote fetches, or Vite CLI (`npx vite` never run).
- Input capped at ~1MB (`1048576` characters).
- **Lite JS/TS scanner**: `//` and `/* */` comments stripped loosely; simple `'…'` / `"…"` / `` `…` `` strings; labeled keys only when written literally. Not a full language parser — no AST, no spreads resolved, no imported values.
- Plugin calls become `nameOrCall` like `react()`; bare identifiers keep the name. Plugins are not executed.
- Alias `path.resolve` / `fileURLToPath` expressions are **not** evaluated — captured as raw text.
- Unusual formatting may be missed. Documented heuristics only — not `vite resolveConfig`.
- FREE MIT.

## Start

```bash
node /workspace/vite-config-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/vite-config-lab`

## Skills

- **vite-alias** — list plugins, alias map, and server.proxy hints from pasted config
- **vite-lint** — lite heuristic findings on pasted vite config

## License

MIT © Lawrence Hutchins — FREE
