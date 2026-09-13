---
name: gitleaks-rules
description: >
  List [[rules]] id/description and allowlist / config method counts
  (allowlist / paths / regexes / stopwords / [[allowlists]]; title /
  extend / useDefault / entropy / keywords / tags / path) from pasted
  .gitleaks.toml. Local only — never runs gitleaks CLI, never returns
  secret values, no fetch.
version: 1.0.0
tags: [gitleaks, secrets, rules, allowlist, config, local]
---

# Gitleaks rules, allowlist & config

Use these tools when the user pastes `.gitleaks.toml` or Gitleaks config (never fetch a remote file, never run gitleaks CLI, never echo secret values):

1. **`gitleaks_rules_list`** with `source` — → `{rules: [{id?, description?}], count}`.
2. **`gitleaks_allowlist_hint`** with `source` — → `{allowlist: [{method, count}], count}`.
3. **`gitleaks_config_hint`** with `source` — → `{config: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Never returns secret values. Documented limitations apply (not gitleaks CLI; no network).

## Example prompts

- "Which [[rules]] ids/descriptions are in this .gitleaks.toml?"
- "Does this config use allowlist paths / regexes / stopwords?"
- "What title / extend / useDefault / entropy / keywords appear here?"
