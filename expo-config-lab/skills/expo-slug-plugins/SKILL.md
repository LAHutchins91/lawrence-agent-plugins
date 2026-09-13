---
name: expo-slug-plugins
description: >
  Extract Expo name/slug/version metadata and the plugins array from app.json
  or app.config text with the local zero-auth expo-config-lab MCP. No expo
  binary or network.
version: 1.0.0
tags: [expo, app.json, app.config, plugins, slug, developer-tools]
---

# Expo slug & plugins

When the user pastes **app.json** / **app.config** and needs project identity or config plugins:

1. **`expo_slug_name`** — `{ text }` → `{ name?, slug?, version?, orientation?, sdkVersion?, owner? }`.
2. **`expo_plugins_list`** — `{ text }` → `{ plugins: (string|object)[], names: string[], count }`.

## Example prompts

- "What is the Expo slug and name in this app.json?"
- "List config plugins from this app.config.js"
- "Which Expo SDK version is declared?"
