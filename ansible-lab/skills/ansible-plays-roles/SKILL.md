---
name: ansible-plays-roles
description: >
  Inventory Ansible playbook plays (name, hosts, become, gather_facts,
  strategy) and roles (roles:, import_role, include_role, role: name) with
  the local zero-auth ansible-lab MCP. YAML string only — no ansible CLI,
  SSH, or network.
version: 1.0.0
tags: [ansible, playbook, roles, plays, mcp, developer-tools]
---

# Ansible plays & roles

When the user pastes **Ansible** playbook YAML:

1. **`ansible_plays_list`** — `{ text }` → `{ plays: [{name?, hosts?, become?, gatherFacts?}], count }`.
2. **`ansible_roles_hint`** — `{ text }` → `{ roles: string[], count }`.
   - Looks for `roles:` list entries, `import_role` / `include_role`, and `role:` name fields.

## Example prompts

- "List the plays in this Ansible playbook"
- "What roles does this playbook use?"
- "Parse this playbook — hosts and become?"
