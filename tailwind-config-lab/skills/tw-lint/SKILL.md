---
name: tw-lint
description: >
  Lite-lint pasted tailwind.config.* for empty content, missing content,
  purge leftover (v2), and darkMode missing note when class: used heuristically.
  Local only, no Tailwind binary for tool logic, no fetch.
version: 1.0.0
tags: [tailwind, lint, content, purge, darkMode, local]
---

# Tailwind lint

Use **`tw_lint_lite`** with `configText` on pasted Tailwind config (do not fetch URLs or run Tailwind for analysis):

- Empty `content: []` (warning)
- Missing `content` (and no `purge`) when the text looks like a Tailwind config (warning)
- `purge` leftover from Tailwind v2 (warning)
- `darkMode` missing when class-based dark mode appears used heuristically (info)

Heuristic only — not Tailwind CLI / not a full AST. Lite JS config scanner.

## Example prompts

- "Lint this Tailwind config for missing or empty content."
- "Is there a purge leftover in this pasted tailwind.config.js?"
- "Does this config need darkMode: 'class' based on class: / dark: usage?"
