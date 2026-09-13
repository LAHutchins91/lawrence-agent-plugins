---
name: ssh-parse-resolve
description: >
  Parse OpenSSH ssh_config text and resolve Host patterns (*, ?, !negation)
  with first-value-wins using the local zero-auth ssh-config-lab MCP.
  Config text analysis only — no SSH execution, network, DNS, FS, or key reads.
version: 1.0.0
tags: [ssh, ssh-config, parse, resolve, developer-tools]
---

# SSH config parse & resolve

When the user needs to inspect or apply an OpenSSH config **as text**:

1. **`ssh_config_parse`** — `{ text }` → `{ globals, hosts, count }`.
   - Comments/blanks ignored. Keywords are case-insensitive.
   - Repeated multi-value keys (e.g. IdentityFile) become arrays.
2. **`ssh_host_resolve`** — `{ text, host }` → `{ host, resolved, matchedBlocks }`.
   - Applies Host patterns (`*`, `?`, `!negation`) in file order.
   - First obtained value wins (IdentityFile and similar accumulate).
   - Does not connect, resolve DNS, or read identity files.

## Example prompts

- "Parse this ssh_config and list Host blocks"
- "What options would apply for host `prod` in this config text?"
- "Does `*.internal !db.internal` match `db.internal`?"
