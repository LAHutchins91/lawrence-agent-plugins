---
name: dotenv-parse-merge
description: "Parse dotenv KEY=VALUE text (comments, export prefix, quotes) and merge base/overlay with last-wins or base-wins using the local zero-auth dotenv-merge-lab MCP. String-level only — no secret-file or network I/O."
version: 1.0.0
tags: [dotenv, env, parse, merge, developer-tools]
---

# Dotenv parse & merge

When the user needs to inspect or combine `.env` **as text**:

1. **`dotenv_parse`** — `{ text }` → `{ vars, keys, errors? }`.
   - `#` comments and blanks ignored. Optional `export` prefix.
   - Quoted values (`'` / `"`) supported; duplicate keys → last wins.
2. **`dotenv_merge`** — `{ base, overlay, strategy? }` → `{ text, vars, changedKeys }`.
   - Default `last-wins`: overlay overrides base.
   - `base-wins`: keep base values; overlay only adds missing keys.

## Example prompts

- "Parse this .env text and list keys"
- "Merge staging over base with last-wins"
- "What keys would change if I overlay this snippet?"
