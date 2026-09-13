---
name: duration-parse
description: "Parse human duration strings and ISO-8601 durations to milliseconds, and format ms back to short or long form with the local zero-auth duration-parse MCP."
version: 1.0.0
tags: [duration, iso8601, parse, format, developer-tools]
---

# Duration parse & format

When the user needs to interpret or display a duration:

1. **`duration_parse`** — `{ input }` for forms like `1h30m`, `90s`, `2d`, `1h 30m`, or ISO `PT1H30M` / `P1DT2H`. Use `ms` and optional `normalized`; surface `error` on garbage.
2. **`duration_format`** — `{ ms, style?: "short"|"long" }` for `1h30m` vs `1 hour 30 minutes`.

Prefer short style for compact logs; long style for user-facing prose.

## Example prompts

- "How many ms is 1h30m?"
- "Parse PT1H30M"
- "Format 5400000 ms as long English"
