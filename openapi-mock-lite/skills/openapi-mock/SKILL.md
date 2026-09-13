---
name: openapi-mock
description: >
  Load an OpenAPI 3.x spec and generate mock response bodies from examples
  or schemas — local zero-auth MCP for contract and stub tests.
version: 1.0.0
tags: [openapi, mock, fixtures, testing, api]
---

# OpenAPI mock responses

When the user needs sample API responses from an OpenAPI document:

1. Call **`openapi_load`** to summarize the spec (paths, methods, title/version).
2. Call **`mock_response`** with `spec`, `path`, `method`, and optional `statusCode` (default 200).
3. Prefer documented examples (`source: "example"`); fall back to schema-generated bodies.
4. Present the body as ready-to-paste JSON for tests or stubs.

## Example prompts

- "Mock the 200 response for GET /users/{id} from this OpenAPI"
- "Summarize this OpenAPI and give me a sample POST /orders body"
- "Generate a fixture from the Pet schema response"
