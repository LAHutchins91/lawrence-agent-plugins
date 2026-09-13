---
name: fm-validate
description: >
  Merge patch keys into Markdown YAML frontmatter and validate required /
  forbidden top-level keys — zero-auth, local, no network.
version: 1.0.0
tags: [frontmatter, yaml, validate, merge, markdown, local]
---

# Frontmatter merge / validate

When the user asks to update frontmatter fields or check required/forbidden keys:

1. Call **`fm_merge`** with `document` + `patch` (object or JSON string)
   → `{document, created, keysMerged}`. Creates a FM block if missing.
   Nested maps are deep-merged; arrays/scalars are replaced.
2. Call **`fm_validate_keys`** with `document`, optional `required[]`,
   `forbidden[]`, and `reportExtra`
   → `{ok, missing[], forbiddenPresent[], keys[], hasFrontmatter, extra?}`.

## Example prompts

- "Add title and tags to this post's frontmatter"
- "Does this skill file have name and description?"
- "Reject documents that still have draft: true"
