---
name: parse-iso-z
description: "Normalize various ISO-8601 datetime strings (Z, offsets, date-only) to a UTC Instant — zero-auth, local, no network."
version: 1.0.0
tags: [iso8601, utc, parse, instant, local]
---

# Parse ISO → UTC Instant

When the user asks to normalize or validate an ISO datetime to UTC:

1. Call **`parse_iso_z`** with `input`
   → `{utc, epochMs, valid}` (plus `error` when invalid).
2. Accepts `Z`, `±HH:mm` / `±HHmm`, optional fractional seconds, `T` or space
   separator, and date-only (`YYYY-MM-DD` → midnight UTC).
3. Naive datetimes (no zone) are treated as **UTC**.

## Example prompts

- "Normalize 2024-07-01T09:30:00-04:00 to UTC"
- "Is this ISO valid? Parse to epoch ms"
- "Convert 2024-12-25 to a UTC instant"
