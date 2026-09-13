---
name: gqlc-plugins-documents
description: "Extract GraphQL Code Generator plugins/generates and schema/documents with the local zero-auth graphql-codegen-lab MCP. No codegen runtime, no network."
version: 1.0.0
tags: [graphql-codegen, graphql, plugins, documents, schema, developer-tools]
---

# GraphQL Codegen plugins & documents

When the user pastes **graphql-codegen** config (`codegen.yml` / `.ts`) and needs plugin / document inventory:

1. **`gqlc_plugins_list`** — `{ text }` → `{ plugins: string[], generates?: string[], count }` from `generates` / `plugins` (or CLI `-p` / `--plugin`).
2. **`gqlc_documents_hint`** — `{ text }` → `{ schema?: string|string[], documents?: string|string[], count }` for `schema` / `documents` fields.

## Example prompts

- "Which plugins does this codegen.yml use?"
- "What schema and documents globs are set here?"
- "List generates targets from this CodegenConfig"
