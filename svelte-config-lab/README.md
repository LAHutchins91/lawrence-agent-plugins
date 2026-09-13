# Svelte Config Lab

Zero-auth **local** MCP tools for scanning pasted `svelte.config.*` text: preprocess list, SvelteKit adapter hint, vite/kit.vite plugins, and lite lint. Lite JS/TS config scanner only (`const config` / `module.exports` / `export default` / `defineConfig` / plain object) — no `svelte` / `vite` / `svelte-kit` binary for tool logic, no resolve/run, no network.

This is **not** the Svelte CLI / SvelteKit CLI and **not** a full AST (no Babel/TypeScript parser): common `preprocess`, `kit.adapter`, `vite.plugins` / `kit.vite.plugins`, `kit.csrf` / `checkOrigin`, and `kit.alias` shapes are supported. Spreads are not expanded; `require()` / import expressions are not executed. Function-form `export default () => ({…})` may only partially extract when returns are non-literal.

## Tools

| Tool | Purpose |
|------|---------|
| `svelte_preprocess_list` | → `{preprocess: [{nameOrCall}]}` from `preprocess: […]` or a single `vitePreprocess()` (or other) call |
| `svelte_kit_adapter_hint` | → `{adapterCall?, notes}` from `kit.adapter` |
| `svelte_vite_plugins_hint` | → `{plugins: [{nameOrCall}]}` from `vite.plugins` / `kit.vite.plugins` heuristics |
| `svelte_lint_lite` | missing `kit.adapter` for SvelteKit, empty preprocess, csrf/checkOrigin notes if present, alias hints → `{findings[]}` |

## Limits

- Pasted Svelte config text you already have. No sockets, DNS, remote fetches, or Svelte/Vite CLI for tool logic (`npx svelte-kit` / `vite` / `svelte` never run by tools).
- Input capped at ~1MB (`1048576` characters).
- **Lite JS/TS scanner**: `//` and `/* */` comments stripped loosely; simple `'…'` / `"…"` / `` `…` `` strings; labeled keys only when written literally. Prefers `const config = {…}` / `module.exports = {…}` / `export default {…}` / `defineConfig({…})` option objects when present. Dynamic/imported preprocess lists and computed keys are not resolved.
- Unusual formatting may be missed. Documented heuristics only — not `svelte` / `vite`.
- FREE MIT.

## Start

```bash
node /workspace/svelte-config-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/svelte-config-lab`

## Skills

- **svelte-adapter** — list preprocess, kit.adapter, and vite/kit.vite plugins from pasted config
- **svelte-lint** — lite heuristic findings on pasted Svelte config

## License

MIT © Lawrence Hutchins — FREE
