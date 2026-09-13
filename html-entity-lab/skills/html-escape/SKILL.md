---
name: html-escape
description: "Escape or unescape HTML entities and look up names ↔ codepoints (nbsp ↔ U+00A0) — zero-auth, local curated map."
version: 1.0.0
tags: [html, entities, escape, unescape, local]
---

# HTML escape / unescape / lookup

When the user asks to HTML-escape text, decode `&amp;` / `&#NNN;` / `&#xHH;`, or look up an entity name or codepoint:

1. Call **`html_escape`** with `text` (optional `nonAscii` to encode codepoints > 127) → `{escaped}`.
2. Call **`html_unescape`** with `text` to decode named + numeric entities → `{unescaped}`.
3. Call **`entity_lookup`** with `query` (`nbsp`, `&nbsp;`, `U+00A0`, `160`, or a character) → `{name, codepoint, char}` or not found.

Curated common HTML entities only — not the full HTML5 named-character set.

## Example prompts

- "Escape <script>alert(1)</script> for HTML"
- "Decode &nbsp;&amp;&lt;"
- "What codepoint is nbsp?"
- "Look up U+00A0"
- "Encode café as HTML entities"
