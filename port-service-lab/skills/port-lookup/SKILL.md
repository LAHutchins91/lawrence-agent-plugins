---
name: port-lookup
description: >
  Look up common port↔service heuristics and IANA port ranges — zero-auth,
  local curated map only, no network scans. Not an authoritative IANA dump.
version: 1.0.0
tags: [ports, services, iana, lookup, local]
---

# Port ↔ service lookup

When the user asks what runs on a port, which port a service uses, or which IANA range a port falls into:

1. Call **`port_lookup`** with `port` → `{port, services[], notes?, known, caveat}`.
2. Call **`service_lookup`** with `service` (aliases ok: postgres/pg, mysql/mariadb, mongo/mongodb) → `{service, ports[], notes?, known, resolvedAs?}`.
3. Call **`port_range_check`** with `port` → `{range: well-known|registered|dynamic, valid, advice}`.
4. Always mention the data is heuristic, not an authoritative IANA registry dump. Never claim network scanning occurred.

## Example prompts

- "What usually listens on 5432?"
- "Default ports for Redis and MongoDB"
- "Is 8080 well-known or registered?"
