# Cron Explain

Zero-auth **local** MCP tools for parsing/humanizing standard 5-field cron expressions, computing next fire times (UTC ISO), validating fields, and diffing two expressions. Educational scheduling helpers only. No SaaS, no API keys.

## Why novel

No zero-auth local MCP in the catalog focuses on cron parse → human text + next-N UTC times + validate + field-level diff in one stdio server with a hand-rolled 5-field engine.

## Tools

| Tool | Purpose |
|------|---------|
| `cron_parse` | Parse 5-field cron → `{ fields, human, error? }` |
| `cron_next` | Next N fire times as ISO UTC (`from?`, `count?` default 5 max 20) |
| `cron_validate` | `{ ok, errors[] }` for field/syntax issues |
| `cron_diff` | Compare two expressions → `{ same, diffs[{field,a,b}] }` |

## Start

```bash
node /workspace/cron-explain/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/cron-explain`

## Skills

- **cron-parse-explain** — Parse and humanize cron expressions
- **cron-next-validate** — Next fire times, validate, and diff crons

## License

MIT © Lawrence Hutchins
