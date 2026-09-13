---
name: wrangler-name-routes
description: Extract Worker name/main/compatibility_date and routes from wrangler.toml text with the local zero-auth cloudflare-wrangler-lab MCP. No wrangler CLI or network.
version: 1.0.0
tags: [cloudflare, wrangler, wrangler.toml, workers, routes, developer-tools]
---

# Wrangler name & routes

When the user pastes **wrangler.toml** and needs identity or route inventory:

1. **`wrangler_name_main`** — `{ text }` → `{ name?, main?, compatibility_date?, compatibility_flags?, account_id?, workers_dev? }`.
2. **`wrangler_routes_list`** — `{ text }` → `{ routes: [{pattern?, zone_name?, zone_id?, custom_domain?}], count }`.

## Example prompts

- "What is the Worker name and main entry?"
- "List routes from this wrangler.toml"
- "Is workers_dev enabled?"
