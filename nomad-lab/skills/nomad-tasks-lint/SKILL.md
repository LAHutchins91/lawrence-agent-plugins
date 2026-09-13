---
name: nomad-tasks-lint
description: "Extract Nomad task blocks (driver docker/exec/java, image, secret-like env key names) plus educational lite lint with the local zero-auth nomad-lab MCP. No nomad CLI, cluster, or network."
version: 1.0.0
tags: [nomad, task, docker, lint, mcp, developer-tools]
---

# Nomad tasks & lite lint

When the user pastes **Nomad** job HCL or wants a smell-check:

1. **`nomad_tasks_hint`** — `{ text }` → `{ tasks: [{name?, driver?, image?}], secretKeyNames?, count }`.
2. **`nomad_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing job/task, `:latest` images,
     privileged/host network tip, plaintext secrets.
   - Not an exploit guide.

## Example prompts

- "What tasks and drivers are in this Nomad job?"
- "Lint this Nomad HCL for :latest images or plaintext secrets"
- "Any docker tasks or secret-named env keys in this paste?"
