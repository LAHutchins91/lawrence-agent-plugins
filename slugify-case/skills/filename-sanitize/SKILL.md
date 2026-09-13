---
name: filename-sanitize
description: >
  Sanitize a string into a safe filesystem basename — strip path separators,
  null bytes, reserved Windows names; optional maxLength — zero-auth local only.
version: 1.0.0
tags: [filename, sanitize, filesystem, windows, path]
---

# Filename sanitize

When the user pastes a filename or path fragment that must be filesystem-safe:

1. Call **`filename_sanitize`** with `text` (optional `maxLength`).
2. Report `safeName` and whether `changed` is true.
3. Do not invent additional sanitization beyond the tool result.

## Example prompts

- "Make this a safe filename"
- "Sanitize CON.txt for Windows"
- "Turn this path into a basename under 64 chars"
