---
name: ansible-vars-lint
description: >
  Extract Ansible vars / vars_files / set_fact key names (flagging
  secret/password/token key names only) and educational lite lint with the
  local zero-auth ansible-lab MCP. No ansible CLI, SSH, or network.
version: 1.0.0
tags: [ansible, vars, lint, secrets, mcp, developer-tools]
---

# Ansible vars & lite lint

When the user pastes **Ansible** playbook text or wants a smell-check:

1. **`ansible_vars_hint`** — `{ text }` → `{ vars: string[], secretKeyNames?, varsFiles?, count }`.
2. **`ansible_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing hosts, shell/command without `creates`,
     plaintext passwords, become without become_user tip, hosts `all` with
     dangerous modules tip.
   - Not an exploit guide.

## Example prompts

- "What vars and vars_files does this playbook declare?"
- "Lint this playbook for missing hosts or plaintext passwords"
- "Any secret-looking key names in this Ansible paste?"
