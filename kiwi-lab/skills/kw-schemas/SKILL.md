---
name: kw-schemas
description: >
  List OpenAPI input schema paths/URLs (input / schema / openapi / spec)
  and client hints (axios / fetch / ky / got / react-query / swr / graphql)
  from pasted kiwi.config / OpenAPI client-generator style configs. Local
  only — never runs kiwi or codegen, never fetches specs, no fetch.
version: 1.0.0
tags: [kiwi, openapi, schemas, clients, local]
---

# kiwi schemas & clients

Use these tools when the user pastes kiwi.config / OpenAPI client config text (never fetch a remote file, never run kiwi):

1. **`kw_schemas_list`** with `source` — → `{schemas: [{path?, url?}], count}`.
2. **`kw_clients_hint`** with `source` — → `{clients: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Documented limitations apply (not kiwi CLI; no codegen; no network).

## Example prompts

- "Which OpenAPI schemas are referenced in this kiwi config?"
- "What client kinds are used?"
- "List schema paths/URLs from this kiwi.config."
