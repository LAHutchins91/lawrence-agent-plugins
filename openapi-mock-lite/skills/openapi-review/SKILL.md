---
name: openapi-review
description: >
  Review an OpenAPI 3.x spec for coverage gaps (missing descriptions/examples)
  and mutating endpoints without security — local zero-auth MCP.
version: 1.0.0
tags: [openapi, coverage, security, review, api]
---

# OpenAPI coverage & security review

When the user reviews API documentation quality or auth posture:

1. Call **`openapi_coverage_gaps`** to list operations missing `description` and/or response examples.
2. Call **`openapi_security_scan`** to flag POST/PUT/PATCH/DELETE with no security at operation or global level.
3. Summarize gap counts and findings; suggest concrete doc/security fixes.
4. Optionally use **`openapi_load`** for an overview first.

## Example prompts

- "Which endpoints in this OpenAPI lack descriptions or examples?"
- "Scan this OpenAPI for unauthenticated mutating methods"
- "Review this API spec for doc gaps and security holes"
