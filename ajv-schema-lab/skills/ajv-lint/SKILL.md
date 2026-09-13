---
name: ajv-lint
description: "Lite-lint pasted JSON Schema / AJV schema JSON for missing $schema, additionalProperties missing on objects, empty required arrays, and draft mismatch heuristics. Local only — JSON.parse, no AJV compile/validate, no fetch."
version: 1.0.0
tags: [ajv, json-schema, schema, lint, validation, local]
---

# AJV lite lint

Use **`ajv_lint_lite`** on pasted JSON Schema / AJV schema JSON (do not fetch URLs or call AJV `compile`/`validate`):

Findings:

- Missing `$schema` (warning)
- `additionalProperties` missing on object-like schemas (info)
- Empty `required: []` (warning)
- Draft mismatch heuristics (warning/info) — e.g. draft-04 with `$defs` or if/then/else

Heuristic only — not AJV compile/validate. No remote `$ref` resolution.

## Example prompts

- "Lint this JSON Schema for missing $schema and additionalProperties."
- "Does this draft-04 schema misuse $defs or if/then/else?"
- "Any empty required arrays?"
