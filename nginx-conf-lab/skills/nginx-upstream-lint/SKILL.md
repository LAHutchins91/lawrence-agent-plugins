---
name: nginx-upstream-lint
description: >
  List nginx upstream blocks and run heuristic conf lint (empty server_name,
  duplicate locations, missing semicolons, unbalanced braces, root+alias)
  with the local zero-auth nginx-conf-lab MCP. String-only — no nginx -t / FS.
version: 1.0.0
tags: [nginx, conf, upstream, lint, developer-tools]
---

# Nginx upstream & lint

When the user wants upstream inventory or quick conf smells from **text**:

1. **`nginx_upstream_list`** — `{ text }` → `{ upstreams: [{ name, servers }] }`.
2. **`nginx_conf_lint`** — `{ text }` → `{ findings, findingCount }`.
   - Rules: empty_server_name, listen_without_server, duplicate_location,
     missing_semicolon, unbalanced_braces, root_alias_confusion, include_not_followed.

## Example prompts

- "List upstream backends in this conf"
- "Lint this nginx.conf for common mistakes"
- "Do any locations set both root and alias?"
