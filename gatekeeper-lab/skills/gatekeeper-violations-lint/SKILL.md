---
name: gatekeeper-violations-lint
description: >
  Parse Gatekeeper status.violations / audit samples and run educational lite
  lint with the local zero-auth gatekeeper-lab MCP. No gatekeeper CLI, OPA, or
  network. Educational policy tips only — not an exploit guide.
version: 1.0.0
tags: [gatekeeper, violations, lint, k8s, mcp, developer-tools]
---

# Gatekeeper violations & lite lint

When the user pastes a **status.violations** block or wants a smell-check:

1. **`gatekeeper_violations_hint`** — `{ text }` → `{ violations: [{resource?, message?}], count }`.
   - Looks for `status.violations` entries (kind/name/namespace + message).
2. **`gatekeeper_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing template, dryrun-only tip, overly broad match.
   - Not an exploit guide.

## Example prompts

- "Parse these Gatekeeper audit violations for resource + message"
- "Lint this Constraint for dryrun-only or over-broad match"
- "Is a ConstraintTemplate missing for this Constraint kind?"
