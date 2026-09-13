---
name: markdownlint-lint
description: >
  Lite-lint pasted Markdown for a missing H1, trailing spaces, effectively empty
  content, broad markdownlint disable directives, and lines over 120 characters.
  Local string heuristics only; never runs markdownlint CLI and never fetches files.
version: 1.0.0
tags: [markdownlint, markdown, lint, local]
---

# Markdownlint lite lint

Use **`markdownlint_lint_lite`** with pasted `source`. It reports:

- `missing_h1` (info)
- `trailing_spaces` (warning)
- `empty_file` (warning)
- `broad_disable` (warning)
- `long_line_heuristic` (info)

This is not markdownlint and does not build a Markdown AST. Do not fetch URLs or run markdownlint CLI.

## Example prompts

- "Does this Markdown have a top-level heading?"
- "Check this document for trailing spaces and long lines."
- "Does this broad disable suppress every markdownlint rule?"
