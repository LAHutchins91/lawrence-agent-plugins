---
name: cron-next-validate
description: Validate cron expressions and compute next UTC fire times with the local zero-auth cron-explain MCP.
version: 1.0.0
tags: [cron, schedule, validate, developer-tools]
---

# Cron next times & validate

When the user needs next run times or validation:

1. **`cron_validate`** — `{ expression }` → `{ ok, errors[] }`.
2. **`cron_next`** — `{ expression, from?: ISO, count?: number }` → `{ times: string[] }` (ISO UTC; default count 5, max 20).

## Example prompts

- "Is `0 25 * * *` valid?"
- "Next 5 times for `0 0 1 * *` from 2026-01-01T00:00:00Z"
