---
name: ini-toml-parse
description: >
  Parse pasted INI and a documented TOML subset into nested/flat objects —
  zero-auth, local only, no network. Not full TOML 1.0.
version: 1.0.0
tags: [ini, toml, config, parse, local]
---

# INI / TOML-lite parse

When the user pastes INI or TOML config and wants a structured object:

1. Call **`ini_parse`** with `text` (optional `flat=true` for `section.key` maps) → `{ok, data, mode}` or errors.
2. Call **`toml_parse_lite`** with `text` for common TOML (keys, strings, numbers, bools, `[tables]`, `[[arrays of tables]]`) → `{ok, data, limitationsNote}`.
3. Report structured JSON only. Always surface `limitationsNote` for TOML — do not claim full TOML 1.0.
4. Never claim network, remotes, or file I/O beyond the pasted text.

## Example prompts

- "Parse this INI into nested sections"
- "Flatten this INI to dotted keys"
- "Parse this Cargo/pyproject-style TOML table"
