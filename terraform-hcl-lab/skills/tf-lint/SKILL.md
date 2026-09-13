---
name: tf-lint
description: >
  Lite-lint pasted Terraform HCL for duplicate resource addresses,
  missing required_providers, empty module source, and suspicious
  hardcoded secrets (password/secret/token key heuristics). Local only,
  no terraform CLI, no fetch.
version: 1.0.0
tags: [terraform, hcl, lint, local]
---

# TF lint

Use **`tf_lint_lite`** with `hcl` on pasted Terraform HCL (do not fetch URLs or run terraform):

- Duplicate resource addresses (error)
- Missing `terraform { required_providers { ... } }` hint when resources/providers present (warning)
- Empty / missing module `source` (error)
- Suspicious hardcoded secrets on password/secret/token-like string attrs (warning, heuristic)

Heuristic only — not `terraform validate`, not a full HCL parser.

## Example prompts

- "Lint this Terraform for duplicate resources and missing required_providers."
- "Any empty module sources in this HCL?"
- "Flag hardcoded secrets in this pasted terraform."
