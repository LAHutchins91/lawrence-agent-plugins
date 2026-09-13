---
name: markdownlint-rules
description: >
  List MD### rule IDs and count extends/shareable-config and ignore/directive
  hints from pasted Markdown or markdownlint config. Local string heuristics only;
  never runs markdownlint CLI and never fetches files.
version: 1.0.0
tags: [markdownlint, markdown, rules, extends, ignores, local]
---

# Markdownlint rules, extends, and ignores

Use these tools only with source the user pasted:

1. **`markdownlint_rules_list`** — `{rules: [{id?}], count, notes}`.
2. **`markdownlint_extends_hint`** — `{extends: [{method, count}], count, notes}`.
3. **`markdownlint_ignores_hint`** — `{ignores: [{method, count}], count, notes}`.

Do not fetch URLs, resolve configs, or run markdownlint CLI. Input cap ~1MB.

## Example prompts

- "Which MD### rules appear in this config?"
- "Does this config extend a markdownlint-config package?"
- "Which markdownlint disable directives appear here?"
