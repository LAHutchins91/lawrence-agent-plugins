---
name: normalize-eol
description: >
  Normalize line endings to LF or CRLF, count lines with trailing-newline
  awareness, and strip a UTF-8 BOM — zero-auth, local.
version: 1.0.0
tags: [eol, normalize, crlf, lf, bom, lines, local]
---

# Normalize EOL / count lines / strip BOM

When the user asks to convert line endings, fix mixed CRLF/LF, count lines, or remove a UTF-8 BOM:

1. Call **`normalize_eol`** with `text` and optional `target` (`lf` default, or `crlf`) → `{text, changed}`.
2. Call **`count_lines`** with `text` → `{lines, trailingNewline}` (empty → 0; `"a\\n"` → 1 with trailing true).
3. Call **`strip_bom`** with `text` → `{text, hadBom}` (removes leading `\\uFEFF` only).

## Example prompts

- "Convert this to LF"
- "Make all endings CRLF"
- "How many lines are in this string?"
- "Strip the BOM from this file content"
