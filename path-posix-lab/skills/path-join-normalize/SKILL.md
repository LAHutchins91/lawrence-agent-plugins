---
name: path-join-normalize
description: "Join POSIX path segments and normalize `.` / `..` with the local zero-auth path-posix-lab MCP. String ops only — no filesystem access."
version: 1.0.0
tags: [path, posix, join, normalize, developer-tools]
---

# POSIX join & normalize

When the user needs to compose or clean POSIX paths **without touching disk**:

1. **`path_join`** — `{ parts: string[] }` → `{ path }`.
   - Same rules as Node `path.posix.join` (empty segments ignored; then normalize).
2. **`path_normalize`** — `{ path }` → `{ path }`.
   - Collapses `//`, `.`, and `..` POSIX-style. Does not resolve against cwd.

## Example prompts

- "Join /usr, local, bin"
- "Normalize /foo/bar/../baz/./quux"
- "POSIX-join these segments and drop the parent refs"
