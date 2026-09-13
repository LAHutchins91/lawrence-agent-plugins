---
name: wrangler-bindings-lint
description: >
  Extract KV/R2/D1/service/Durable Object binding names/ids and run educational
  heuristic lite lint on wrangler.toml text with the local zero-auth
  cloudflare-wrangler-lab MCP. No wrangler CLI, no network.
version: 1.0.0
tags: [cloudflare, wrangler, wrangler.toml, bindings, lint, developer-tools]
---

# Wrangler bindings & lite lint

When the user wants binding inventory or a smell-check of pasted wrangler.toml:

1. **`wrangler_bindings_hint`** — `{ text }` → `{ kv_namespaces?, r2_buckets?, d1_databases?, vars?, secrets_hint?, services?, durable_objects? }` (names/ids only, never secret values).
2. **`wrangler_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty config, missing name/main/compatibility_date,
     plaintext secrets in [vars], outdated compatibility_date tip.
     Not an exploit guide.

## Example prompts

- "What KV / R2 / D1 bindings are in this wrangler.toml?"
- "Lite-lint this wrangler.toml"
- "Are there plaintext secrets in [vars]?"
