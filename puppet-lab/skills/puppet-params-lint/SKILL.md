---
name: puppet-params-lint
description: >
  Extract Puppet class/define parameters and $facts/$trusted usage
  (flagging secret/password/token param names only) and educational lite
  lint with the local zero-auth puppet-lab MCP. No Puppet CLI, agent, or
  network.
version: 1.0.0
tags: [puppet, parameters, lint, secrets, mcp, developer-tools]
---

# Puppet params & lite lint

When the user pastes **Puppet** class/define / manifest text or wants a smell-check:

1. **`puppet_params_hint`** — `{ text }` → `{ params: string[], secretKeyNames?, count }`.
2. **`puppet_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing class, plaintext passwords,
     `exec` without `unless`/`creates`, `ensure => latest` package tip.
   - Not an exploit guide.

## Example prompts

- "What parameters does this Puppet class declare?"
- "Lint this manifest for exec without creates/unless"
- "Any secret-looking param names in this Puppet paste?"
