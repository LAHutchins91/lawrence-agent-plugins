---
name: dotenv-diff-redact
description: >
  Diff two dotenv texts by key set / value equality without dumping secret
  values, and redact PASSWORD/SECRET/TOKEN/KEY/API_KEY-style values with the
  local zero-auth dotenv-merge-lab MCP. String-level only — no FS/network.
version: 1.0.0
tags: [dotenv, env, diff, redact, developer-tools]
---

# Dotenv diff & redact

When the user wants a safe comparison or shareable `.env` **text**:

1. **`dotenv_diff_keys`** — `{ a, b }` → `{ onlyA, onlyB, both, valueChanged }`.
   - `valueChanged` lists **keys only** (never returns secret values).
2. **`dotenv_redact`** — `{ text }` → `{ text, redactedKeys }`.
   - Secret-like keys → `***REDACTED***`.
   - Keeps keys, comments, and non-secret values.

## Example prompts

- "Which keys differ between these two .env snippets?"
- "Redact secrets from this .env before I paste it"
- "Did PASSWORD or API_KEY change? Just tell me the key names"
