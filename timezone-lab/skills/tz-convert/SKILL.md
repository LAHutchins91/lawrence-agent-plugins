---
name: tz-convert
description: >
  Convert ISO datetimes between IANA time zones, read DST-aware offsets,
  and list common zones — zero-auth, local, Intl only, no network.
version: 1.0.0
tags: [timezone, iana, convert, offset, dst, local]
---

# Timezone convert / offset / list

When the user asks to convert a time between zones, get a UTC offset for a zone
at an instant, or list common IANA ids:

1. Call **`tz_convert`** with `datetime`, `fromTz`, `toTz`
   → `{local, utcInstant, fromTz, toTz, dstCaveat}`.
   - Naive datetime (no Z/offset) = wall clock in `fromTz`.
   - If datetime already has Z/offset, that instant is used.
2. Call **`tz_offset`** with `instant` + `timeZone`
   → `{offset` like `+05:30`, `minutes`, …`}`.
3. Call **`list_common_tz`** (optional `filter`) → `{zones: [{id, label?}], count}`.

## DST note

Near spring-forward / fall-back, ambiguous or skipped local times use a two-pass
Intl offset guess — double-check civil-time edge cases if critical.

## Example prompts

- "Convert 2024-07-01T09:30 America/New_York to Asia/Tokyo"
- "What is the UTC offset of Europe/London on 2024-01-15T12:00:00Z?"
- "List common timezones matching 'America'"
