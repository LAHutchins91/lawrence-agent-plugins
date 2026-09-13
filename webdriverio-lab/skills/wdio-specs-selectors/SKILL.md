---
name: wdio-specs-selectors
description: >
  Extract WebdriverIO Mocha-style specs/hooks (or config specs: paths) and
  selector APIs ($/$$/browser.$/custom$) from JS/TS text with the local
  zero-auth webdriverio-lab MCP. No wdio/browser/WebDriver runtime, no network.
version: 1.0.0
tags: [webdriverio, wdio, specs, selectors, developer-tools]
---

# WebdriverIO specs & selectors

When the user pastes **WebdriverIO** source and needs specs/selector inventory:

1. **`wdio_specs_list`** — `{ text }` → `{ specs: [{kind, title?}], count }` from `describe` / `it` / `before`/`after` hooks, or config `specs:` array.
2. **`wdio_selectors_hint`** — `{ text }` → `{ selectors: [{api, selector?}], count }` from `$('...')` / `$$(` / `browser.$` / `custom$`.

## Example prompts

- "List describe/it blocks in this WDIO spec"
- "Which $ / $$ selectors does this use?"
- "What paths are in the wdio.conf specs array?"
