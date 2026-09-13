# Timezone Lab

Zero-auth **local** MCP tools for IANA timezone conversion, offsets, a curated common-zone list, and ISO→UTC parsing. No network — pure TypeScript + `Intl.DateTimeFormat` (no moment / luxon / tzdb packages).

## Why novel

A compact civil-time companion for agents: convert wall clocks across zones, read DST-aware offsets, pick common IANA ids, and normalize messy ISO strings to UTC instants — all offline on host ICU data.

## Tools

| Tool | Purpose |
|------|---------|
| `tz_convert` | ISO datetime + `fromTz` + `toTz` → `{local, utcInstant, …}` |
| `tz_offset` | Instant + `timeZone` → `{offset: +05:30, minutes, …}` |
| `list_common_tz` | Curated common IANA zones → `[{id, label?}]` |
| `parse_iso_z` | Normalize ISO (Z / offsets) → `{utc, epochMs, valid}` |

## DST caveats

- **Spring-forward** skips a local hour; **fall-back** repeats one. This lab resolves ambiguous/skipped wall times with a two-pass Intl offset guess — verify edge cases if correctness is critical.
- Offsets and conversions depend on the **host ICU/IANA** dataset (Node ≥18).
- No full IANA dump: use `list_common_tz` for a curated set, or pass any valid IANA id the host knows.

## Start

```bash
node /workspace/timezone-lab/dist/bundle.js
```

## Skills

- **tz-convert** — convert between IANA zones; read offsets; list common zones
- **parse-iso-z** — normalize ISO inputs to UTC Instant

## License

MIT © Lawrence Hutchins — FREE
