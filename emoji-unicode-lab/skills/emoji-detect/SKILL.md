---
name: emoji-detect
description: >
  Scan text for emoji including ZWJ sequences and variation selectors —
  zero-auth, compact local heuristic (no network / no huge tables).
version: 1.0.0
tags: [emoji, zwj, unicode, detect, local]
---

# Emoji detect

When the user asks to find emoji in text, list emoji codepoints, or check ZWJ / VS sequences:

1. Call **`emoji_detect`** with `text` → `{matches:[{emoji, index, codepoints[]}], count, note}`.
2. Report each match with its codepoint list. Mention the detector is a compact heuristic, not a full `emoji-test.txt` parser.

## Example prompts

- "Find all emoji in this string"
- "Does this text contain a family ZWJ sequence?"
- "List codepoints for each emoji here"
