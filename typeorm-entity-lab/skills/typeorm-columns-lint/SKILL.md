---
name: typeorm-columns-lint
description: "Extract TypeORM column decorator hints and run educational heuristic lite lint on entity / DataSource TS/JS text with the local zero-auth typeorm-entity-lab MCP. No TypeORM CLI, no network, no DB."
version: 1.0.0
tags: [typeorm, columns, lint, datasource, developer-tools]
---

# TypeORM columns & lite lint

When the user wants column inventory or a smell-check of pasted TypeORM entity / DataSource source:

1. **`typeorm_columns_hint`** — `{ text }` → `{ columns: [{entity?, name, type?, primary?, unique?, nullable?}], count }` from `@Column` / `@PrimaryColumn` / `@PrimaryGeneratedColumn`.
2. **`typeorm_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, Entity without Primary, `synchronize: true` smell if
     DataSource present, plaintext password in DataSource options, missing
     `@JoinColumn` on `@OneToOne`, etc. Not an exploit guide.

## Example prompts

- "List columns and types from these TypeORM entities"
- "Lite-lint this TypeORM DataSource + entities"
- "Any synchronize:true or plaintext password smells?"
