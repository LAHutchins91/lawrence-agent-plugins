---
name: unicode-info
description: "Inspect Unicode characters/codepoints, escape non-ASCII, and NFKC-normalize — zero-auth, local Node built-ins + small curated name map (not full UCD)."
version: 1.0.0
tags: [unicode, codepoint, escape, nfkc, local]
---

# Unicode info / escape / NFKC

When the user asks about a character, codepoint, JS escapes, or NFKC normalization:

1. Call **`unicode_info`** with `input` (literal char, `U+1F600`, `0x1F600`, or hex) → `{char, codepoint, hex, category?, name?, utf16Length, utf8ByteLength, caveat}`.
2. Call **`escape_unicode`** with `text` (optional `astralBraces`) → `{escaped}`.
3. Call **`normalize_nfkc`** with `text` → `{normalized, changed}`.
4. Always mention name coverage is curated / best-effort — not a full Unicode Character Database dump.

## Example prompts

- "What is U+1F600?"
- "Codepoint and UTF-8 length of 🙂"
- "Escape 'café 😀' for a JS string"
- "NFKC normalize ﬁle"
