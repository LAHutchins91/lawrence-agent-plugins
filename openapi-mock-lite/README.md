# OpenAPI Mock Lite

Zero-auth **local** MCP tools for OpenAPI 3.x: load/summarize specs, mock response bodies from examples or schemas, find coverage gaps, and flag mutating ops without security. No SaaS product, no API keys — everything runs on stdio via Node.

## Why novel

No zero-auth local MCP in the catalog combines OpenAPI mock generation (example-preferring) with coverage-gap and security heuristics in one lightweight plugin.

## Tools

| Tool | Purpose |
|------|---------|
| `openapi_load` | Parse OpenAPI 3.x (JSON/YAML/object); return title, version, path/operation counts, path→methods |
| `mock_response` | Generate example response body for `path`+`method` (+ optional `statusCode`, default 200) |
| `openapi_coverage_gaps` | List operations missing description and/or response examples |
| `openapi_security_scan` | Flag POST/PUT/PATCH/DELETE with no security at operation or global level |

## Start

```bash
node /workspace/openapi-mock-lite/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/openapi-mock-lite`

## Skills

- **openapi-mock** — load a spec and mock responses for contract tests
- **openapi-review** — coverage gaps + mutating-ops security heuristics

## License

MIT © Lawrence Hutchins
