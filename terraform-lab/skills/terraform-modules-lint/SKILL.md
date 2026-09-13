---
name: terraform-modules-lint
description: >
  Extract Terraform module blocks (name, source, version) plus educational
  lite lint with the local zero-auth terraform-lab MCP. No terraform CLI,
  plan/apply, or network. Never invents credentials; not an exploit guide.
version: 1.0.0
tags: [terraform, module, lint, hcl, mcp, developer-tools]
---

# Terraform modules & lite lint

When the user pastes **Terraform** module HCL or wants a smell-check:

1. **`terraform_modules_hint`** — `{ text }` → `{ modules: [{name?, source?, version?}], count }`.
   - Module `source` / `version` attributes.
2. **`terraform_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing `required_version`, plaintext secrets in variables,
     `0.0.0.0/0` ingress tip, unconstrained provider versions (key *names* / patterns only).
   - Not an exploit guide; never invents credentials.

## Example prompts

- "Which modules and versions are in this Terraform paste?"
- "Lint this Terraform HCL for missing required_version or open 0.0.0.0/0"
- "Any plaintext variable defaults that look secret-like?"
