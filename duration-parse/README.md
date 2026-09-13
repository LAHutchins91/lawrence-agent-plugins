# Duration Parse

Zero-auth **local** MCP tools for parsing human duration strings (`1h30m`, `90s`, `2d`) and ISO-8601 durations (`PT1H30M`, `P1DT2H`), formatting milliseconds, computing UTC deadlines from now, and comparing two durations. No SaaS product, no API keys — everything runs on stdio via Node. Hand-rolled parser (zero extra runtime deps beyond the MCP SDK).

## Why novel

No zero-auth local MCP in the catalog focuses on bidirectional human ↔ ISO duration parse/format plus deadline math and compare in one stdio server.

## Tools

| Tool | Purpose |
|------|---------|
| `duration_parse` | Human / ISO-8601 → `{ ms, normalized? }` |
| `duration_format` | `ms` → short (`1h30m`) or long (`1 hour 30 minutes`) |
| `deadline_from_now` | Add duration to now → ISO-8601 UTC deadline |
| `duration_compare` | Compare two durations (`shorter` / `equal` / `longer`) |

## Start

```bash
node /workspace/duration-parse/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/duration-parse`

## Skills

- **duration-parse** — Parse and format human / ISO durations
- **deadline-helpers** — Compute deadlines and compare durations

## License

MIT © Lawrence Hutchins
