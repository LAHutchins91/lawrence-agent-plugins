---
name: sel-pages
description: >
  List Page Object / class-style page definitions (Page/POM classes,
  export const *Page helpers) and By.id / By.css / By.xpath / By.name /
  By.className / By.linkText / By.partialLinkText / By.tagName /
  findElement / findElements counts from pasted Selenium JS/TS. Local
  only — never runs Selenium or launches a WebDriver/browser, no fetch.
version: 1.0.0
tags: [selenium, pom, page-object, local]
---

# Selenium pages & locators

Use these tools when the user pastes Selenium POM JS/TS text (never fetch a remote file, never run Selenium/WebDriver/browser):

1. **`sel_pages_list`** with `source` — → `{pages: [{name?, kind}], count}`.
2. **`sel_locators_hint`** with `source` — → `{locators: [{method, count}], count}`.

Lite JS/TS scanner. Input cap ~1MB. Documented limitations apply (not the Selenium runtime; no browser; no network).

## Example prompts

- "Which Page Object classes does this file define?"
- "How many By.xpath vs By.id calls are in this file?"
- "List export const *Page helpers."
