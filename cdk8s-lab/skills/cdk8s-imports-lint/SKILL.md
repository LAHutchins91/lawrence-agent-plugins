---
name: cdk8s-imports-lint
description: >
  Detect cdk8s / cdk8s-plus-* / imports/k8s / CRD / ApiObject imports and
  educational lite lint with the local zero-auth cdk8s-lab MCP.
  No cdk8s CLI, cluster, or network.
version: 1.0.0
tags: [cdk8s, imports, lint, kubernetes, mcp, developer-tools]
---

# cdk8s imports & lite lint

When the user pastes **cdk8s** program / cdk8s.yaml text or wants a smell-check:

1. **`cdk8s_imports_hint`** — `{ text }` → `{ imports: [{kind, module?, detail?}], count }`.
2. **`cdk8s_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing cdk8s import, `:latest` image tags,
     privileged/hostNetwork, plaintext secrets in constructs.
   - Not an exploit guide.

## Example prompts

- "What imports does this cdk8s app use?"
- "Lint this cdk8s chart for :latest and privileged pods"
- "Any plaintext Secret stringData tips in this construct?"
