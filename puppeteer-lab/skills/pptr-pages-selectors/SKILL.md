---
name: pptr-pages-selectors
description: >
  Extract Puppeteer page lifecycle actions (launch/newPage/goto/close) and
  selector APIs (click/type/$/$eval/waitForSelector) from JS/TS text with the
  local zero-auth puppeteer-lab MCP. No puppeteer/browser runtime, no network.
version: 1.0.0
tags: [puppeteer, pages, selectors, developer-tools]
---

# Puppeteer pages & selectors

When the user pastes **Puppeteer script** source and needs page/selector inventory:

1. **`pptr_pages_list`** — `{ text }` → `{ pages: [{action, url?}], count }` from `puppeteer.launch` / `browser.newPage` / `page.goto` / close.
2. **`pptr_selectors_hint`** — `{ text }` → `{ selectors: [{api, selector?}], count }` from `click` / `type` / `$` / `$eval` / `waitForSelector` / etc.

## Example prompts

- "List page.goto URLs in this Puppeteer script"
- "Which selectors does this script click or type into?"
- "Any browser.launch / newPage / close here?"
