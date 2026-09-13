---
name: detect-delimiter
description: >
  Detect CSV/TSV delimiter (comma/tab/semicolon/pipe) and sniff quote/escape
  style from pasted sample text — zero-auth, local, no network.
version: 1.0.0
tags: [csv, delimiter, tsv, sniff, quote, local]
---

# Detect delimiter / sniff quotes

When the user asks which delimiter a CSV/TSV-ish sample uses, or how quotes
are escaped:

1. Call **`detect_delimiter`** with `sample` (optional `maxLines`)
   → `{delimiter, name, confidence, scores, fieldCounts, notes}`.
2. Call **`csv_sniff`** with `sample` (optional `delimiter`)
   → `{quoteChar, escapeStyle, doubleQuoteCount, backslashEscapeCount, …}`.
   Escape styles: `double` (`""`), `backslash` (`\"`), `unknown`, `none`.

## Limits

Max sample 256 KiB. Heuristic only — not a full RFC4180 parser. Candidates:
comma, tab, semicolon, pipe.

## Example prompts

- "Is this comma or semicolon separated?"
- "What delimiter does this export use?"
- "Are quotes escaped by doubling or backslash?"
