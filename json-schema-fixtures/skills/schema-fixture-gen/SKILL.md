---
name: schema-fixture-gen
description: Generate deterministic JSON fixtures from a JSON Schema and optionally validate them — local zero-auth MCP for contract/fixture tests.
version: 1.0.0
tags: [json-schema, fixtures, validation, testing, ajv]
---

# Schema fixture generation

When the user needs sample data or fixtures from a JSON Schema:

1. Call **`fixture_generate`** with the schema (and optional `seed` for reproducibility).
2. For multiple variants, call **`fixture_generate_n`** with `n` (1–50) and optional base `seed`.
3. Optionally call **`schema_validate`** on each fixture to confirm they satisfy the schema.
4. Present fixtures as ready-to-paste JSON for tests or mocks.

## Example prompts

- "Generate a fixture from this OpenAPI schema component"
- "Give me 5 seeded variants of this user object schema"
- "Validate this payload against the schema"
