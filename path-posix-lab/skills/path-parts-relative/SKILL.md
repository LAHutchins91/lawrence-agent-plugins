---
name: path-parts-relative
description: >
  Split a POSIX path into basename/dirname/ext and compute a relative path
  from→to with the local zero-auth path-posix-lab MCP. No filesystem access.
version: 1.0.0
tags: [path, posix, basename, relative, developer-tools]
---

# POSIX parts & relative

When the user needs path components or a relative route **without touching disk**:

1. **`path_basename_dirname_ext`** — `{ path }` → `{ basename, dirname, ext }`.
   - `ext` is the last extension (`.tar.gz` → `.gz`), matching `path.posix.extname`.
2. **`path_relative`** — `{ from, to }` → `{ relative }`.
   - POSIX relative from `from` to `to` (same as `path.posix.relative`).

## Example prompts

- "Basename, dirname, and ext of /foo/bar/baz.txt"
- "Relative path from /data/orandea/test/aaa to /data/orandea/impl/bbb"
- "What is the extension of archive.tar.gz?"
