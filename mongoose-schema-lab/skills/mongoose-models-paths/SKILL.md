---
name: mongoose-models-paths
description: "Extract Mongoose models and Schema path hints from JS/TS text with the local zero-auth mongoose-schema-lab MCP. No mongoose/mongo runtime, no network."
version: 1.0.0
tags: [mongoose, schema, models, paths, mongodb, developer-tools]
---

# Mongoose models & paths

When the user pastes **Mongoose schema / model** source and needs model inventory or path mapping:

1. **`mongoose_models_list`** — `{ text }` → `{ models: [{name, collection?}], schemas?: string[], count }` from `mongoose.model('Name', ...)` / `model(` / `new Schema(`.
2. **`mongoose_paths_hint`** — `{ text }` → `{ paths: [{name, type?, required?, unique?, ref?}], count }` from Schema object-literal path definitions.

## Example prompts

- "List Mongoose models and collections from this file"
- "What paths does the User schema declare?"
- "Show required/unique/ref hints on these Schema paths"
