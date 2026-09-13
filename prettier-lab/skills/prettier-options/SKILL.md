---
name: prettier-options
description: >
  List Prettier option keys and count overrides nesting and ignore-pattern
  hints from pasted .prettierrc / prettier.config.* text. Local string heuristics
  only; never runs prettier CLI and never fetches files.
version: 1.0.0
tags: [prettier, prettierrc, options, overrides, ignores, local]
---

# Prettier options, overrides, and ignores

Use these tools only with source the user pasted:

1. **`prettier_options_list`** — `{options: [{key?, value?}], count, notes}`.
2. **`prettier_overrides_hint`** — `{overrides: [{method, count}], count, notes}`.
3. **`prettier_ignores_hint`** — `{ignores: [{method, count}], count, notes}`.

Do not fetch URLs, resolve configs, evaluate config modules, or run prettier CLI. Input cap ~1MB.

## Example prompts

- "Which Prettier options appear in this .prettierrc?"
- "Does this config use overrides with files and options?"
- "Which prettier-ignore or ignorePath references appear here?"
