---
name: cron-parse-explain
description: >
  Parse and humanize standard 5-field cron expressions (minute hour dayOfMonth
  month dayOfWeek) using the local zero-auth cron-explain MCP.
version: 1.0.0
tags: [cron, schedule, crontab, developer-tools]
---

# Cron parse & explain

When the user needs to understand a cron expression:

1. **`cron_parse`** — `{ expression }` → `{ fields: {minute,hour,dayOfMonth,month,dayOfWeek}, human, error? }`.
   - Supports `*`, ranges `a-b`, lists `a,b`, steps `*/n` and `a-b/n`.
2. **`cron_diff`** — `{ a, b }` → `{ same, diffs[{field,a,b}] }` for field-level comparison.

## Example prompts

- "What does `0 9 * * 1-5` mean?"
- "Explain `*/15 * * * *`"
- "Diff `0 * * * *` vs `30 * * * *`"
