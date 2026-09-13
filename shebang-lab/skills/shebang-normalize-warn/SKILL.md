---
name: shebang-normalize-warn
description: >
  Normalize shebang to env or absolute form and lint common pitfalls (CRLF,
  bare python, missing shebang, odd spaces, BOM) with the local zero-auth
  shebang-lab MCP. No exec, no FS.
version: 1.0.0
tags: [shebang, normalize, lint, warn, developer-tools]
---

# Shebang normalize & warn

When the user wants a portable shebang or a lint pass:

1. **`normalize_shebang`** — `{ text, style?: "env"|"absolute" }` → `{ shebang, rewrittenFirstLine?, note? }`.
   - Known families only; bare `python` upgrades to `python3` in env style.
2. **`shebang_warn`** — `{ text }` → `{ findings: [{severity, rule, advice}], findingCount }`.
   - Rules include `missing-shebang`, `crlf-shebang`, `python-unversioned`, `space-after-shebang`, `bom-before-shebang`.

## Example prompts

- "Rewrite this shebang to use /usr/bin/env"
- "Why might this script fail on Linux with CRLF?"
- "Lint the shebang on this snippet"
