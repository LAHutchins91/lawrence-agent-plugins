---
name: consul-intentions-lint
description: "Extract Consul intentions / service-intentions (source, destination, action allow/deny) plus educational lite lint with the local zero-auth consul-lab MCP. No consul CLI, agent, or network."
version: 1.0.0
tags: [consul, intention, lint, acl, mcp, developer-tools]
---

# Consul intentions & lite lint

When the user pastes **Consul** intentions HCL/JSON or wants a smell-check:

1. **`consul_intentions_hint`** — `{ text }` → `{ intentions: [{source?, destination?, action?}], count }`.
2. **`consul_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing service name, plaintext ACL tokens,
     allow-all intention tip, script check tip.
   - Not an exploit guide.

## Example prompts

- "What intentions (allow/deny) are in this Consul config?"
- "Lint this Consul HCL for plaintext ACL tokens or allow-all intentions"
- "Any script checks or missing service names in this paste?"
