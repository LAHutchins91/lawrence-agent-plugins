---
name: mongoose-indexes-lint
description: "Extract Mongoose index hints and run educational heuristic lite lint on schema/model JS/TS text with the local zero-auth mongoose-schema-lab MCP. No mongoose/mongo runtime, no network."
version: 1.0.0
tags: [mongoose, indexes, lint, mongodb, developer-tools]
---

# Mongoose indexes & lite lint

When the user wants index inventory or a smell-check of pasted Mongoose schema / model source:

1. **`mongoose_indexes_hint`** — `{ text }` → `{ indexes: [{fields?, unique?, sparse?}], count }` from `schema.index(` / `index: true` on paths / compound indexes.
2. **`mongoose_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing model name, plaintext mongo URI, syncIndexes tips,
     Mixed overuse, no timestamps tip, etc. Not an exploit guide.

## Example prompts

- "List indexes from this Mongoose schema"
- "Lite-lint this Mongoose model file"
- "Any plaintext Mongo URI or Mixed overuse smells?"
