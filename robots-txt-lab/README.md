# Robots Txt Lab

Zero-auth **local** MCP tools for `robots.txt` parse, allow/disallow checks, sitemap listing, and heuristic lint. **String-level** analysis only — no HTTP fetch or network I/O. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical robots.txt **text** workflows — group parse, longest-match allow checks, sitemap inventory, and quick lint smells without fetching `/robots.txt` over the network.

## Tools

| Tool | Purpose |
|------|---------|
| `robots_parse` | robots.txt text → `{ groups, sitemaps, unmatched? }` |
| `robots_allows` | text + UA + path → `{ allowed, matchedRule?, group? }` |
| `sitemaps_list` | robots.txt text → `{ sitemaps }` |
| `robots_lint` | robots.txt text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never fetches URLs, never follows Sitemap locations over HTTP.
- Path matching uses common robots heuristics (`*`, trailing `$`, longest-match; Allow wins ties — Google-style).
- Not a full RFC 9309 / Googlebot simulator; exotic encodings and multi-byte paths may be approximate.
- Lint rules are heuristics (empty Disallow, missing UA, duplicate sitemaps, non-rooted paths, etc.).

## Start

```bash
node /workspace/robots-txt-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/robots-txt-lab`

## Skills

- **robots-parse-allow** — Parse robots groups and check path allow/disallow
- **robots-sitemap-lint** — List sitemaps and run heuristic robots lint

## License

MIT © Lawrence Hutchins
