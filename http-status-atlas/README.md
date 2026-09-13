# HTTP Status Atlas

Zero-auth **local** MCP tools for HTTP status codes: explain meaning, classify into buckets, retry advice, and cache hints. No SaaS product, no API keys — everything runs on stdio via Node.

## Why novel

No zero-auth local MCP in the catalog combines status explain + multi-code classify + retry heuristics (idempotency-aware) + cacheability hints in one lightweight plugin.

## Tools

| Tool | Purpose |
|------|---------|
| `status_explain` | Reason phrase, category, meaning, retry guidance for a code |
| `status_classify` | Bucket many codes into informational/success/redirect/client/server/unknown |
| `retry_advice` | Heuristic shouldRetry + backoff (idempotency-aware) |
| `cache_hint` | Cacheable / conditional / not — with advice |

## Start

```bash
node /workspace/http-status-atlas/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/http-status-atlas`

## Skills

- **http-status-guide** — explain and classify status codes
- **retry-cache-heuristics** — retry advice and cache hints for API clients

## License

MIT © Lawrence Hutchins
