# Changelog

All notable changes to **sitemap-xml-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `sitemap_parse_urls` for urlset XML → `{loc, lastmod?, changefreq?, priority?}`.
- Add `sitemap_index_parse` for sitemapindex XML → `{loc, lastmod?}`.
- Add `sitemap_validate_lite` for root / required loc / URL shape / duplicate loc findings.
- Add `sitemap_stats` for url counts, lastmod coverage, changefreq histogram, and priority stats.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network. Lite XML (not a full parser); ~1MB input cap. Document limits.
