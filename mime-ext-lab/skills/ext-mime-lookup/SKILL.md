---
name: ext-mime-lookup
description: >
  Map file extensions to MIME types and MIME types back to canonical extensions
  (with optional alts) using the local zero-auth mime-ext-lab MCP.
version: 1.0.0
tags: [mime, extension, content-type, developer-tools]
---

# Extension ↔ MIME lookup

When the user needs to convert between file extensions and MIME types:

1. **`ext_to_mime`** — `{ ext }` → `{ ext, mime }`. Leading `.` optional. Unknown → `mime: null`.
2. **`mime_to_ext`** — `{ mime }` → `{ mime, ext, alts? }`. Prefers canonical extension; may include `alts` (e.g. jpeg/jpg).

## Example prompts

- "What MIME type is .webp?"
- "Canonical extension for image/jpeg"
