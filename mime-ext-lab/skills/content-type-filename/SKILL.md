---
name: content-type-filename
description: Extract MIME from a filename/path and parse Content-Type headers (type + params) with the local zero-auth mime-ext-lab MCP.
version: 1.0.0
tags: [mime, filename, content-type, header, developer-tools]
---

# Filename MIME & Content-Type parse

When the user needs MIME from a path or to parse a Content-Type header:

1. **`filename_mime`** — `{ filename }` → `{ filename, ext, mime }`. Uses the last extension segment.
2. **`content_type_parse`** — `{ header }` → `{ type, params, raw }` (e.g. `text/html; charset=utf-8`).

## Example prompts

- "MIME for dist/app.bundle.js.map"
- "Parse Content-Type: application/json; charset=utf-8"
