---
name: chef-attrs-lint
description: >
  Extract Chef default/override/normal / node[...] attribute key paths
  (flagging secret/password/token key names only) and educational lite lint
  with the local zero-auth chef-lab MCP. No Chef CLI, knife, or network.
version: 1.0.0
tags: [chef, attributes, lint, secrets, mcp, developer-tools]
---

# Chef attrs & lite lint

When the user pastes **Chef** attributes / recipe / metadata text or wants a smell-check:

1. **`chef_attrs_hint`** — `{ text }` → `{ attrs: string[], secretKeyNames?, count }`.
2. **`chef_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing metadata name/version, plaintext passwords,
     `execute` without `not_if`/`creates`, `:latest` package tip.
   - Not an exploit guide.

## Example prompts

- "What attribute keys does this Chef attributes file declare?"
- "Lint this metadata.rb for missing name/version"
- "Any secret-looking key names in this Chef paste?"
