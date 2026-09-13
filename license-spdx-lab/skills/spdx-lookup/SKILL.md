---
name: spdx-lookup
description: >
  Resolve curated SPDX license ids or fuzzy aliases (MIT, Apache 2, GPL-3)
  locally with zero-auth MCP tools and no network.
version: 1.0.0
tags: [spdx, license, lookup, normalize, local]
---

# SPDX lookup / normalize

Use these tools when the user asks what an SPDX id means or how to canonicalize a license name:

1. **`spdx_lookup`** with exact `id` (e.g. `MIT`, `Apache-2.0`, `GPL-3.0-only`).
2. **`spdx_normalize`** with free-form `text` such as `"MIT License"` or `"Apache 2"`.

Return confidence and alternatives from normalize when the match is fuzzy. This catalog is curated (~30–40 common ids), not the full SPDX list. All work is local.

## Example prompts

- "What is MPL-2.0?"
- "Normalize 'Apache License 2.0' to an SPDX id."
- "Is Unlicense OSI-approved?"
