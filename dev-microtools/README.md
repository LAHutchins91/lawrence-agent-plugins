# Dev Microtools

Zero-auth local MCP tools for everyday coding agent work. No API keys, no SaaS.

## Tools

| Tool | What it does |
|------|----------------|
| `npm_changelog_brief` | Version-span changelog brief from npm + GitHub releases |
| `semver_compare` | Compare versions with upgrade risk note |
| `jwt_inspect` | Decode JWT header/payload (no verify); redacts secret-like claims |
| `cron_explain` | 5-field cron → plain English (UTC) |
| `openapi_diff` | Structural path/method diff of two OpenAPI docs |
| `stack_parse` | Normalize JS/Python/Go/Java/Rust stack traces |
| `env_key_diff` | Diff `.env` vs `.env.example` **keys only** (never values) |

## Skills

- **dependency-upgrade-brief** — advisory package bump briefs
- **api-contract-diff** — OpenAPI before/after reviews
- **crash-triage** — paste-a-stack-trace triage

## Install

Install from the Cursor marketplace, or for local testing copy this folder to `~/.cursor/plugins/local/dev-microtools` and reload Cursor.

## License

MIT
