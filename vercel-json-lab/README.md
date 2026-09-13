# Vercel JSON Lab

Zero-auth **local** MCP tools for **vercel.json text**: rewrites, redirects, headers inventory, and heuristic lite lint. No `vercel` CLI. No network. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **vercel.json** workflows — listing rewrite/redirect/header rules and educational smell heuristics without invoking the Vercel CLI.

## Tools

| Tool | Purpose |
|------|---------|
| `vercel_rewrites_list` | vercel.json text → `{ rewrites, count }` |
| `vercel_redirects_list` | vercel.json text → `{ redirects, count }` |
| `vercel_headers_hint` | vercel.json text → `{ headers, count, keys }` |
| `vercel_lint_lite` | vercel.json text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never runs Vercel, never opens files on disk or over the network.
- Prefers JSON / JSONC parsing; non-JSON text may fail or yield empty extracts.
- Lint rules are educational heuristics (empty, trailingSlash tips, catch-all rewrite smells, missing security headers tip, builds/functions summary, deprecated `routes`) — **not** an exploit guide.

## Start

```bash
node /workspace/vercel-json-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/vercel-json-lab`

## Skills

- **vercel-rewrites-redirects** — rewrites + redirects list
- **vercel-headers-lint** — headers inventory + lite lint

## License

MIT © Lawrence Hutchins
