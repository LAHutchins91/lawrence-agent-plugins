# Tailwind Config Lab

Zero-auth **local** MCP tools for scanning pasted `tailwind.config.*` text: content globs, `theme.extend` keys, plugins list, and lite lint. Lite JS config scanner only (`module.exports` / `export default` / plain object) — no `tailwindcss` binary for tool logic, no resolve/run, no network.

This is **not** the Tailwind CLI and **not** a full AST (no Babel/TypeScript parser): common `content`, `theme.extend`, `plugins`, `purge` (v2 leftover), and `darkMode` shapes are supported. Spreads are not expanded; `require()` / import expressions are captured as raw call text only.

## Tools

| Tool | Purpose |
|------|---------|
| `tw_content_globs` | → `{globs: [string]}` from `content: […]` |
| `tw_theme_extend_keys` | → `{keys: [string]}` from `theme.extend` object keys (colors, spacing, …) |
| `tw_plugins_list` | → `{plugins: [{nameOrCall}]}` from `plugins: [require(…), …]` |
| `tw_lint_lite` | empty content, missing content, purge leftover (v2), darkMode missing note when class: used heuristically → `{findings[]}` |

## Limits

- Pasted Tailwind config text you already have. No sockets, DNS, remote fetches, or Tailwind CLI for tool logic (`npx tailwindcss` never run by tools).
- Input capped at ~1MB (`1048576` characters).
- **Lite JS scanner**: `//` and `/* */` comments stripped loosely; simple `'…'` / `"…"` / `` `…` `` strings; labeled keys only when written literally. Prefers `module.exports = {…}` / `export default {…}` option objects when present. Not a full language parser — no AST, no spreads resolved, no imported values, no `require()` executed.
- Unusual formatting may be missed. Documented heuristics only — not `tailwindcss`.
- FREE MIT.

## Start

```bash
node /workspace/tailwind-config-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/tailwind-config-lab`

## Skills

- **tw-content** — list content globs, theme.extend keys, and plugins from pasted config
- **tw-lint** — lite heuristic findings on pasted Tailwind config

## License

MIT © Lawrence Hutchins — FREE
