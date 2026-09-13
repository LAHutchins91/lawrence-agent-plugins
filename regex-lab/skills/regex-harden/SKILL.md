---
name: regex-harden
description: "Lint regexes for catastrophic-backtracking smells and preview safer replacements — local zero-auth MCP (nested quantifiers, empty alts, unused captures)."
version: 1.0.0
tags: [regex, redos, lint, replace, security]
---

# Regex harden

When the user wants a safer or cleaner pattern:

1. Call **`regex_lint`** on the pattern; report `findings` (rule, severity, advice).
2. Suggest non-capturing groups, single quantifiers, or mutually exclusive alts.
3. Use **`regex_replace_preview`** to verify a rewrite across multiple samples.

## Example prompts

- "Is (a+)+ a ReDoS risk?"
- "Lint this regex and fix unused capture groups"
- "Preview replacing \\d+ with # on these strings"
