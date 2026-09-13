---
name: typeorm-entities-relations
description: "Extract TypeORM @Entity classes and relation hints from entity TS/JS text with the local zero-auth typeorm-entity-lab MCP. No TypeORM CLI, no network, no DB."
version: 1.0.0
tags: [typeorm, entity, relations, orm, developer-tools]
---

# TypeORM entities & relations

When the user pastes **TypeORM entity** source and needs entity inventory or relation mapping:

1. **`typeorm_entities_list`** — `{ text }` → `{ entities: [{name, tableName?, columns: string[]}], count }` from `@Entity(...)` classes.
2. **`typeorm_relations_hint`** — `{ text }` → `{ relations: [{entity?, field, kind, target?}], count }` from `@OneToMany` / `@ManyToOne` / `@OneToOne` / `@ManyToMany`.

## Example prompts

- "List TypeORM entities and their columns from this file"
- "What relations does User declare?"
- "Show OneToMany / ManyToOne hints in these entities"
