---
name: ec-diff-lint
description: Diff two .editorconfig texts and run educational heuristic lite lint with the local zero-auth editorconfig-lab MCP. No network or disk walk.
version: 1.0.0
tags: [editorconfig, diff, lint, developer-tools]
---

# EditorConfig diff & lite lint

When the user wants to compare two configs or smell-check a single .editorconfig:

1. **`ec_diff_sections`** — `{ textA, textB }` → `{ onlyA, onlyB, changed, sectionDiffs }`.
2. **`ec_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: missing root=true, invalid core property values, indent_size=tab
     without indent_style=tab, empty file, duplicate section globs, etc.
     Not an exploit guide.

## Example prompts

- "Diff these two .editorconfig files"
- "Lite-lint this EditorConfig"
- "Is indent_size=tab valid without indent_style=tab?"
