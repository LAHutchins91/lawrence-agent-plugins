---
name: gi-parse-merge
description: >
  Parse .gitignore text into structured rules and merge multiple pattern lists
  with the local zero-auth gitignore-lab MCP. Skips blanks and # comments.
version: 1.0.0
tags: [gitignore, parse, merge, developer-tools]
---

# Gitignore parse & merge

When the user needs structured rules or a combined ignore list:

1. **`gi_parse`** — `{ text }` → `{ rules: [{pattern, negation, directoryOnly, raw}], count }`.
2. **`gi_merge`** — `{ lists: string[] }` → `{ text, rules }`.
   - Later lists append; order preserved; normalized output (no comments).

## Example prompts

- "Parse this .gitignore into rules"
- "Merge root and package gitignore snippets"
- "How many non-comment patterns are in this file?"
