---
name: sitemap-validate
description: >
  Lite-validate pasted sitemap XML (root, required loc, URL shape, duplicate
  locs) and summarize lastmod / changefreq / priority stats. Local only, no fetch.
version: 1.0.0
tags: [sitemap, xml, validate, stats, local]
---

# Sitemap validate & stats

Use these tools on pasted sitemap XML (do not fetch URLs):

1. **`sitemap_validate_lite`** with `xml` — `{findings[], ok}` for root element, missing loc, basic `http(s)` URL shape, and duplicate locs. Warnings for unknown changefreq / out-of-range priority.
2. **`sitemap_stats`** with `xml` — `urlCount`, with/without lastmod, changefreq histogram, priority min/max/avg.

Not a schema / XSD validator and not a full XML parser.

## Example prompts

- "Is this sitemap XML valid enough? Any duplicate locs?"
- "How many urls lack lastmod? Priority spread?"
- "Changefreq histogram for this pasted urlset."
