---
name: oz-paths-schemas
description: "Extract OpenAPI paths and components.schemas Zod mapping hints from YAML/JSON text with the local zero-auth openapi-zod-lab MCP. No Zod runtime, no codegen, no network."
version: 1.0.0
tags: [openapi, zod, schemas, paths, developer-tools]
---

# OpenAPI paths & schema Zod hints

When the user pastes **OpenAPI** YAML/JSON and needs path inventory or schema→Zod mapping hints:

1. **`oz_paths_list`** — `{ text }` → `{ paths: [{path, methods}], count }` from `paths`.
2. **`oz_schemas_hint`** — `{ text }` → `{ schemas: [{name, type?, zodHint?}], count }` from `components.schemas` with best-effort Zod type hints (`string`→`z.string()`, `integer`→`z.number().int()`, `$ref` name, etc.).

## Example prompts

- "List paths and methods in this OpenAPI doc"
- "What Zod types would these components.schemas map to?"
- "Hint Zod schemas for this OpenAPI YAML"
