---
name: yamllint-rules
description: >
  List known yamllint rule names and extends / ignore method counts
  (extends: default / relaxed / /path; ignore: / ignore-from-file: /
  yamllint disable / disable-line / disable-next-line) from pasted
  YAML / .yamllint config. Local only — never runs yamllint CLI, no fetch.
version: 1.0.0
tags: [yamllint, yaml, rules, extends, ignores, local]
---

# yamllint rules, extends & ignores

Use these tools when the user pastes YAML or .yamllint config/CI (never fetch a remote file, never run yamllint CLI):

1. **`yamllint_rules_list`** with `source` — → `{rules: [{id?}], count}`.
2. **`yamllint_extends_hint`** with `source` — → `{extends: [{method, count}], count}`.
3. **`yamllint_ignores_hint`** with `source` — → `{ignores: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Documented limitations apply (not yamllint CLI; no network).

## Example prompts

- "Which yamllint rule names appear in this .yamllint config?"
- "Does this use extends: default / relaxed / a path?"
- "What ignore: / ignore-from-file: / yamllint disable directives appear here?"
