---
name: terrascan-severity-lint
description: >
  Summarize Terrascan severity levels from sample findings JSON or config
  filters, plus educational lite lint with the local zero-auth terrascan-lab
  MCP. No terrascan CLI or network. Never returns secret values. Not an
  exploit guide.
version: 1.0.0
tags: [terrascan, severity, lint, iac, mcp, developer-tools]
---

# Terrascan severity & lite lint

When the user pastes a **Terrascan findings / violations JSON** snippet, severity filter, or wants a smell-check:

1. **`terrascan_severity_hint`** — `{ text }` → `{ severities: [{level, count?}], minSeverity? }`.
   - Rolls up critical / high / medium / low / info from findings or config.
2. **`terrascan_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing iac-type, all policies skipped tip, plaintext secrets tip.
   - Not an exploit guide.

## Example prompts

- "Summarize severities in this Terrascan report JSON"
- "Lint this Terrascan config for missing iac-type or broad skip-rules"
- "Any plaintext secret smell in this scanned sample?"
