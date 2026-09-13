---
name: license-header
description: >
  Suggest a short SPDX file header comment (and heuristic compatibility notes)
  locally with zero-auth MCP tools. Never dump full GPL/AGPL text.
version: 1.0.0
tags: [spdx, license, header, copyright, compatibility, local]
---

# License header / compatibility

Use these tools when the user wants a file header or a rough compatibility hint:

1. **`license_header_suggest`** with `id` and optional `year` / `holder`.
2. **`license_compat_hint`** with two SPDX ids `a` and `b`.

Always surface the tool's **NOT legal advice** disclaimer for compatibility results. For copyleft ids, prefer the SPDX-License-Identifier + pointer header — do not paste full GPL/AGPL license text. All work is local.

## Example prompts

- "Suggest a MIT header for 2026 Lawrence Hutchins."
- "Give me an SPDX header for GPL-3.0-only."
- "Heuristic: can Apache-2.0 combine with GPL-3.0-only?"
