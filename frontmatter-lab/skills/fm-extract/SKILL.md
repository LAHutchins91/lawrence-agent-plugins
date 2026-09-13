---
name: fm-extract
description: >
  Extract or strip YAML frontmatter from Markdown/text documents —
  zero-auth, local, pasted text only, no network.
version: 1.0.0
tags: [frontmatter, yaml, markdown, extract, strip, local]
---

# Frontmatter extract / strip

When the user asks to read, split, or remove YAML frontmatter from a Markdown
or text document:

1. Call **`fm_extract`** with `document`
   → `{frontmatter, body, rawFm, hasFrontmatter}`.
   - Opening `---` must be the first non-empty line.
   - Closing `---` (or `...`) ends the block.
2. Call **`fm_strip`** with `document`
   → `{body, hadFrontmatter}` when only the body is needed.

## Limits

Max document 512 KiB; frontmatter block 64 KiB. YAML subset: scalars, nested
maps, arrays of scalars.

## Example prompts

- "Extract the frontmatter from this Markdown file"
- "What are the YAML keys at the top of this doc?"
- "Strip the frontmatter and give me just the body"
