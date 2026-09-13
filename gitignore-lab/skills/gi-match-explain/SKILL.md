---
name: gi-match-explain
description: "Match paths against gitignore-style patterns and explain which rule decided with the local zero-auth gitignore-lab MCP. No FS walks, no network."
version: 1.0.0
tags: [gitignore, glob, match, explain, developer-tools]
---

# Gitignore match & explain

When the user needs to test or debug ignore rules:

1. **`gi_match`** — `{ path, patterns }` → `{ ignored, path }`.
   - Last matching rule wins; trailing `/` on path = directory.
2. **`gi_explain`** — `{ path, patterns }` → `{ ignored, matchedRule?, ruleIndex?, explanation }`.
   - Shows which rule (and index) decided keep vs ignore.

## Example prompts

- "Would `build/out.js` be ignored by these patterns?"
- "Which gitignore rule excludes node_modules?"
- "Does `!dist/keep.txt` un-ignore after `dist/`?"
