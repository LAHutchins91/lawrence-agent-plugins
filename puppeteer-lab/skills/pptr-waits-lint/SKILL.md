---
name: pptr-waits-lint
description: >
  Extract Puppeteer wait helpers and run educational heuristic lite lint on
  script JS/TS text with the local zero-auth puppeteer-lab MCP. No
  puppeteer/browser runtime, no network.
version: 1.0.0
tags: [puppeteer, waits, lint, developer-tools]
---

# Puppeteer waits & lite lint

When the user wants wait inventory or a smell-check of pasted Puppeteer source:

1. **`pptr_wait_hint`** — `{ text }` → `{ waits: [{kind}], count }` for `waitForSelector` / `waitForNavigation` / `waitForTimeout` / `waitForFunction` / etc.
2. **`pptr_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, `waitForTimeout` anti-pattern tip, missing close/disconnect tip,
     networkidle tips, headless defaults tip, etc. Not an exploit guide.

## Example prompts

- "What waits appear in this Puppeteer script?"
- "Lite-lint this Puppeteer file"
- "Any waitForTimeout or missing browser.close?"
