---
name: vagrant-provisions-lint
description: >
  Extract Vagrant provisioners (shell, ansible, chef, puppet, docker, file)
  and educational lite lint with the local zero-auth vagrant-lab MCP. No
  vagrant CLI, VM start, or network.
version: 1.0.0
tags: [vagrant, provision, lint, mcp, developer-tools]
---

# Vagrant provisions & lite lint

When the user pastes a **Vagrantfile** or wants a smell-check:

1. **`vagrant_provisions_hint`** — `{ text }` → `{ provisions: [{type?, name?}], count }`.
2. **`vagrant_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing box, plaintext passwords,
     insecure private_network tip, synced folder `.` dangers tip.
   - Not an exploit guide.

## Example prompts

- "What provisioners are in this Vagrantfile?"
- "Lint this Vagrantfile for plaintext passwords or synced_folder ."
- "Any shell/ansible provisions in this paste?"
