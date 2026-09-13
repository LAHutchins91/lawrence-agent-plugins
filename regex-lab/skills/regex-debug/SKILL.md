---
name: regex-debug
description: >
  Test and explain JavaScript RegExp patterns against samples — local
  zero-auth MCP for regex debugging (no SaaS).
version: 1.0.0
tags: [regex, regexp, debug, test, explain]
---

# Regex debug

When the user is writing or debugging a regular expression:

1. Call **`regex_test`** with `pattern`, `sample`, and optional `flags` / `global`.
2. Call **`regex_explain`** to get a plain-English token walkthrough.
3. Summarize match indices, captured groups, and any syntax `error`.

## Example prompts

- "Does this regex match these emails?"
- "Explain /^(foo|bar)+\d+$/i"
- "Show all matches of (\w+) in this log line"
