---
name: procfile-parse-list
description: "Parse Procfile name: command entries and list process type names with the local zero-auth procfile-lab MCP. No network, no process spawn."
version: 1.0.0
tags: [procfile, heroku, foreman, processes, developer-tools]
---

# Procfile parse & process list

When the user pastes **Procfile** text and needs entry inventory or process type names:

1. **`procfile_parse`** — `{ text }` → `{ entries:[{name, command, line?}], count }`.
   - Skips blanks and `#` comments.
2. **`procfile_process_list`** — `{ text }` → `{ processes: string[], count }` in declaration order.

## Example prompts

- "Parse this Procfile"
- "What process types are declared?"
- "List web/worker commands from this Procfile"
