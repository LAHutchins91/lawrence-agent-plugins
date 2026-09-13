# Port Service Lab

Zero-auth **local** MCP tools for common TCP/UDP port ↔ service heuristics, IANA port-range classification, and listen-bind address notes. No network — curated static table only.

## Why novel

Quick port/service companion for local development: look up likely services for a port, default ports for a service (with aliases), classify IANA ranges, and get bind-address security reminders. Data is **heuristic**, not an authoritative IANA dump.

## Tools

| Tool | Purpose |
|------|---------|
| `port_lookup` | Port number → likely `services[]` (+ optional notes) from curated map |
| `service_lookup` | Service name / alias → default `ports[]` |
| `port_range_check` | Port → `{range, valid, advice}` (well-known / registered / dynamic) |
| `listen_hint` | Port + optional intent `public\|private\|local` → bind address notes (no scanning) |

## Start

```bash
node /workspace/port-service-lab/dist/bundle.js
```

## Skills

- **port-lookup** — port ↔ service heuristics + IANA range check
- **listen-hint** — bind address notes for public / private / local intents

## Data caveat

The embedded map (~40–80 common ports) is hand-maintained for developer convenience. Prefer official IANA / vendor docs for authoritative assignments.

## License

MIT © Lawrence Hutchins
