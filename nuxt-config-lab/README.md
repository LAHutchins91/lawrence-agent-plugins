# Nuxt Config Lab

Zero-auth **local** MCP tools for scanning pasted `nuxt.config.*` text: modules, runtimeConfig keys, routeRules path hints, and lite lint. Lite JS/TS config scanner only (`defineNuxtConfig` / `module.exports` / `export default` / plain object) — no `nuxt` binary for tool logic, no resolve/run, no network.

This is **not** the Nuxt CLI and **not** a full AST (no Babel/TypeScript parser): common `modules`, `runtimeConfig`, `routeRules`, `ssr`, and `nitro.preset` shapes are supported. Spreads are not expanded; `require()` / import expressions are not executed. Function-form `defineNuxtConfig(() => ({…}))` may only partially extract when returns are non-literal.

## Tools

| Tool | Purpose |
|------|---------|
| `nuxt_modules_list` | → `{modules: [{nameOrPath}]}` from `modules: […]` (string or `[path, options]` tuples) |
| `nuxt_runtime_config_keys` | → `{keys: [{key, scope: public\|private}]}` from `runtimeConfig` / `runtimeConfig.public` |
| `nuxt_route_rules_hint` | → `{rules: [{path, ruleKeys[]}]}` from `routeRules` object keys |
| `nuxt_lint_lite` | `ssr: false` note, empty modules, missing `runtimeConfig.public`, nitro preset hints if present → `{findings[]}` |

## Limits

- Pasted Nuxt config text you already have. No sockets, DNS, remote fetches, or Nuxt CLI for tool logic (`npx nuxi` / `nuxt` never run by tools).
- Input capped at ~1MB (`1048576` characters).
- **Lite JS/TS scanner**: `//` and `/* */` comments stripped loosely; simple `'…'` / `"…"` / `` `…` `` strings; labeled keys only when written literally. Prefers `defineNuxtConfig({…})` / `module.exports = {…}` / `export default {…}` option objects when present. Dynamic/imported module lists and computed `routeRules` keys are not resolved.
- Unusual formatting may be missed. Documented heuristics only — not `nuxt`.
- FREE MIT.

## Start

```bash
node /workspace/nuxt-config-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/nuxt-config-lab`

## Skills

- **nuxt-modules** — list modules, runtimeConfig keys, and routeRules from pasted config
- **nuxt-lint** — lite heuristic findings on pasted Nuxt config

## License

MIT © Lawrence Hutchins — FREE
