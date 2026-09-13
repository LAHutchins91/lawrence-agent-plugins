---
name: sitemap-parse
description: >
  Parse pasted sitemap urlset or sitemapindex XML locally with zero-auth
  MCP tools. Lite tag extraction — not a full XML parser. No network fetch.
version: 1.0.0
tags: [sitemap, xml, urlset, sitemapindex, parse, local]
---

# Sitemap parse

Use these tools when the user pastes sitemap XML (never fetch a remote sitemap):

1. **`sitemap_parse_urls`** with `xml` — urlset → `{urls: [{loc, lastmod?, changefreq?, priority?}]}`.
2. **`sitemap_index_parse`** with `xml` — sitemapindex → `{sitemaps: [{loc, lastmod?}]}`.

Lite extractor: CDATA unwrapped naively, namespace prefixes stripped, common entities only. Input cap ~1MB.

If the root is the other document type, the tool errors and names the sibling to call.

## Example prompts

- "Parse this urlset and list every loc."
- "This sitemapindex — what child sitemap URLs and lastmods?"
- "Extract changefreq/priority from this pasted sitemap XML."
