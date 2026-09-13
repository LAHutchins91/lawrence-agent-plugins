---
name: md-heading-link-lint
description: "Lint Markdown ATX heading structure and scan inline links for empty, javascript:, or bare-hash hrefs (local zero-auth MCP)."
version: 1.0.0
tags: [markdown, lint, headings, links, security]
---

# Heading & link lint

When reviewing Markdown quality or link safety:

1. Call **`md_heading_lint`** with `{ markdown }` — empty, duplicate, skip-level, trailing `#` junk.
2. Call **`md_link_scan`** with `{ markdown }` — list links and flag risky hrefs.
3. Summarize `findingCount` / `flags` and cite line numbers when present.

## Example prompts

- "Lint headings in this doc"
- "Any javascript: or empty links?"
- "Did I skip from h2 to h4?"
