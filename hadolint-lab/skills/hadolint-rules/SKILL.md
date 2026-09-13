---
name: hadolint-rules
description: >
  List DL/SC rule ids and ignore / config method counts
  (ignore= / --ignore / ignored: / trustedRegistries;
  .hadolint.yaml / failure-threshold / override / label-schema /
  strict-labels / format) from pasted Dockerfile / Hadolint config.
  Local only — never runs hadolint CLI, no fetch.
version: 1.0.0
tags: [hadolint, dockerfile, rules, ignores, config, local]
---

# Hadolint rules, ignores & config

Use these tools when the user pastes a Dockerfile or Hadolint config/CI (never fetch a remote file, never run hadolint CLI):

1. **`hadolint_rules_list`** with `source` — → `{rules: [{id?}], count}`.
2. **`hadolint_ignores_hint`** with `source` — → `{ignores: [{method, count}], count}`.
3. **`hadolint_config_hint`** with `source` — → `{config: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Documented limitations apply (not hadolint CLI; no network).

## Example prompts

- "Which DL/SC rule ids appear in this Dockerfile / hadolint config?"
- "Does this use ignore= / --ignore / ignored: / trustedRegistries?"
- "What .hadolint.yaml / failure-threshold / override / format settings appear here?"
