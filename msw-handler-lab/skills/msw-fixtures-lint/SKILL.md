---
name: msw-fixtures-lint
description: >
  Extract MSW response fixtures (HttpResponse / ctx.*) and run educational
  heuristic lite lint on JS/TS text with the local zero-auth msw-handler-lab MCP.
  No msw runtime, no network.
version: 1.0.0
tags: [msw, fixtures, lint, mock-service-worker, developer-tools]
---

# MSW fixtures & lite lint

When the user wants fixture inventory or a smell-check of pasted MSW handler source:

1. **`msw_fixtures_hint`** — `{ text }` → `{ fixtures: [{kind, on?}], count }` for `HttpResponse.json/text/xml` and `ctx.json/text/...`.
2. **`msw_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing setupWorker/setupServer tip, wildcard path overuse,
     passthrough tips, rest legacy tip, etc. Not an exploit guide.

## Example prompts

- "What HttpResponse fixtures appear in these handlers?"
- "Lite-lint this MSW handlers file"
- "Any wildcard path overuse or missing setupServer?"
