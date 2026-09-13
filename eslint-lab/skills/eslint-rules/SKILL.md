---
name: eslint-rules
description: >
  List ESLint rule ids/severities and count extends/plugin:/recommended and
  overrides/files/parserOptions/env/plugins/ignorePatterns hints from pasted
  .eslintrc* / eslint.config.* text. Local string heuristics only; never runs
  eslint CLI and never fetches files.
version: 1.0.0
tags: [eslint, eslintrc, rules, extends, overrides, local]
---

# ESLint rules, extends, and overrides

Use these tools only with source the user pasted:

1. **`eslint_rules_list`** — `{rules: [{id?, severity?}], count, notes}`.
2. **`eslint_extends_hint`** — `{extends: [{method, count}], count, notes}`.
3. **`eslint_overrides_hint`** — `{overrides: [{method, count}], count, notes}`.

Do not fetch URLs, resolve configs, evaluate config modules, or run eslint CLI. Input cap ~1MB.

## Example prompts

- "Which ESLint rules appear in this .eslintrc?"
- "Does this config extend airbnb or eslint:recommended?"
- "Which overrides, env, or ignorePatterns keys appear here?"
