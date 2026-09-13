---
name: slugify-text
description: "Slugify text and convert/detect camel, snake, kebab, pascal, title case — zero-auth, local only, no network."
version: 1.0.0
tags: [slugify, case, camel, snake, kebab, convert]
---

# Slugify & case

When the user needs a URL slug or case conversion:

1. Call **`slugify`** with `text` (optional `separator`, `lower`) → `{slug}`.
2. Call **`case_convert`** with `text` + `target` (`camel|snake|kebab|pascal|title`) → `{result, fromGuess?}`.
3. Call **`case_detect`** with `text` → `{case, confidence}`.
4. Report structured JSON only. Never claim network or file I/O.

## Example prompts

- "Slugify this title for a URL"
- "Convert myVariableName to snake_case"
- "What case is this string?"
