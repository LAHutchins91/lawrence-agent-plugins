---
name: detect-eol
description: "Detect LF / CRLF / CR / mixed line endings and report counts — zero-auth, local, no network."
version: 1.0.0
tags: [eol, lf, crlf, cr, line-endings, local]
---

# Detect line endings

When the user asks what line endings a file/string uses, whether endings are mixed, or to count LF vs CRLF vs CR:

1. Call **`detect_eol`** with `text` → `{eol, lfCount, crlfCount, crCount}`.
2. `eol` is one of: `lf`, `crlf`, `cr`, `mixed`, `none`.
3. CRLF sequences are counted first so their CR and LF are not double-counted.

## Example prompts

- "What line endings does this text use?"
- "Are these endings mixed LF and CRLF?"
- "Count CRLF vs LF in this buffer"
