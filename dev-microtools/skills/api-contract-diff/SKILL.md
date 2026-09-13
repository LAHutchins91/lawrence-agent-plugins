---
name: api-contract-diff
description: >
  Compare OpenAPI/Swagger specs before shipping an API change.
  Use openapi_diff for a structural path/method summary.
version: 1.0.0
tags: [openapi, swagger, api, contract]
---

# API contract diff

When the user is about to ship API changes and has before/after OpenAPI (or Swagger) docs:

1. Obtain **before** and **after** specs (file paths or pasted JSON/YAML).
2. Call **`openapi_diff`** with `before` and `after`.
3. Report concisely:
   - Added / removed paths
   - Added / removed operations (METHOD + path)
   - Changed paths (method set differed)
4. Flag removals and method removals as **breaking** unless versioned/deprecated.
5. Optionally suggest consumer impact (SDKs, mobile clients, partner integrations).

## Example prompts

- "Diff these two OpenAPI files before I merge"
- "What broke between yesterday's and today's swagger?"
