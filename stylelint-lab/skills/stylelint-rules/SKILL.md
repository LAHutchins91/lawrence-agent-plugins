---
name: stylelint-rules
description: >
  List Stylelint rule ids/severities and count extends/stylelint-config-/standard/
  prettier/recommended and overrides/files/customSyntax/plugins/ignoreFiles/
  defaultSeverity hints from pasted .stylelintrc* / stylelint.config.* text. Local
  string heuristics only; never runs stylelint CLI and never fetches files.
version: 1.0.0
tags: [stylelint, stylelintrc, rules, extends, overrides, local]
---

# Stylelint rules, extends, and overrides

Use these tools only with source the user pasted:

1. **`stylelint_rules_list`** — `{rules: [{id?, severity?}], count, notes}`.
2. **`stylelint_extends_hint`** — `{extends: [{method, count}], count, notes}`.
3. **`stylelint_overrides_hint`** — `{overrides: [{method, count}], count, notes}`.

Do not fetch URLs, resolve configs, evaluate config modules, or run stylelint CLI. Input cap ~1MB.

## Example prompts

- "Which Stylelint rules appear in this .stylelintrc?"
- "Does this config extend stylelint-config-standard or prettier?"
- "Which overrides, customSyntax, or ignoreFiles keys appear here?"
