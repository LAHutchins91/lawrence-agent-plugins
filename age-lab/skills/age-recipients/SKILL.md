---
name: age-recipients
description: >
  List age1 public recipients / -r flags (truncated prefixes) and identity /
  rule method counts (-i / identity files / AGE-SECRET-KEY- markers counted
  & redacted only; ssh-; armor / -a / recipients-file / --encrypt /
  --decrypt / passphrase) from pasted age config/scripts. Local only —
  never runs age CLI, never decrypts, never returns private keys or secret
  values, no fetch.
version: 1.0.0
tags: [age, encryption, recipients, identities, rules, local]
---

# age recipients, identities & rules

Use these tools when the user pastes age config or scripts (never fetch a remote file, never run age/age-keygen CLI, never decrypt, never echo private keys):

1. **`age_recipients_list`** with `source` — → `{recipients: [{prefix?}], count}` (prefixes truncated to ~12 chars + …).
2. **`age_identities_hint`** with `source` — → `{identities: [{method, count}], count}` (secret_key_marker is count-only).
3. **`age_rules_hint`** with `source` — → `{rules: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Never returns private keys or secret values. Documented limitations apply (not age CLI; no network; no decrypt).

## Example prompts

- "Which age1 recipients / -r flags are in this paste?"
- "Does this script use -i identity files or ssh- recipients?"
- "What armor / encrypt / decrypt / passphrase flags appear here?"
