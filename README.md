# Lawrence Agent Plugins

Marketplace bundle of zero-auth local MCP plugins for coding agents.

| Plugin | Purpose |
|--------|---------|
| [dev-microtools](./dev-microtools) | Changelog / semver / JWT / cron / OpenAPI / stacks / env keys |
| [log-fingerprint](./log-fingerprint) | Log clustering, spikes, error-budget briefs |
| [env-contract](./env-contract) | Env schema infer, drift checks, safe `.env.example` |

## Local test

Copy each plugin folder (or symlink) under `~/.cursor/plugins/local/<name>` and reload Cursor.

## License

MIT (see each plugin’s `LICENSE`).
