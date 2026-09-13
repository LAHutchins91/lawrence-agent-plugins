---
name: config-redact
description: "Redact secret-like config keys and diff two flat key maps — zero-auth, local only. Never echo original secret values."
version: 1.0.0
tags: [config, redact, secrets, diff, local]
---

# Config redact + key diff

When the user pastes config maps and wants a safe share or a key-level diff:

1. Call **`config_redact`** with `data` (object or JSON text). Keys matching `password|secret|token|key|credential|api_key` (case-insensitive) have values replaced with `***`. Return `redacted` + `redactedKeys[]`.
2. Call **`config_key_diff`** with `a` and `b` (objects or JSON text of flat maps). Nested objects are flattened. Return `onlyInA`, `onlyInB`, `shared`, `valueChanged`.
3. Never print original secret values in chat. Prefer redacting first when values look sensitive.

## Example prompts

- "Redact secrets in this config JSON"
- "Diff these two .env-style key maps"
- "Which keys changed between these configs?"
