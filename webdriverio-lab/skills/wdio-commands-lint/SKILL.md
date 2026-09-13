---
name: wdio-commands-lint
description: >
  Extract common WebdriverIO browser./element. commands and run educational
  heuristic lite lint on JS/TS text with the local zero-auth webdriverio-lab
  MCP. No wdio/browser/WebDriver runtime, no network.
version: 1.0.0
tags: [webdriverio, wdio, commands, lint, developer-tools]
---

# WebdriverIO commands & lite lint

When the user wants command inventory or a smell-check of pasted WDIO source:

1. **`wdio_commands_hint`** — `{ text }` → `{ commands: [{name}], count }` for `url` / `click` / `setValue` / `getText` / `waitUntil` / `pause` / etc.
2. **`wdio_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, `browser.pause` anti-pattern tip, XPath overuse tip,
     missing `waitUntil` tip, sync mode deprecated tip, etc. Not an exploit guide.

## Example prompts

- "What browser commands appear in this WDIO spec?"
- "Lite-lint this WebdriverIO file"
- "Any browser.pause or sync mode leftovers?"
