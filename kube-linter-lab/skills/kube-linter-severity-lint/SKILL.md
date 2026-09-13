---
name: kube-linter-severity-lint
description: >
  Summarize kube-linter severity remaps / findings from sample report or config,
  plus educational lite lint with the local zero-auth kube-linter-lab MCP.
  No kube-linter CLI or network. Educational K8s tips only — not an exploit guide.
version: 1.0.0
tags: [kube-linter, severity, lint, k8s, mcp, developer-tools]
---

# Kube-linter severity & lite lint

When the user pastes a **kube-linter findings / report** snippet, severity remaps, or wants a smell-check:

1. **`kube_linter_severity_hint`** — `{ text }` → `{ severities: [{level, count?}], remaps? }`.
   - Rolls up error / high / medium / warning / low / info from findings or remaps.
2. **`kube_linter_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, all checks excluded tip, privileged/hostNetwork tip, missing checks.
   - Not an exploit guide.

## Example prompts

- "Summarize severities in this kube-linter report"
- "Lint this .kube-linter.yaml for broad excludes or missing checks"
- "Any privileged / hostNetwork smell in this sample YAML?"
