# HAR Diff

Zero-auth **local** MCP tools for comparing HTTP Archive (HAR) captures: request summaries, before/after diffs (status, timing, size), failing-request triage, and cookie-name scans with Secure/HttpOnly flags. No SaaS product, no API keys — everything runs on stdio via Node.

## Why novel

No zero-auth local MCP in the catalog specializes in comparing HTTP Archive (HAR) captures for regressions (status, timing, payload size, URL/path changes) without a SaaS product.

## Tools

| Tool | Purpose |
|------|---------|
| `har_summary` | Summarize request count by host, method, status family, total transfer size, slowest N endpoints |
| `har_diff` | Diff two HARs by method+url path; report added/removed/changed; top time/size regressions |
| `har_failing` | List failing requests (status ≥ minStatus, default 400) |
| `har_cookie_scan` | Unique cookie names set/sent (names only); flag missing Secure/HttpOnly on Set-Cookie |

## Start

```bash
node /workspace/har-diff/dist/bundle.js
```

## Skills

- **har-regression-review** — summary + before/after diff with top regressions
- **har-failing-triage** — failing requests + cookie security flags

## License

MIT © Lawrence Hutchins
