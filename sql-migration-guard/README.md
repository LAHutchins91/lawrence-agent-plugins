# SQL Migration Guard

Zero-auth **local** MCP tools for reviewing SQL migration risk: destructive operations, lock hazards, irreversibility, expand-contract order heuristics, best-effort rollback sketches, and dialect-aware lock estimates. No cloud DB product, no API keys — everything runs on stdio via Node.

## Why novel

No zero-auth local MCP in the catalog specializes in SQL migration risk review without tying to a hosted database SaaS.

## Tools

| Tool | Purpose |
|------|---------|
| `migration_risk_scan` | Flag DROP/TRUNCATE/DELETE-without-WHERE/ALTER TYPE/column drops/renames/NOT NULL without default/CREATE INDEX without CONCURRENTLY/LOCK TABLE |
| `migration_order_check` | Warn if later migrations reference tables/columns dropped earlier, or expand-contract order looks violated |
| `migration_rollback_sketch` | Best-effort inverse sketch with confidence labels — never invents data restores |
| `migration_lock_estimate` | Heuristic notes on table rewrites vs metadata-only changes by dialect |

## Start

```bash
node /workspace/sql-migration-guard/dist/bundle.js
```

## Skills

- **migration-review** — risk scan + order check + lock estimate brief
- **rollback-sketch** — generate cautious inverse SQL sketches

## License

MIT © Lawrence Hutchins
