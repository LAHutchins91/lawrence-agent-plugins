---
name: prisma-models-relations
description: "Extract Prisma models/enums and relation hints from schema.prisma text with the local zero-auth prisma-schema-lab MCP. No Prisma CLI, no network, no DB."
version: 1.0.0
tags: [prisma, schema.prisma, models, relations, developer-tools]
---

# Prisma models & relations

When the user pastes **schema.prisma** and needs model inventory or relation mapping:

1. **`prisma_models_list`** — `{ text }` → `{ models: [{name, fields: [{name, type, attrs?}], @@attrs?}], enums?: [{name, values}], count }`.
2. **`prisma_relations_hint`** — `{ text }` → `{ relations: [{from, field, to?, kind?}], count }` from `@relation` / relational field types.

## Example prompts

- "List models and fields from this schema.prisma"
- "What enums are defined?"
- "Show relation hints between User and Post"
