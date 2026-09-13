---
name: kubeconform-skip-lint
description: >
  Extract kubeconform -skip kinds / skip lists and run educational lite lint
  with the local zero-auth kubeconform-lab MCP. No kubeconform CLI or network.
  Educational K8s tips only — not an exploit guide.
version: 1.0.0
tags: [kubeconform, skip, lint, k8s, mcp, developer-tools]
---

# Kubeconform skip & lite lint

When the user pastes **kubeconform flags / config** or wants a smell-check:

1. **`kubeconform_skip_hint`** — `{ text }` → `{ skip: string[], count }`.
   - Looks for `-skip Kind1,Kind2` and YAML `skip:` lists.
2. **`kubeconform_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing schema location, skip-all tip, plaintext token in schema URL tip.
   - Not an exploit guide.

## Example prompts

- "Which kinds does this kubeconform -skip list ignore?"
- "Lint this kubeconform command for missing schema-location or skip-all"
- "Any plaintext token smell in this schema URL?"
