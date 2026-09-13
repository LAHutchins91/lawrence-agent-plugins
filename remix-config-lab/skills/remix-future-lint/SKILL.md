---
name: remix-future-lint
description: >
  Extract future flags and run educational heuristic lite lint on remix.config
  / vite remix({…}) text with the local zero-auth remix-config-lab MCP. No remix
  binary, no network.
version: 1.0.0
tags: [remix, remix-config, future, lint, developer-tools]
---

# Remix future flags & lite lint

When the user wants `future` flag inventory or a smell-check of pasted Remix config text:

1. **`remix_future_flags`** — `{ text }` → `{ future, keys }`.
2. **`remix_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty config, deprecated classic remix.config vs Vite, conflicting
     future/classic fields, missing appDirectory, JS no-eval limits. Not an exploit guide.

## Example prompts

- "Which future flags are enabled in this Remix config?"
- "Lite-lint this remix.config.js"
- "Is this still on classic Remix or Vite?"
