---
name: deadline-helpers
description: >
  Compute UTC deadlines from a duration relative to now, and compare two
  duration strings, using the local zero-auth duration-parse MCP.
version: 1.0.0
tags: [deadline, duration, compare, iso8601, developer-tools]
---

# Deadline helpers

When the user needs a deadline or duration comparison:

1. **`deadline_from_now`** — `{ duration, now? }` adds the parsed duration to now (default `Date.now()`). Pass `now` as ISO-8601 for deterministic tests. Returns UTC `deadline`.
2. **`duration_compare`** — `{ a, b }` reports `cmp` (-1|0|1) and `relation` (`shorter`|`equal`|`longer`) for **a relative to b**.

## Example prompts

- "What's the UTC deadline 2d from now?"
- "Is 90s longer than PT1M?"
- "Deadline for PT1H30M from 2026-01-01T00:00:00Z"
