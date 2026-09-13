---
name: prettier-lint
description: >
  Lite-lint pasted Prettier config for conflicting singleQuote/jsxSingleQuote,
  extreme printWidth, empty content, mixed tabs/spaces hints, and overrides
  missing files. Local string heuristics only; never runs prettier CLI and never
  fetches files.
version: 1.0.0
tags: [prettier, prettierrc, lint, local]
---

# Prettier lite lint

Use **`prettier_lint_lite`** with pasted `source`. It reports:

- `conflicting_quotes` (info)
- `print_width_extreme` (info)
- `empty_file` (warning)
- `tabs_and_spaces_mixed_hint` (info)
- `override_without_files` (warning)

This is not Prettier and does not format code. Do not fetch URLs or run prettier CLI.

## Example prompts

- "Do singleQuote and jsxSingleQuote disagree in this config?"
- "Is printWidth extreme here?"
- "Does any override lack a files glob?"
