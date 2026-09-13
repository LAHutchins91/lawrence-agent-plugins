---
name: terragrunt-deps-lint
description: >
  Extract Terragrunt dependency / dependencies blocks (name, config_path) plus
  educational lite lint with the local zero-auth terragrunt-lab MCP. No
  terragrunt CLI, terraform apply, or network. Never invents credentials; not
  an exploit guide.
version: 1.0.0
tags: [terragrunt, dependency, lint, hcl, mcp, developer-tools]
---

# Terragrunt deps & lite lint

When the user pastes **Terragrunt** dependency HCL or wants a smell-check:

1. **`terragrunt_deps_hint`** — `{ text }` → `{ deps: [{name?, configPath?}], count }`.
   - `dependency "name" { config_path = "…" }` and `dependencies { paths = […] }`.
2. **`terragrunt_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing terraform source, plaintext secrets in inputs,
     hard-coded backend tip (key *names* / patterns only).
   - Not an exploit guide; never invents credentials.

## Example prompts

- "Which Terragrunt dependencies and config_paths are in this paste?"
- "Lint this terragrunt.hcl for missing terraform source or plaintext input secrets"
- "Any hard-coded remote_state backend smells?"
