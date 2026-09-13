# Astro Config Lab

Zero-auth **local** MCP tools for **astro.config text**: list integrations, output/adapter/site/base/trailingSlash, nested vite summary, and heuristic lite lint. No `astro` binary. No network. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Astro config text** workflows — integration inventory from `integrations: [...]`, deploy mode fields, nested `vite` hints, and quick educational smell heuristics without invoking Astro.

## Tools

| Tool | Purpose |
|------|---------|
| `astro_integrations_list` | astro.config text → `{ integrations: string[], count }` |
| `astro_output_mode` | astro.config text → `{ output?, adapter?, site?, base?, trailingSlash? }` |
| `astro_vite_hint` | astro.config text → `{ vite?: { plugins?, server?, build?, keys } }` |
| `astro_lint_lite` | astro.config text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never runs Astro, never opens files on disk or over the network.
- `astro.config.mjs` / `.ts` / `.js` text uses **best-effort regex heuristics (no eval)** around `defineConfig` / `export default` — spreads, computed keys, dynamic imports, and function-returned configs are not fully resolved.
- Integration names come from `integrations` **array** entries (strings, call expressions like `react()`, and require heuristics).
- Lint rules are educational heuristics (empty, server without adapter, sitemap missing site, experimental flags, JS no-eval limits) — **not** an exploit guide.

## Start

```bash
node /workspace/astro-config-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/astro-config-lab`

## Skills

- **astro-integrations-output** — integrations list + output/adapter/site/base
- **astro-vite-lint** — vite hint + lite lint

## License

MIT © Lawrence Hutchins
