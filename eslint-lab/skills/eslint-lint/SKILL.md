---
name: eslint-lint
description: >
  Lite-lint pasted ESLint config for many rules set to off, missing
  extends/recommended, empty content, overrides missing files, and conflicting
  semi/quotes rule hints. Local string heuristics only; never runs eslint CLI
  and never fetches files.
version: 1.0.0
tags: [eslint, eslintrc, lint, local]
---

# ESLint lite lint

Use **`eslint_lint_lite`** with pasted `source`. It reports:

- `rule_off_all` (warning)
- `missing_extends` (info)
- `empty_file` (warning)
- `override_without_files` (warning)
- `conflicting_semi_quotes_hint` (info)

This is not ESLint and does not lint application code. Do not fetch URLs or run eslint CLI.

## Example prompts

- "Are too many rules turned off in this config?"
- "Does this config lack extends or eslint:recommended?"
- "Does any override lack a files glob?"
