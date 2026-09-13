---
name: cap-server-lint
description: "Extract Capacitor server URL / cleartext / allowNavigation / schemes and run educational heuristic lite lint on capacitor.config text with the local zero-auth capacitor-config-lab MCP. No capacitor binary, no network."
version: 1.0.0
tags: [capacitor, capacitor.config, server, cleartext, lint, developer-tools]
---

# Capacitor server & lite lint

When the user wants live-reload / scheme inventory or a smell-check of pasted Capacitor config text:

1. **`cap_server_url_hint`** — `{ text }` → `{ server?: { url?, cleartext?, allowNavigation? }, androidScheme?, iosScheme? }`.
2. **`cap_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty config, missing appId/webDir, cleartext true tip,
     localhost server in prod smell, JS no-eval limits. Not an exploit guide.

## Example prompts

- "What server.url and schemes are in this Capacitor config?"
- "Lite-lint this capacitor.config.json"
- "Is cleartext or localhost set for production?"
