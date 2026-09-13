---
name: sequelize-models
description: >
  List sequelize.define / class extends Model names, association hints
  (hasMany/belongsTo/hasOne/belongsToMany), and attribute/column hints
  from pasted Sequelize model JS/TS. Local only — no sequelize CLI, no fetch.
version: 1.0.0
tags: [sequelize, models, associations, columns, orm, local]
---

# Sequelize models / associations / columns hint

Use these tools when the user pastes Sequelize model JS/TS text (never fetch a remote file, never run sequelize CLI for analysis):

1. **`sequelize_models_list`** with `source` — → `{models: [{name}], count}`.
2. **`sequelize_associations_hint`** with `source` — → `{associations: [{type, source?, target?}], count}`.
3. **`sequelize_columns_hint`** with `source` — → `{models: [{model?, columns[]}], count}`.

Lite JS/TS scanner. Input cap ~1MB. Documented limitations apply (not sequelize CLI; no network).

## Example prompts

- "List models in this Sequelize source."
- "What associations are declared?"
- "What columns/attributes does each model have?"
