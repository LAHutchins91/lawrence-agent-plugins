# Next Config Lab

Zero-auth **local** MCP tools for scanning pasted `next.config.*` text: rewrites, redirects, image domains / remotePatterns hostnames, and lite lint. Lite JS config scanner only (`module.exports` / `export default` / plain object, plus common `async rewrites()` / `async redirects()` return arrays) — no `next` binary for tool logic, no resolve/run, no network.

This is **not** the Next.js CLI and **not** a full AST (no Babel/TypeScript parser): common `rewrites`, `redirects`, `images`, `reactStrictMode`, and `experimental` shapes are supported. Async functions may only partially extract when return bodies are non-literal. Spreads are not expanded; `require()` / import expressions are not executed.

## Tools

| Tool | Purpose |
|------|---------|
| `next_rewrites_list` | → `{rewrites: [{source, destination}]}` from `rewrites: […]` or `async rewrites() { return […] }` |
| `next_redirects_list` | → `{redirects: [{source, destination, permanent?}]}` from `redirects` |
| `next_images_domains` | → `{domains: [string]}` from `images.domains` / `images.remotePatterns` hostname hints |
| `next_lint_lite` | reactStrictMode missing/false, images.unoptimized true note, experimental flags present (info), empty rewrites → `{findings[]}` |

## Limits

- Pasted Next.js config text you already have. No sockets, DNS, remote fetches, or Next CLI for tool logic (`npx next` never run by tools).
- Input capped at ~1MB (`1048576` characters).
- **Lite JS scanner**: `//` and `/* */` comments stripped loosely; simple `'…'` / `"…"` / `` `…` `` strings; labeled keys only when written literally. Prefers `module.exports = {…}` / `export default {…}` option objects when present. Async `rewrites()` / `redirects()` return arrays (including `{ beforeFiles, afterFiles, fallback }` object shapes) are scanned heuristically — dynamic/fetched entries are not resolved.
- Unusual formatting may be missed. Documented heuristics only — not `next`.
- FREE MIT.

## Start

```bash
node /workspace/next-config-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/next-config-lab`

## Skills

- **next-rewrites** — list rewrites, redirects, and image domains from pasted config
- **next-lint** — lite heuristic findings on pasted Next.js config

## License

MIT © Lawrence Hutchins — FREE
