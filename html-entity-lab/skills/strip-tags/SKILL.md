---
name: strip-tags
description: >
  Naive HTML/XML tag stripper for text extraction. NOT XSS-safe
  sanitization for untrusted HTML in browsers — local regex heuristic.
version: 1.0.0
tags: [html, strip-tags, text, local]
---

# Strip HTML tags (naive)

When the user asks to strip tags, extract visible text from markup, or drop HTML/XML tags:

1. Call **`strip_tags`** with `html` → `{text}`.
2. Set `normalizeWhitespace: true` to collapse whitespace runs and trim; omit or false to keep original whitespace.

## Safety

This is a **text-extraction heuristic**. It does **not**:

- Parse a DOM
- Execute scripts
- Produce markup that is safe to render in a browser
- Defend against XSS, mutation XSS, or attribute-embedded `>` tricks

**Do not** use it as an XSS sanitizer for untrusted HTML. Use a dedicated sanitizer (e.g. DOMPurify) when rendering untrusted markup.

Script/style *bodies* are left as text after the tags themselves are removed.

## Example prompts

- "Strip tags from this HTML"
- "Extract text from <p>Hello <b>world</b></p>"
- "Remove HTML and normalize whitespace"
