---
name: cap-app-plugins
description: >
  Extract Capacitor appId / appName / webDir and the plugins object keys from
  capacitor.config text with the local zero-auth capacitor-config-lab MCP.
  No capacitor binary or network.
version: 1.0.0
tags: [capacitor, capacitor.config, appId, plugins, developer-tools]
---

# Capacitor appId & plugins

When the user pastes **capacitor.config** (JSON / JS / TS) and needs identity or plugin inventory:

1. **`cap_app_id`** — `{ text }` → `{ appId?, appName?, webDir?, bundledWebRuntime? }`.
2. **`cap_plugins_list`** — `{ text }` → `{ plugins: string[], count, pluginConfig? }`.

## Example prompts

- "What is the Capacitor appId and webDir?"
- "List plugins from this capacitor.config.ts"
- "Is bundledWebRuntime set?"
