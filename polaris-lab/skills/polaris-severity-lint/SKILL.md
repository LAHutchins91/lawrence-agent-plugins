---
name: polaris-severity-lint
description: >
  Summarize Polaris severity levels / custom severity maps and mutators,
  plus educational lite lint with the local zero-auth polaris-lab MCP.
  No polaris CLI or network. Educational K8s tips only — not an exploit guide.
version: 1.0.0
tags: [polaris, severity, lint, k8s, mcp, developer-tools]
---

# Polaris severity & lite lint

When the user pastes a **Polaris config / report** snippet, mutations, or wants a smell-check:

1. **`polaris_severity_hint`** — `{ text }` → `{ severities: [{level, count?}], mutators? }`.
   - Rolls up danger / warning / ignore (and aliases) from checks or severity maps; surfaces mutations/mutators.
2. **`polaris_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, all checks disabled, privileged/hostNetwork tip, missing checks block.
   - Not an exploit guide.

## Example prompts

- "Summarize severities in this Polaris config"
- "Lint this Polaris YAML for all-ignore checks or missing checks"
- "Any privileged / hostNetwork smell in this sample YAML?"
