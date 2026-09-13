---
name: packer-provisioners-lint
description: "Extract Packer provisioners (shell, ansible, file, powershell) and post-processors, plus educational lite lint with the local zero-auth packer-lab MCP. No packer CLI, build/deploy, or network."
version: 1.0.0
tags: [packer, provisioner, lint, mcp, developer-tools]
---

# Packer provisioners & lite lint

When the user pastes **Packer** HCL/JSON or wants a smell-check:

1. **`packer_provisioners_hint`** — `{ text }` → `{ provisioners: [{type?, only?}], postProcessors?, count }`.
2. **`packer_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing source/build, plaintext passwords,
     insecure communicator tip, `:latest` tags.
   - Not an exploit guide.

## Example prompts

- "What provisioners and post-processors are in this Packer template?"
- "Lint this Packer HCL for plaintext passwords or :latest tags"
- "Any shell/ansible provisioners in this paste?"
