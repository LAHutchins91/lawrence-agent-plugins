---
name: ajv-keywords
description: "List JSON Schema / AJV top-level $id/title/type and count keyword presence (type/properties/required/additionalProperties/oneOf/anyOf/allOf/if/then/else/pattern/format) plus $ref values from pasted schema JSON. Local only — JSON.parse, no AJV compile/validate, no fetch."
version: 1.0.0
tags: [ajv, json-schema, schema, keywords, refs, local]
---

# AJV schemas, keywords & refs

Use these tools when the user pastes JSON Schema / AJV schema JSON (never fetch a remote file, never call AJV `compile`/`validate`):

1. **`ajv_schemas_list`** with `source` — → `{schemas: [{id?, title?, type?}], count}`.
2. **`ajv_keywords_hint`** with `source` — → `{keywords: [{keyword, count}], count}`.
3. **`ajv_refs_hint`** with `source` — → `{refs: [{ref}], count}` (no resolution).

JSON.parse preferred. Input cap ~1MB. Documented limitations apply (not AJV runtime; no network).

## Example prompts

- "List $id / title / type from this JSON Schema."
- "How many oneOf / anyOf / format keywords are in this schema?"
- "What $ref values does this AJV schema use?"
