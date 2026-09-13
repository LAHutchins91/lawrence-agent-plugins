---
name: shellcheck-rules
description: >
  List SC#### rule ids and disable / config method counts
  (disable= / enable= / # shellcheck disable / exclude=;
  .shellcheckrc / --severity / --shell / --format /
  external-sources / source-path) from pasted shell / ShellCheck config.
  Local only — never runs shellcheck CLI, no fetch.
version: 1.0.0
tags: [shellcheck, shell, rules, disables, config, local]
---

# ShellCheck rules, disables & config

Use these tools when the user pastes shell or ShellCheck config/CI (never fetch a remote file, never run shellcheck CLI):

1. **`shellcheck_rules_list`** with `source` — → `{rules: [{id?}], count}`.
2. **`shellcheck_disables_hint`** with `source` — → `{disables: [{method, count}], count}`.
3. **`shellcheck_config_hint`** with `source` — → `{config: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Documented limitations apply (not shellcheck CLI; no network).

## Example prompts

- "Which SC#### rule ids appear in this shell / shellcheck config?"
- "Does this use disable= / enable= / # shellcheck disable / exclude=?"
- "What .shellcheckrc / --severity / --shell / --format settings appear here?"
