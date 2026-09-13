---
name: compose-services-ports
description: >
  List docker-compose services and extract ports mappings from YAML text with
  the local zero-auth docker-compose-lab MCP. String/YAML only — no docker daemon
  or filesystem compose reads.
version: 1.0.0
tags: [docker-compose, yaml, services, ports, developer-tools]
---

# Compose services & ports

When the user pastes **docker-compose YAML text** and needs service inventory or ports:

1. **`compose_list_services`** — `{ text }` → `{ services, count, version? }`.
   - Reads names under `services:`; optional top-level `version`.
2. **`compose_ports_map`** — `{ text }` → `{ ports: [{service, published?, target?, protocol?, raw}] }`.
   - Short-form (`"8080:80/tcp"`) and long-form maps.

## Example prompts

- "List the services in this compose file"
- "What ports does this docker-compose expose?"
- "Map published → target ports per service"
