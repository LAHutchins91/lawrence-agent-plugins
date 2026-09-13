---
name: breaking-change-scan
description: >
  Scan one commit message or a multi-commit log paste for breaking markers
  ('!' in the type header and BREAKING CHANGE footers) with excerpts.
version: 1.0.0
tags: [commit, breaking-change, conventional-commits, release]
---

# Breaking-change scan

When the user asks whether commits introduce breaking changes:

1. Call **`breaking_change_scan`** with `text` (one message or a multi-commit paste separated by blank lines before new headers, or `---` separators).
2. Report `markers[{kind, commitIndex, excerpt, header, detail}]` — `bang` vs `footer`.
3. Optionally pair with **`conventional_parse`** on individual messages for full structure.

Do not run git; use pasted text only.

## Example prompts

- "Scan this release log for BREAKING CHANGE"
- "Does this commit mark a breaking change with ! or a footer?"
