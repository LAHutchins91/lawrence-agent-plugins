---
name: sequelize-lint
description: "Lite-lint pasted Sequelize models for missing primaryKey heuristic, timestamps: false notes, underscored mixed naming, and duplicate model names. Local only, no sequelize CLI for tool logic, no fetch."
version: 1.0.0
tags: [sequelize, models, lint, primary-key, timestamps, local]
---

# Sequelize model lint

Use **`sequelize_lint_lite`** with `source` on pasted model JS/TS (do not fetch URLs or run sequelize CLI for analysis):

- Missing primaryKey heuristic on a model with attributes (warning)
- `timestamps: false` note (info)
- Underscored mixed across models or snake/camel attribute mix (warning)
- Duplicate model names (error)
- Empty models — no define/class/init found (warning)

Heuristic only — not sequelize CLI / not SQL validation. Lite JS/TS scanner.

## Example prompts

- "Lint this Sequelize model for missing primary keys."
- "Are there duplicate model names?"
- "Any timestamps: false or underscored inconsistencies?"
