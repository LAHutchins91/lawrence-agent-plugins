---
name: migration-review
description: "Review SQL migration risk locally: scan for destructive ops and lock hazards, check ordered migrations for drop-then-reference / expand-contract issues, and estimate rewrite vs metadata locks by dialect — zero-auth, no cloud DB."
version: 1.0.0
tags: [sql, migration, risk, locks, postgres, mysql, sqlite, ddl]
---

# Migration review

When the user shares migration SQL (single file or ordered list):

1. Call **`migration_risk_scan`** on the SQL text — report severity-ranked findings (DROP, TRUNCATE, DELETE without WHERE, ALTER TYPE, column drop/rename, NOT NULL without default, index without CONCURRENTLY, LOCK TABLE).
2. If multiple migrations are provided, call **`migration_order_check`** with `[{name, sql}, ...]` — flag refs to earlier drops and expand-contract heuristic gaps.
3. Call **`migration_lock_estimate`** with the appropriate `dialect` (`postgres`|`mysql`|`sqlite`|`generic`) for rewrite vs metadata notes.
4. Summarize a deploy-risk brief: blockers first, then medium lock/order warnings, then safe expand steps.

## Example prompts

- "Review this migration for destructive ops and lock risk"
- "Do these Flyway/Liquibase files violate expand-contract order?"
- "Estimate Postgres lock impact for this ALTER"
