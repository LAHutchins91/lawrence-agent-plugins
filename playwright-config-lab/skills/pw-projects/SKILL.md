---
name: pw-projects
description: >
  Parse pasted playwright.config.* text locally with zero-auth MCP tools:
  list projects (name + browserName), unique browsers, and webServer
  command/url/reuse hints. Lite JS/TS scanner — not Playwright CLI. No network,
  no playwright binary.
version: 1.0.0
tags: [playwright, playwright.config, projects, browsers, webServer, parse, local]
---

# Playwright projects

Use these tools when the user pastes playwright.config.* text (never fetch a remote config, never run playwright):

1. **`pw_projects_list`** with `configText` — → `{projects: [{name, browserName?}]}` from `projects: […]`.
2. **`pw_browsers_list`** with `configText` — → `{browsers: [chromium|firefox|webkit|…]}` unique engines.
3. **`pw_webserver_hint`** with `configText` — → `{webServers: [{command?, url?, reuseExistingServer?}]}`.

Lite JS/TS scanner. Input cap ~1MB. Documented limitations apply (not Playwright CLI, no full AST).

## Example prompts

- "Which projects and browsers does this playwright.config.ts declare?"
- "List unique browsers from this pasted Playwright config."
- "What webServer command/url does this config use?"
