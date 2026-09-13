---
name: rollback-sketch
description: Sketch best-effort inverse SQL for a migration with confidence labels. Never invent column definitions for DROP TABLE or data restores for DELETE/TRUNCATE — emit TODOs instead. Local zero-auth MCP.
version: 1.0.0
tags: [sql, migration, rollback, inverse, ddl]
---

# Rollback sketch

When the user asks how to reverse a migration:

1. Call **`migration_rollback_sketch`** with the forward `sqlText`.
2. Present each sketch with its **confidence** (high/medium/low) and notes.
3. Emphasize: structural inverses only — no invented data restores; DROP TABLE → CREATE TODO when columns unknown; ADD COLUMN → DROP COLUMN; renames invert cleanly.
4. Optionally pair with **`migration_risk_scan`** if the forward migration itself is risky.

## Example prompts

- "Sketch a rollback for this migration"
- "What's the inverse of these ALTERs? Don't invent data"
