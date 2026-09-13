# Log Fingerprint

Zero-auth **local** MCP tools for incident log triage: fingerprint noisy lines, cluster duplicates, detect volume spikes, and brief error budgets. No SaaS, no API keys — everything runs on stdio via Node.

## Tools

| Tool | What it does |
|------|----------------|
| `log_fingerprint` | Normalize timestamps / UUIDs / hex / addresses / numbers → top fingerprints with counts + sample |
| `log_cluster` | Group similar lines after fingerprinting; clusters sorted by size |
| `log_spike_detect` | Minute (or line-order) buckets; flag spikes (≥ mean+2σ or ≥3× previous) |
| `error_budget_brief` | Error rate + remaining budget for assumed SLOs 99.9% / 99.5% / 99% |

## Skills

- **incident-log-triage** — paste logs → fingerprint, cluster, spike-check
- **error-rate-brief** — turn request/error counts into an SLO budget brief

## Start

```bash
node /workspace/log-fingerprint/dist/bundle.js
```

Or after install: `node ${PLUGIN_ROOT}/dist/bundle.js` (see `mcp.json`).

## Install

Install from the Cursor marketplace, or for local testing copy `plugin-dist/` to `~/.cursor/plugins/local/log-fingerprint` and reload Cursor.

## License

MIT
