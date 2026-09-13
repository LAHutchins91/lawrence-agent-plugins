---
name: pw-pages
description: "List Page Object / class-style page definitions (Page/POM classes, export const *Page helpers) and getByRole / getByText / getByTestId / getByLabel / getByPlaceholder / .locator( / page.locator counts from pasted Playwright JS/TS. Local only — never runs Playwright or launches a browser, no fetch."
version: 1.0.0
tags: [playwright, pom, page-object, local]
---

# Playwright pages & locators

Use these tools when the user pastes Playwright POM JS/TS text (never fetch a remote file, never run Playwright/browser):

1. **`pw_pages_list`** with `source` — → `{pages: [{name?, kind}], count}`.
2. **`pw_locators_hint`** with `source` — → `{locators: [{method, count}], count}`.

Lite JS/TS scanner. Input cap ~1MB. Documented limitations apply (not the Playwright runtime; no browser; no network).

## Example prompts

- "Which Page Object classes does this file define?"
- "How many getByRole vs .locator calls are in this file?"
- "List export const *Page helpers."
