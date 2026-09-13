---
name: vite-alias
description: >
  Parse pasted vite.config.* text locally with zero-auth MCP tools:
  list plugins (nameOrCall), resolve.alias find/replacement map, and
  server.proxy path/target hints. Lite JS/TS scanner — not Vite CLI. No network,
  no vite binary.
version: 1.0.0
tags: [vite, vite.config, plugins, alias, proxy, parse, local]
---

# Vite alias / plugins / proxy

Use these tools when the user pastes vite.config.* text (never fetch a remote config, never run vite):

1. **`vite_plugins_list`** with `configText` — → `{plugins: [{nameOrCall}]}` from `plugins: […]`.
2. **`vite_alias_map`** with `configText` — → `{aliases: [{find, replacement}]}` object or array.
3. **`vite_server_proxy_hint`** with `configText` — → `{proxies: [{path, target?}]}`.

Lite JS/TS scanner. Input cap ~1MB. Documented limitations apply (not Vite CLI, no full AST).

## Example prompts

- "Which plugins does this vite.config.ts declare?"
- "Map resolve.alias from this pasted Vite config."
- "What server.proxy paths/targets does this config use?"
