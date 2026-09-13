---
name: remix-routes-server
description: >
  Extract Remix routes / appDirectory / publicPath and server build fields from
  remix.config or vite remix({…}) text with the local zero-auth remix-config-lab
  MCP. No remix binary or network.
version: 1.0.0
tags: [remix, remix-config, routes, server-build, developer-tools]
---

# Remix routes & server build

When the user pastes **remix.config** or a Vite **remix({…})** plugin options block and needs route dirs or server build fields:

1. **`remix_routes_hint`** — `{ text }` → `{ appDirectory?, routes?, ignoredRouteFiles?, assetsBuildDirectory?, publicPath? }`.
2. **`remix_server_build_hint`** — `{ text }` → `{ serverBuildPath?, serverModuleFormat?, serverPlatform?, server?, serverBuildTarget? }`.

## Example prompts

- "What is appDirectory and ignoredRouteFiles in this remix.config.js?"
- "Where is the Remix server build path?"
- "Summarize routes options from this vite remix() plugin block"
