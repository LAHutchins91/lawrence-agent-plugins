# ETag Cache Lab

Zero-auth **local** MCP tools for normalizing pasted `ETag` values, checking `If-None-Match`, comparing weak/strong entity-tags (RFC 9110), and heuristic cache freshness hints. String analysis only — no network, no live cache.

## Tools

| Tool | Purpose |
|------|---------|
| `etag_normalize` | Raw ETag → `{raw, weak, value, quoted}` (strip `W/` prefix and quotes) |
| `if_none_match_check` | Resource ETag + `If-None-Match` → `{match, matchedTag?, would304}` (`*` + multi-etag, weak comparison) |
| `cache_freshness_hint` | `Date` / `Age` / `Cache-Control` `max-age` (+ optional `Expires`) → heuristic `{fresh, ageSeconds?, maxAge?, remainingSeconds?, notes[]}` |
| `weak_etag_compare` | Two etags → `{equalStrong, equalWeak}` per RFC 9110 weak comparison |

## Limits

- Pasted header / etag text you already have. No sockets, DNS, or remote fetches.
- Inputs are length-limited (≤ 65536 chars; etag lists capped).
- **Not** a full HTTP cache simulator: ignores `Vary`, heuristic freshness without explicit lifetime, `stale-while-revalidate`, and most directive interactions beyond notes.
- Weak comparison follows RFC 9110 opaque-tag match ignoring weakness; strong requires neither tag weak.
- `If-None-Match: *` is treated as match → `would304` when a current representation is assumed to exist.
- Bare (unquoted) opaque tags are accepted leniently and re-quoted in output.

## Start

```bash
node /workspace/etag-cache-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/etag-cache-lab`

## Skills

- **etag-check** — normalize etags, weak/strong compare, If-None-Match 304 checks
- **cache-freshness** — heuristic Age / max-age / Expires freshness hints

## License

MIT © Lawrence Hutchins — FREE
