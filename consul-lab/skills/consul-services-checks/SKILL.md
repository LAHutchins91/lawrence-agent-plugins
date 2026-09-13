---
name: consul-services-checks
description: >
  Inventory Consul service definitions (name, port, tags, kind) and extract
  health checks (http, tcp, script, ttl, grpc, interval) with the local
  zero-auth consul-lab MCP. String/regex only — no consul CLI, agent, or
  network.
version: 1.0.0
tags: [consul, hcl, service, check, health, mcp, developer-tools]
---

# Consul services & checks

When the user pastes **Consul** service HCL or JSON:

1. **`consul_services_list`** — `{ text }` → `{ services: [{name?, port?, tags?, kind?}], count }`.
2. **`consul_checks_hint`** — `{ text }` → `{ checks: [{name?, type?, interval?}], count }`.
   - Looks for check blocks with http/tcp/script/ttl/grpc and `interval`.

## Example prompts

- "List the Consul services and checks in this HCL"
- "What ports and tags does this Consul service declare?"
- "Inventory health checks (http/tcp/ttl) in this Consul paste"
