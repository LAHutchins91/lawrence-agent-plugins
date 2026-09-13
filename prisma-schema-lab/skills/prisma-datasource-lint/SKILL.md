---
name: prisma-datasource-lint
description: "Extract Prisma datasource/generator blocks (URL redacted) and run educational heuristic lite lint on schema.prisma text with the local zero-auth prisma-schema-lab MCP. No Prisma CLI, no network, no DB."
version: 1.0.0
tags: [prisma, schema.prisma, datasource, generator, lint, developer-tools]
---

# Prisma datasource & lite lint

When the user wants datasource/generator inventory or a smell-check of pasted Prisma schema:

1. **`prisma_datasources`** — `{ text }` → `{ datasources: [{name, provider?, urlHint?}], generators?: [{name, provider?}] }` (never echoes full connection secrets).
2. **`prisma_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing datasource/generator, String ids without @id,
     missing @@map tips, plaintext URL in schema, previewFeatures notes.
     Not an exploit guide.

## Example prompts

- "What datasource provider / url hint is in this schema?"
- "Lite-lint this schema.prisma"
- "Any plaintext DATABASE_URL in the schema?"
