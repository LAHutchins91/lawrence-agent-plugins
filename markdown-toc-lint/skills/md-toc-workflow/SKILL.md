---
name: md-toc-workflow
description: >
  Generate and verify Markdown table-of-contents blocks — GitHub-ish TOC
  from ATX headings and drift checks against <!-- toc --> markers (local
  zero-auth MCP).
version: 1.0.0
tags: [markdown, toc, headings, docs, readme]
---

# Markdown TOC workflow

When the user wants a table of contents or suspects TOC drift:

1. Call **`md_toc_generate`** with `{ markdown, maxDepth? }` (default depth 3) to get `toc` + heading slugs.
2. Call **`md_toc_check`** with `{ markdown }` to compare against `<!-- toc -->` … `<!-- tocstop -->` or a top heading-link list.
3. Suggest replacing the TOC block with `expectedToc` when `ok` is false.

## Example prompts

- "Generate a TOC for this README"
- "Does my <!-- toc --> block match the headings?"
- "TOC only through h3"
