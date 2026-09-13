---
name: stylelint-lint
description: >
  Lite-lint pasted Stylelint config for many rules set to null, missing
  extends/recommended, empty content, overrides missing files, and
  stylelint-config-prettier with formatting rules still on. Local string
  heuristics only; never runs stylelint CLI and never fetches files.
version: 1.0.0
tags: [stylelint, stylelintrc, lint, local]
---

# Stylelint lite lint

Use **`stylelint_lint_lite`** with pasted `source`. It reports:

- `rule_null_many` (warning)
- `missing_extends` (info)
- `empty_file` (warning)
- `override_without_files` (warning)
- `conflicting_prettier_extends` (info)

This is not Stylelint and does not lint CSS. Do not fetch URLs or run stylelint CLI.

## Example prompts

- "Are too many rules set to null in this config?"
- "Does this config lack extends or stylelint-config-standard?"
- "Does any override lack a files glob?"
- "Is stylelint-config-prettier conflicting with formatting rules?"
