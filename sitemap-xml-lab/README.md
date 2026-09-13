# Sitemap XML Lab

Zero-auth **local** MCP tools for parsing pasted sitemap `urlset` / `sitemapindex` XML, lite validation, and entry stats. String / tag extraction only — no network, no remote sitemap fetch.

This is **not a full XML parser**: CDATA is unwrapped naively, namespace prefixes are stripped, and only a handful of entities (`&amp;` `&lt;` `&gt;` `&quot;` `&apos;` plus numeric) are decoded. Comments and the XML declaration are skipped loosely.

## Tools

| Tool | Purpose |
|------|---------|
| `sitemap_parse_urls` | urlset XML text → `{urls: [{loc, lastmod?, changefreq?, priority?}]}` |
| `sitemap_index_parse` | sitemapindex XML → `{sitemaps: [{loc, lastmod?}]}` |
| `sitemap_validate_lite` | root element, required `loc`, basic URL shape, duplicate locs → `{findings[]}` |
| `sitemap_stats` | counts of urls, with/without lastmod, changefreq histogram, priority stats |

## Limits

- Pasted XML you already have. No sockets, DNS, or remote fetches.
- Input capped at ~1MB (`1048576` characters).
- **Not** a full XML parser: no DTD/XInclude, no default namespace URI resolution, no mixed-content fidelity, no gzip.
- `loc` URL shape is a basic `http:` / `https:` check (WHATWG `URL`), not a crawler.
- Duplicate `loc` detection is exact (trim + entity-decode), case-sensitive.
- Valid `changefreq` values (for warnings / histogram keys): `always`, `hourly`, `daily`, `weekly`, `monthly`, `yearly`, `never`.
- Priority is treated as a 0.0–1.0 number for stats; parse output keeps the raw string.

## Start

```bash
node /workspace/sitemap-xml-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/sitemap-xml-lab`

## Skills

- **sitemap-parse** — parse urlset urls and sitemapindex entries
- **sitemap-validate** — lite findings + stats on pasted sitemap XML

## License

MIT © Lawrence Hutchins — FREE
