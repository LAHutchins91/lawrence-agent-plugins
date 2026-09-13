---
name: schema-contract-diff
description: >
  Structurally diff two JSON Schemas for added/removed/changed properties
  (type, enum, required, format) — local zero-auth MCP for contract drift review.
version: 1.0.0
tags: [json-schema, diff, contract, api, breaking-change]
---

# Schema contract diff

When the user compares schema versions (API contract drift, OpenAPI components, config schemas):

1. Call **`schema_diff`** with `schemaA` (baseline) and `schemaB` (new).
2. Summarize **added**, **removed**, and **changed** paths — call out likely breaking changes (removed required fields, type narrowing, enum removals).
3. Optionally generate fixtures for both sides with **`fixture_generate`** / **`fixture_generate_n`** and validate with **`schema_validate`** to illustrate impact.

## Example prompts

- "Diff these two JSON Schemas for breaking changes"
- "What properties were added or made required between v1 and v2?"
