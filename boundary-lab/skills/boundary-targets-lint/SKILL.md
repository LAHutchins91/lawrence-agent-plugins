---
name: boundary-targets-lint
description: >
  Extract Boundary targets / host sets / hosts (name, type tcp, address/port
  hints) plus educational lite lint with the local zero-auth boundary-lab MCP.
  No boundary CLI, controller/worker, or network. Never invents credentials;
  not an exploit guide.
version: 1.0.0
tags: [boundary, target, host, lint, hcl, mcp, developer-tools]
---

# Boundary targets & lite lint

When the user pastes **Boundary** target/host HCL or wants a smell-check:

1. **`boundary_targets_hint`** — `{ text }` → `{ targets: [{name?, type?, address?}], count }`.
   - Targets, host sets, and hosts — address/port *hints* only.
2. **`boundary_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing scope/target, plaintext password (key *names* only),
     wildcard address tip, insecure listener tip.
   - Not an exploit guide; never invents credentials.

## Example prompts

- "What tcp targets and hosts are in this Boundary config?"
- "Lint this Boundary HCL for plaintext password or tls_disable tips"
- "Any 0.0.0.0 bind addresses or missing scopes in this paste?"
