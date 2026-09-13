---
name: nginx-parse-listen
description: >
  Parse nginx.conf server/location blocks and extract listen ports with the
  local zero-auth nginx-conf-lab MCP. String-level only — no FS includes or
  network I/O.
version: 1.0.0
tags: [nginx, conf, parse, listen, developer-tools]
---

# Nginx parse & listen ports

When the user pastes nginx.conf **text** and needs structure or ports:

1. **`nginx_parse_lite`** — `{ text }` → `{ servers, notes? }`.
   - Brace-aware heuristic of `server` / `location` (not a full nginx parser).
   - Does **not** follow `include` paths.
2. **`nginx_listen_ports`** — `{ text }` → `{ listens, ports }`.
   - Parses `listen` args into `raw`, optional `port` / `host` / `ssl`.

## Example prompts

- "Parse this nginx server block and list locations"
- "What ports does this conf listen on?"
- "Extract listen directives with SSL flags"
