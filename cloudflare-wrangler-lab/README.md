# Cloudflare Wrangler Lab

Zero-auth **local** MCP tools for **wrangler.toml text**: Worker identity (name/main), routes inventory, binding name/id hints, and heuristic lite lint. No `wrangler` CLI. No network. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **wrangler.toml** workflows — listing name/main/routes/bindings and educational smell heuristics without invoking the Wrangler CLI.

## Tools

| Tool | Purpose |
|------|---------|
| `wrangler_name_main` | wrangler.toml text → `{ name?, main?, compatibility_date?, compatibility_flags?, account_id?, workers_dev? }` |
| `wrangler_routes_list` | wrangler.toml text → `{ routes, count }` |
| `wrangler_bindings_hint` | wrangler.toml text → `{ kv_namespaces?, r2_buckets?, d1_databases?, vars?, secrets_hint?, services?, durable_objects? }` |
| `wrangler_lint_lite` | wrangler.toml text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never runs Wrangler, never opens files on disk or over the network.
- Best-effort TOML subset (+ regex fallback); not a full TOML 1.0 parser. Exotic constructs may be missed.
- Binding hints return **names/ids only** — secret values are never echoed.
- Lint rules are educational heuristics (empty, missing name/main/compatibility_date, plaintext secrets in `[vars]`, outdated compatibility_date tip) — **not** an exploit guide.

## Start

```bash
node /workspace/cloudflare-wrangler-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/cloudflare-wrangler-lab`

## Skills

- **wrangler-name-routes** — name/main + routes list
- **wrangler-bindings-lint** — binding names/ids + lite lint

## License

MIT © Lawrence Hutchins
